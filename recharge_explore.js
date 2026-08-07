// ============================================================
// Antaranga recharge-flow explorer.
//
// This does NOT perform a recharge. It logs you into Antaranga in a
// REAL, VISIBLE browser window, then gets out of the way — you click
// through the flow yourself (Search → Username → customer code →
// their ID link → the Recharge circle → the confirmation modal), and
// each time you come back to this terminal and press Enter, it saves
// a screenshot + the full page HTML of whatever's on screen right now.
//
// Why manual clicks instead of scripted ones: we don't know Antaranga's
// real selectors yet (same situation as the login page originally —
// guessing blindly just produced a dead chrome-error page until we saw
// the real markup). Letting you drive means zero guessing, and zero
// risk of this script accidentally hitting the real green "Recharge"
// button while exploring.
//
// USAGE:
//   node recharge-explore.js
//
// Then in the browser window that opens:
//   1. Click Search → choose Username → type a TEST customer's code → Enter
//      -> back here, press Enter to capture "search-results"
//   2. Click that customer's ID link to open their detail page
//      -> press Enter to capture "customer-detail"
//   3. Click the Recharge circle
//      -> press Enter to capture "recharge-modal"  (this is the important one —
//         it has Previous/New Expiry, Package, Amount, Balance)
//   4. IMPORTANT: click Cancel / close the modal — do NOT click the green
//      Recharge button. We only want to see the modal's markup, not execute
//      a real recharge on a test run.
//   5. Press Ctrl+C here to close the browser and exit.
//
// Send back debug-search-results.html, debug-customer-detail.html, and
// debug-recharge-modal.html (plus the matching .png files) — that's what
// lets the real automation get built without guessing at selectors.
// ============================================================

const puppeteer = require('puppeteer');
const readline = require('readline');

const ANTARANGA_BASE = 'https://erp.antaranga.net';
const ANTARANGA_LOGIN_PATH = '/dcm/login';
const ANTARANGA_USERNAME = 'svcn@gmail.com';
const ANTARANGA_PASSWORD = 'SVCN@123#';

let captureCount = 0;

async function saveState(page, label){
  captureCount++;
  const safeLabel = String(captureCount).padStart(2,'0') + '-' + label;
  try {
    await page.screenshot({ path: `debug-${safeLabel}.png`, fullPage: true });
    const fs = require('fs');
    fs.writeFileSync(`debug-${safeLabel}.html`, await page.content());
    console.log(`\nSaved debug-${safeLabel}.png / .html`);
    console.log('Current URL:', page.url());
  } catch (e) {
    console.log('Could not capture state:', e.message);
  }
}

function waitForEnter(prompt){
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(prompt, () => { rl.close(); resolve(); }));
}

async function login(page){
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
  console.log('Logged in. Browser window is open — over to you.\n');
}

async function run(){
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'], defaultViewport: { width: 1366, height: 900 } });
  const page = await browser.newPage();

  console.log('Logging in...');
  await login(page);

  console.log('======================================================');
  console.log('STEP 1: In the browser, click Search → Username → type a TEST customer code → Enter.');
  console.log('Then come back here and press Enter to capture the search results.');
  console.log('======================================================');
  await waitForEnter('Press Enter once the search results are showing... ');
  await saveState(page, 'search-results');

  console.log('\n======================================================');
  console.log('STEP 2: Click that customer\'s ID link to open their detail page.');
  console.log('======================================================');
  await waitForEnter('Press Enter once their detail page is showing... ');
  await saveState(page, 'customer-detail');

  console.log('\n======================================================');
  console.log('STEP 3: Click the Recharge circle to open the confirmation modal.');
  console.log('======================================================');
  await waitForEnter('Press Enter once the recharge confirmation modal is showing... ');
  await saveState(page, 'recharge-modal');

  console.log('\n======================================================');
  console.log('IMPORTANT: Click Cancel / close the modal now — do NOT click the green');
  console.log('Recharge button. We only needed to see the modal\'s markup.');
  console.log('======================================================');
  await waitForEnter('Press Enter once you\'ve closed the modal (or press Ctrl+C to exit now)... ');

  console.log('\nAll done. Send back the debug-01.../02.../03... .html and .png files.');
  console.log('Press Ctrl+C to close the browser and exit.');
  await new Promise(() => {}); // keep the browser open until the user Ctrl+Cs
}

run().catch(err => { console.error('Explorer failed:', err.message); process.exit(1); });
