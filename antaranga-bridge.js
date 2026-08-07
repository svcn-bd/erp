// ============================================================
// Antaranga recharge bridge.
//
// The ERP (app.html) is a static page with no server of its own, so it
// can't talk to erp.antaranga.net directly — no shared session, and
// Antaranga almost certainly doesn't send CORS headers allowing it anyway.
// This script is the missing piece: it logs into Antaranga once (headless,
// like sync.js), keeps that session alive, and exposes a tiny local HTTP
// API on localhost that the ERP calls instead.
//
// Endpoints (all on http://localhost:4747):
//   GET  /health
//     -> { ok: true, loggedIn: true }
//
//   GET  /recharge/preview?customer_id=47405&months=1
//     -> { ok: true, fields: { username, previousExpiryDate, startDate,
//            newExpiryDate, rechargeFor, pop, package, rechargeAmount,
//            balance } }
//     Mirrors Antaranga's own confirmation modal — does NOT execute
//     anything. perform_recharge=0 under the hood.
//
//   POST /recharge/confirm   body: { "customer_id": 47405, "months": 1 }
//     -> { ok: true, status: true, message: "..." }
//     This is the one that actually executes the recharge. perform_recharge=1.
//     The ERP should only ever call this after a person has reviewed the
//     preview and explicitly clicked a second "Confirm" button — this
//     script does not enforce that itself, so that discipline has to stay
//     in app.html.
//
// USAGE:
//   node antaranga-bridge.js
//   (leave the terminal window open — same idea as `node sync.js --loop`)
// ============================================================

const http = require('http');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { CookieJar } = require('tough-cookie');
const puppeteer = require('puppeteer');

const ANTARANGA_BASE = 'https://erp.antaranga.net';
const ANTARANGA_LOGIN_PATH = '/dcm/login';
const ANTARANGA_USERNAME = 'svcn@gmail.com';
const ANTARANGA_PASSWORD = 'SVCN@123#';
const BRIDGE_PORT = 4747;

const jar = new CookieJar();
let loggedIn = false;

function cookieHeader(url){
  return new Promise((resolve, reject) => {
    jar.getCookieString(url, (err, str) => err ? reject(err) : resolve(str));
  });
}

async function login(){
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1366, height: 900 });
    await page.goto(ANTARANGA_BASE + ANTARANGA_LOGIN_PATH, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('input[type="password"]', { timeout: 20000 });
    await page.type('input[type="password"]', ANTARANGA_PASSWORD, { delay: 20 });

    const userFieldSelectors = ['input[type="email"]', 'input[name*="email" i]', 'input[name*="user" i]', 'input[name*="phone" i]', 'input[type="text"]'];
    for (const sel of userFieldSelectors){
      const el = await page.$(sel);
      if (el){ await el.type(ANTARANGA_USERNAME, { delay: 20 }); break; }
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
      page.keyboard.press('Enter')
    ]);

    const cookies = await page.cookies();
    for (const c of cookies) {
      await new Promise((resolve, reject) =>
        jar.setCookie(`${c.name}=${c.value}`, ANTARANGA_BASE, err => err ? reject(err) : resolve())
      );
    }
    loggedIn = true;
    console.log(`[${new Date().toLocaleTimeString()}] Logged into Antaranga.`);
  } finally {
    await browser.close();
  }
}

// Fetches a page with the current session and pulls out its CSRF token.
// If the session's actually died (redirected to login, no token found),
// this doubles as the detection mechanism — caller re-logs-in and retries once.
async function getCsrfToken(pageUrl){
  const cookies = await cookieHeader(pageUrl);
  const res = await fetch(pageUrl, { headers: { 'Cookie': cookies } });
  const html = await res.text();
  const $ = cheerio.load(html);
  const token = $('meta[name="csrf-token"]').attr('content');
  return { token: token || null, html };
}

async function rechargeCall({ customerId, months, performRecharge }){
  const detailUrl = `${ANTARANGA_BASE}/dcm/radius/customer-details?type=id&search=${encodeURIComponent(customerId)}`;

  let { token } = await getCsrfToken(detailUrl);
  if (!token){
    console.log('Session looks expired — logging in again...');
    await login();
    ({ token } = await getCsrfToken(detailUrl));
    if (!token) throw new Error('Still no CSRF token after re-login — customer-details page may not be loading correctly. Check the customer ID.');
  }

  const params = new URLSearchParams({
    id: String(customerId),
    recharge_for: String(months),
    perform_recharge: performRecharge ? '1' : '0',
    debug: '0',
    _token: token
  });
  const url = `${ANTARANGA_BASE}/dcm/radius/rad-check?fetch-type=rechargeBalance&${params.toString()}`;
  const cookies = await cookieHeader(url);
  const res = await fetch(url, {
    headers: { 'Cookie': cookies, 'X-Requested-With': 'XMLHttpRequest', 'Referer': detailUrl }
  });
  const text = await res.text();

  if (performRecharge){
    // This response is JSON: { status: bool, message: string }
    try {
      return { executed: true, ...JSON.parse(text) };
    } catch (e) {
      throw new Error('Recharge call did not return the expected JSON — Antaranga may have changed something. Raw response: ' + text.slice(0, 300));
    }
  } else {
    // This response is an HTML fragment — parse the label/value table.
    const $ = cheerio.load(text);
    const fields = {};
    $('table tr').each((_, row) => {
      const label = $(row).find('td b').first().text().trim();
      const value = $(row).find('td').eq(1).text().trim().replace(/\s+/g, ' ');
      if (label) fields[label] = value;
    });
    if (!Object.keys(fields).length){
      throw new Error('Preview call did not return the expected table — Antaranga may have changed something, or this customer ID doesn\'t exist. Raw response: ' + text.slice(0, 300));
    }
    return { executed: false, fields };
  }
}

function sendJson(res, status, body){
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(body));
}

function readBody(req){
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch(e) { resolve({}); } });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS'){ sendJson(res, 200, {}); return; }
  const url = new URL(req.url, `http://localhost:${BRIDGE_PORT}`);

  try {
    if (url.pathname === '/health'){
      sendJson(res, 200, { ok: true, loggedIn });
      return;
    }

    if (url.pathname === '/recharge/preview' && req.method === 'GET'){
      const customerId = url.searchParams.get('customer_id');
      const months = url.searchParams.get('months') || '1';
      if (!customerId){ sendJson(res, 400, { ok:false, error:'customer_id is required' }); return; }
      const result = await rechargeCall({ customerId, months, performRecharge: false });
      sendJson(res, 200, { ok: true, fields: result.fields });
      return;
    }

    if (url.pathname === '/recharge/confirm' && req.method === 'POST'){
      const body = await readBody(req);
      if (!body.customer_id){ sendJson(res, 400, { ok:false, error:'customer_id is required' }); return; }
      const result = await rechargeCall({ customerId: body.customer_id, months: body.months || 1, performRecharge: true });
      sendJson(res, 200, { ok: true, status: result.status, message: result.message });
      return;
    }

    sendJson(res, 404, { ok: false, error: 'Not found' });
  } catch (err) {
    console.error('Request failed:', err.message);
    sendJson(res, 500, { ok: false, error: err.message });
  }
});

async function start(){
  console.log('Logging into Antaranga...');
  await login();
  server.listen(BRIDGE_PORT, () => {
    console.log(`\nAntaranga recharge bridge running at http://localhost:${BRIDGE_PORT}`);
    console.log('Leave this window open while using the Recharge button in the ERP. Ctrl+C to stop.\n');
  });
}

start().catch(err => { console.error('Bridge failed to start:', err.message); process.exit(1); });
