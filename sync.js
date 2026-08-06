// ============================================================
// Antaranga sync — logs into erp.antaranga.net with your own
// credentials, pulls client status, and writes it into Supabase
// for the SVCN portal/ERP to read.
//
// STATUS: login, authenticated fetch, and parsing are all working,
// calibrated against a real antaranga-response-debug.html capture
// (the client list is a plain HTML table, #customer-table, one <tr>
// per customer). Run with --debug any time you want a fresh capture
// to re-check against, e.g. after Antaranga changes their markup.
// ============================================================

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { CookieJar } = require('tough-cookie');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');

// ====== CONFIG — fill these in ======
const ANTARANGA_BASE = 'https://erp.antaranga.net';
const ANTARANGA_LOGIN_PATH = '/dcm/login';       // confirmed correct login path
const ANTARANGA_USERNAME = 'svcn@gmail.com';
const ANTARANGA_PASSWORD = 'SVCN@123#';

const SUPABASE_URL = 'https://aitgxtutqgryyvqgxelh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdGd4dHV0cWdyeXl2cWd4ZWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjkyMTIsImV4cCI6MjEwMDUwNTIxMn0.qoYbGI7KMSmEvEu3C_GWGTX6Ccz8qZUhmDWhR02g9yw';  // service role key preferred for a background script
// =====================================

const jar = new CookieJar();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function isDebugRun(){
  return Boolean(process.env.DEBUG_SAVE_HTML) || process.argv.includes('--debug');
}

async function cookieHeader(url){
  return new Promise((resolve, reject) => {
    jar.getCookieString(url, (err, str) => err ? reject(err) : resolve(str));
  });
}

// Logs in with a real (headless) browser instead of a plain HTTP request,
// since the login form is rendered by JavaScript rather than present in
// the raw page source. Drives the page the way a human would: wait for
// the form to appear, fill it in, submit, then hand the resulting
// session cookies to the fast plain-HTTP fetch used for the data pull.
// Saves whatever the browser actually has on screen right now — screenshot,
// full HTML, current URL/title, and a list of every <iframe> present — so a
// failed selector wait can be diagnosed instead of guessed at. Called from
// the catch block below, and safe to call even if the page is half-loaded.
async function saveDebugArtifacts(page, label){
  try {
    await page.screenshot({ path: `debug-${label}.png`, fullPage: true });
    const html = await page.content();
    fs.writeFileSync(`debug-${label}.html`, html);
    const url = page.url();
    const title = await page.title().catch(() => '(no title)');
    const frames = page.frames().map(f => f.url());
    console.log(`\n---- DEBUG (${label}) ----`);
    console.log('Current URL:  ', url);
    console.log('Page title:   ', title);
    console.log('Frames found: ', frames.length > 1 ? frames.join(', ') : '(none besides main frame)');

    if (url.startsWith('chrome-error:')) {
      // This isn't a real page — Chrome never reached the site at all. The
      // interstitial's HTML/DOM usually contains the underlying net:: error
      // code even though the visible text is generic, so pull it out directly
      // instead of leaving it buried in the saved HTML file.
      const codeMatch = html.match(/ERR_[A-Z_]+/);
      console.log('*** Navigation never reached the real site — this is a Chrome network-error page, not the login form. ***');
      console.log('Underlying network error:', codeMatch ? codeMatch[0] : '(not found in page HTML — check debug-' + label + '.html manually for "ERR_" or open the .png)');
    }

    console.log(`Saved debug-${label}.png and debug-${label}.html — send both back.`);
    console.log('---------------------------\n');
  } catch (e) {
    console.log('Could not save debug artifacts:', e.message);
  }
}

// Quick sanity check using a plain HTTP request (no browser) before we bother
// spinning up Puppeteer at all. If this succeeds but the headless browser
// still can't reach the site, that points at something headless-Chrome-specific
// (bot/TLS-fingerprint detection, a corporate proxy only regular browsers are
// configured for, etc.) rather than a general DNS/connectivity/certificate issue.
async function preflightCheck(){
  const target = ANTARANGA_BASE + ANTARANGA_LOGIN_PATH;
  try {
    const res = await fetch(target, { redirect: 'manual' });
    console.log(`Preflight (plain HTTP, no browser): reached ${target} — status ${res.status}.`);
  } catch (e) {
    console.log(`Preflight (plain HTTP, no browser) FAILED to reach ${target}: ${e.message}`);
    console.log('This suggests the problem is general connectivity (DNS, certificate, firewall, VPN) rather than something specific to the headless browser.');
  }
}

async function login(){
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });

  try {
    await page.goto(ANTARANGA_BASE + ANTARANGA_LOGIN_PATH, { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    await saveDebugArtifacts(page, 'goto-failed');
    await browser.close();
    throw new Error(`Navigation to ${ANTARANGA_BASE + ANTARANGA_LOGIN_PATH} failed outright: ${e.message}`);
  }

  try {
    await page.waitForSelector('input[type="password"]', { timeout: 20000 });
  } catch (e) {
    await saveDebugArtifacts(page, 'login-page');
    await browser.close();
    throw new Error(
      'No password field showed up on the login page within 20s. Open debug-login-page.png to see ' +
      'what actually loaded (a splash/consent screen? a different login layout? a CAPTCHA?), and check ' +
      'the logged "Current URL" in case ' + ANTARANGA_LOGIN_PATH + ' redirected somewhere else or 404\'d. ' +
      'If the form is inside an <iframe> (see "Frames found" above), the selector needs to target that frame instead of the main page.'
    );
  }

  try {
    // Fill the password field
    await page.type('input[type="password"]', ANTARANGA_PASSWORD, { delay: 20 });

    // Fill whatever the username/email field is — tries the common patterns first
    const userFieldSelectors = [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[name*="user" i]',
      'input[name*="phone" i]',
      'input[type="text"]'
    ];
    let userFieldFilled = false;
    for (const sel of userFieldSelectors){
      const el = await page.$(sel);
      if (el){ await el.type(ANTARANGA_USERNAME, { delay: 20 }); userFieldFilled = true; break; }
    }
    if (!userFieldFilled) {
      await saveDebugArtifacts(page, 'no-username-field');
      throw new Error('Could not find a username/email field on the login page (password field was found, so this got further than before) — see debug-no-username-field.png/.html.');
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
      page.keyboard.press('Enter')
    ]);

    if (isDebugRun()) await saveDebugArtifacts(page, 'after-submit');

    // Pull the resulting session cookies into our lightweight cookie jar,
    // so the rest of the script can keep using fast plain HTTP requests.
    const cookies = await page.cookies();
    for (const c of cookies) {
      await new Promise((resolve, reject) =>
        jar.setCookie(`${c.name}=${c.value}`, ANTARANGA_BASE, err => err ? reject(err) : resolve())
      );
    }
  } finally {
    await browser.close();
  }

  const finalCookies = await cookieHeader(ANTARANGA_BASE);
  if (!finalCookies.includes('session')) {
    console.warn('Warning: no session-looking cookie found after login — login may not have succeeded. Set --debug and check antaranga-response-debug.html to confirm.');
  }
  console.log('Login step completed via headless browser.');
}

async function fetchClientStatus(){
  const url = ANTARANGA_BASE + '/dcm/radius/rad-check?fetch-type=indexSearch&online_status=&per_page=200';
  const cookies = await cookieHeader(url);
  const res = await fetch(url, { headers: { 'Cookie': cookies, 'X-Requested-With': 'XMLHttpRequest' } });
  const html = await res.text();

  if (process.env.DEBUG_SAVE_HTML || process.argv.includes('--debug')) {
    fs.writeFileSync('antaranga-response-debug.html', html);
    console.log('Saved raw response to antaranga-response-debug.html — send this file back to finish the parser.');
  }
  return html;
}

// ====== Calibrated against the real markup (antaranga-response-debug.html) ======
// The customer list is a plain, well-structured HTML table: <table id="customer-table">,
// one <tr> per customer, each <td> carrying a data-label attribute that names the
// column ("ID", "Status", "Online", "Username", "Name", "Address", "Mobile",
// "Bill Cycle", "Expiry", "Package", "Bill Amount", "Manager", "POP", "C. Date").
// The customer's portal-facing code (e.g. "RASV001") lives in the "Username"
// column's <a> text — that's what matches customers.customer_code in Supabase.
// "ID" is Antaranga's own internal numeric client id (e.g. 46172) — unrelated
// to our customer_code, but stable and useful as an idempotent upsert key.
function normalizeOnlineStatus(text){
  const t = (text || '').trim().toLowerCase();
  if (t === 'online') return 'online';
  if (t === 'offline') return 'offline';
  if (t.includes('connect')) return 'cant_connect'; // "Can't Connect" — mirrors Antaranga's own data-state value
  return t.replace(/\s+/g, '_') || null;
}

function parseClients(html){
  const $ = cheerio.load(html);
  const results = [];

  $('#customer-table tbody > tr').each((_, row) => {
    const $row = $(row);
    const cell = (label) => $row.find(`td[data-label="${label}"]`).first();
    const text = (label) => cell(label).text().trim().replace(/\s+/g, ' ');

    const usernameCell = cell('Username');
    const usernameLink = usernameCell.find('a');
    const customerCode = (usernameLink.length ? usernameLink.text() : usernameCell.text()).trim();
    if (!customerCode) return; // not a real customer row (e.g. an empty/summary row) — skip it

    const statusText = cell('Status').text().trim();               // "Enabled" / "Disabled"
    const onlineText = cell('Online').text().trim();                // "Online" / "Offline" / "Can't Connect"
    const expirySpanText = cell('Expiry').find('span').first().text().trim();
    const billAmountDigits = text('Bill Amount').replace(/[^\d.]/g, '');
    const billCycleDigits = text('Bill Cycle').replace(/[^\d]/g, '');
    const idDigits = text('ID').replace(/[^\d]/g, '');

    results.push({
      antaranga_customer_code: customerCode,                        // e.g. "RASV001" — matches customers.customer_code
      antaranga_internal_id: idDigits ? Number(idDigits) : null,     // Antaranga's own numeric id, e.g. 46172
      is_enabled: /enabled/i.test(statusText),
      status_raw: statusText.toLowerCase() || null,
      is_online: /^online$/i.test(onlineText),
      online_status: normalizeOnlineStatus(onlineText),
      name: text('Name') || null,
      address: text('Address') || null,
      mobile: text('Mobile') || null,
      bill_cycle: billCycleDigits ? Number(billCycleDigits) : null,
      expiry_date: expirySpanText || text('Expiry') || null,
      package_name: text('Package') || null,
      bill_amount: billAmountDigits ? Number(billAmountDigits) : null,
      manager: text('Manager') || null,
      pop: text('POP') || null,
      antaranga_created_at: text('C. Date') || null,
      // Not present in this table at all — "SVCN-500" etc. is a plan/price tier name,
      // not a raw Mbps figure. Leave null unless you want to maintain a package-name
      // → speed lookup, or pull the per-client detail page for a true bandwidth value.
      bandwidth_mbps: null
    });
  });

  return results;
}
// =================================================================================

async function syncToSupabase(clients){
  let matched = 0, unmatched = 0, statusChanges = 0;

  // Fetch existing status once up front, so change-detection below doesn't need an
  // extra query per client — just one lookup table built from a single query.
  const { data: existingRows } = await supabase.from('network_status').select('antaranga_internal_id, online_status, customer_id');
  const existingByInternalId = new Map((existingRows||[]).map(r => [r.antaranga_internal_id, r]));

  for (const c of clients) {
    if (!c.antaranga_customer_code) continue;
    const { data: match } = await supabase.from('customers').select('id').eq('customer_code', c.antaranga_customer_code).maybeSingle();
    if (match?.id) matched++; else unmatched++;

    // Log only real status *changes* (online → offline, etc.), not every 15-minute
    // sync cycle — this keeps network_status_events a clean event log that real
    // uptime % and outage-duration calculations can be built from, instead of
    // network_status itself, which gets overwritten every cycle and has no history.
    const prev = existingByInternalId.get(c.antaranga_internal_id);
    if (prev && prev.online_status && prev.online_status !== c.online_status) {
      const { error: evErr } = await supabase.from('network_status_events').insert({
        customer_id: match?.id || prev.customer_id || null,
        antaranga_customer_code: c.antaranga_customer_code,
        old_status: prev.online_status,
        new_status: c.online_status
      });
      if (!evErr) statusChanges++;
      else console.error(`Could not log status change for ${c.antaranga_customer_code}:`, evErr.message);
    }

    const { error } = await supabase.from('network_status').upsert({
      customer_id: match?.id || null,
      antaranga_customer_code: c.antaranga_customer_code,
      antaranga_internal_id: c.antaranga_internal_id,
      is_online: c.is_online,
      online_status: c.online_status,
      is_enabled: c.is_enabled,
      status_raw: c.status_raw,
      name: c.name,
      address: c.address,
      mobile: c.mobile,
      bill_cycle: c.bill_cycle,
      expiry_date: c.expiry_date,
      package_name: c.package_name,
      bill_amount: c.bill_amount,
      manager: c.manager,
      pop: c.pop,
      antaranga_created_at: c.antaranga_created_at,
      bandwidth_mbps: c.bandwidth_mbps,
      last_synced_at: new Date().toISOString()
    }, { onConflict: 'antaranga_internal_id' }); // stable key that's always present, unlike customer_id which is null for unmatched rows
    if (error) console.error(`Upsert failed for ${c.antaranga_customer_code}:`, error.message);
  }
  console.log(`Synced ${clients.length} client records (${matched} matched to a local customer, ${unmatched} did not — check customer_code formatting if that number looks high). ${statusChanges} status change(s) logged this cycle.`);
}

async function runOnce(){
  await preflightCheck();
  await login();
  const html = await fetchClientStatus();
  const clients = parseClients(html);
  console.log(`Parsed ${clients.length} clients.`);
  if (clients.length) await syncToSupabase(clients);
}

function parseIntervalMinutes(){
  const arg = process.argv.find(a => a.startsWith('--every='));
  if (arg) {
    const mins = Number(arg.split('=')[1]);
    if (mins > 0) return mins;
  }
  return 15; // default interval when --loop is passed with no explicit --every=
}

function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

// Keeps this process alive and re-syncs on a fixed interval — this is what makes
// "last synced" in the ERP/portal actually keep moving, instead of only updating
// the one time you happened to run the script by hand. Launches a fresh browser
// each cycle (rather than keeping one open for hours), so it stays memory-safe
// left running for days. Ctrl+C stops it cleanly after the current cycle finishes.
async function runLoop(intervalMinutes){
  console.log(`Loop mode: syncing every ${intervalMinutes} minute(s). Press Ctrl+C to stop.`);
  let stopping = false;
  process.on('SIGINT', () => { stopping = true; console.log('\nStopping after this cycle finishes...'); });

  while (!stopping) {
    const startedAt = new Date();
    try {
      await runOnce();
      console.log(`[${startedAt.toLocaleTimeString()}] Sync cycle complete. Next run in ${intervalMinutes} minute(s).\n`);
    } catch (err) {
      console.error(`[${startedAt.toLocaleTimeString()}] Sync cycle failed: ${err.message}. Will retry next cycle.\n`);
    }
    if (stopping) break;
    await sleep(intervalMinutes * 60 * 1000);
  }
  console.log('Stopped.');
}

if (process.argv.includes('--loop')) {
  runLoop(parseIntervalMinutes());
} else {
  runOnce().catch(err => { console.error('Sync failed:', err.message); process.exit(1); });
}
