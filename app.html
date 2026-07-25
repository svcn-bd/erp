<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SVCN ERP</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
<style>
  :root{
    --bg:#f7f9fc; --card:#ffffff; --blue:#2f7de1; --blue-soft:#eaf2fd; --blue-deep:#1c5bb0;
    --text-hi:#151a23; --text-mid:#6b7686; --text-lo:#9aa4b2; --border:#e7ebf1;
    --red:#e0503f; --red-soft:#fbeae7; --green:#1f9d63; --green-soft:#e7f7ef;
  }
  *{box-sizing:border-box;}
  body{margin:0;background:var(--bg);font-family:'Inter',sans-serif;color:var(--text-hi);}
  .wrap{max-width:1160px;margin:0 auto;padding:28px 32px 60px;}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
  .brand{display:flex;align-items:center;gap:12px;}
  .brand-mark{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,var(--blue),var(--blue-deep));display:flex;align-items:center;justify-content:center;}
  .brand-mark svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:1.7;}
  .brand-name{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:16px;margin:0;}
  .brand-sub{font-size:11px;color:var(--text-lo);letter-spacing:.05em;text-transform:uppercase;margin:0;}
  .btn{border:none;font-weight:600;font-size:13px;padding:9px 16px;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;}
  .btn-primary{background:linear-gradient(135deg,var(--blue),var(--blue-deep));color:#fff;box-shadow:0 6px 16px rgba(47,125,225,.22);}
  .btn-ghost{background:var(--blue-soft);color:var(--blue-deep);}
  .tabs{display:flex;gap:8px;margin-bottom:20px;}
  .tab{padding:8px 14px;border-radius:9px;font-size:13px;font-weight:500;cursor:pointer;color:var(--text-mid);}
  .tab.active{background:var(--card);color:var(--blue-deep);border:1px solid var(--border);}
  .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px;}
  .metric{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px 20px;}
  .metric .label{font-size:12px;color:var(--text-mid);margin:0 0 6px;}
  .metric .value{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:600;margin:0;}
  .metric.due .value{color:var(--red);} .metric.ok .value{color:var(--green);}
  .panel{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:18px 20px;margin-bottom:18px;}
  .panel h3{font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600;margin:0 0 12px;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  th{text-align:left;color:var(--text-lo);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:0 8px 8px 0;}
  td{padding:9px 8px 9px 0;border-top:1px solid var(--border);}
  td.muted{color:var(--text-mid);} td.amt{text-align:right;font-weight:600;color:var(--blue-deep);}
  input,select{width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:#fff;}
  label{font-size:12px;color:var(--text-mid);display:block;margin:0 0 4px;}
  .field{margin-bottom:12px;}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .modal-bg{position:fixed;inset:0;background:rgba(15,20,30,.35);display:none;align-items:center;justify-content:center;z-index:10;}
  .modal-bg.open{display:flex;}
  .modal{background:#fff;border-radius:16px;padding:22px;width:380px;max-height:86vh;overflow:auto;}
  .modal h3{font-family:'Space Grotesk',sans-serif;margin:0 0 14px;}
  .hint{font-size:12px;color:var(--text-lo);margin-top:10px;}
  #receiptCanvas{display:none;}
  .receipt-actions{display:flex;gap:8px;margin-top:14px;}
  .wa-btn{width:28px;height:28px;border-radius:8px;background:var(--blue-soft);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;}
  .wa-btn svg{width:14px;height:14px;stroke:var(--blue-deep);fill:none;stroke-width:2;}
  .due-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-top:1px solid var(--border);}
  .due-row:first-of-type{border-top:none;}
  #configWarn{background:var(--red-soft);color:var(--red);padding:10px 14px;border-radius:10px;font-size:13px;margin-bottom:16px;display:none;}
  #aiToggle{position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--blue-deep));border:none;box-shadow:0 8px 20px rgba(47,125,225,.3);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:20;}
  #aiToggle svg{width:22px;height:22px;stroke:#fff;fill:none;stroke-width:1.8;}
  #aiPanel{position:fixed;bottom:88px;right:24px;width:320px;max-height:420px;background:#fff;border:1px solid var(--border);border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.12);display:none;flex-direction:column;z-index:20;}
  #aiPanel.open{display:flex;}
  #aiMessages{flex:1;overflow-y:auto;padding:14px;font-size:13px;}
  .ai-msg{margin-bottom:10px;padding:8px 10px;border-radius:10px;max-width:85%;}
  .ai-msg.user{background:var(--blue-soft);color:var(--blue-deep);margin-left:auto;}
  .ai-msg.bot{background:var(--bg);}
  #aiInputRow{display:flex;gap:6px;padding:10px;border-top:1px solid var(--border);}
  #aiInputRow input{flex:1;}
</style>
</head>
<body>
<div class="wrap">

  <div id="configWarn">Supabase URL/key not set — edit the CONFIG block near the top of the &lt;script&gt; in this file with your project's values, then reload.</div>

  <div class="topbar">
    <div class="brand">
      <div class="brand-mark"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></div>
      <div><p class="brand-name">SVCN</p><p class="brand-sub">ERP</p></div>
    </div>
    <div style="display:flex;gap:10px;">
      <button class="btn btn-ghost" onclick="openModal('expenseModal')">+ Expense</button>
      <button class="btn btn-primary" onclick="openModal('paymentModal')">+ Add payment</button>
    </div>
  </div>

  <div class="tabs">
    <div class="tab active" data-tab="dashboard" onclick="switchTab('dashboard')">Dashboard</div>
    <div class="tab" data-tab="customers" onclick="switchTab('customers')">Customers</div>
    <div class="tab" data-tab="transactions" onclick="switchTab('transactions')">Transactions</div>
    <div class="tab" data-tab="money" onclick="switchTab('money')">Money</div>
    <div class="tab" data-tab="settings" onclick="switchTab('settings')">Settings</div>
  </div>

  <div id="tab-dashboard">
    <div class="metrics">
      <div class="metric"><p class="label">Collected — this month</p><p class="value" id="mCollected">৳0</p></div>
      <div class="metric due"><p class="label">Dues outstanding</p><p class="value" id="mDues">৳0</p></div>
      <div class="metric ok"><p class="label">Active customers</p><p class="value" id="mCustomers">0</p></div>
      <div class="metric"><p class="label">Expenses — this month</p><p class="value" id="mExpenses">৳0</p></div>
    </div>

    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:18px;">
      <div class="panel">
        <h3>Recent payments</h3>
        <table>
          <tr><th>Customer</th><th>Package</th><th style="text-align:right">Amount</th></tr>
          <tbody id="recentPayments"></tbody>
        </table>
      </div>
      <div class="panel">
        <h3>Customers with dues</h3>
        <div id="duesList"></div>
      </div>
    </div>
  </div>

  <div id="tab-customers" style="display:none;">
    <div class="panel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3 style="margin:0;">All customers</h3>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost" onclick="document.getElementById('importFile').click()">Import Excel</button>
          <button class="btn btn-ghost" onclick="exportCustomersExcel()">Export Excel</button>
          <button class="btn btn-primary" onclick="openModal('customerModal')">+ Add customer</button>
        </div>
        <input type="file" id="importFile" accept=".xlsx,.xls,.csv" style="display:none;" onchange="importCustomersExcel(event)">
      </div>
      <table>
        <tr><th>ID</th><th>Name</th><th>Package</th><th>Phone</th><th style="text-align:right">Bill</th></tr>
        <tbody id="customerRows"></tbody>
      </table>
    </div>
  </div>

  <div id="tab-transactions" style="display:none;">
    <div class="panel">
      <h3>Collected vs expenses — last 6 months</h3>
      <canvas id="trendChart" height="90"></canvas>
    </div>
    <div class="panel">
      <h3>All payments</h3>
      <table>
        <tr><th>Date</th><th>Customer</th><th>Month</th><th>Method</th><th style="text-align:right">Amount</th></tr>
        <tbody id="allPayments"></tbody>
      </table>
    </div>
    <div class="panel">
      <h3>All expenses</h3>
      <table>
        <tr><th>Date</th><th>Description</th><th>Category</th><th style="text-align:right">Amount</th></tr>
        <tbody id="allExpenses"></tbody>
      </table>
    </div>
  </div>

  <div id="tab-money" style="display:none;">
    <div class="panel">
      <h3>Money allocation (%)</h3>
      <div class="row">
        <div class="field"><label>Loan repayment</label><input id="m_loan" type="number"></div>
        <div class="field"><label>Reinvestment</label><input id="m_reinvest" type="number"></div>
      </div>
      <div class="row">
        <div class="field"><label>Marketing</label><input id="m_marketing" type="number"></div>
        <div class="field"><label>Personal savings</label><input id="m_savings" type="number"></div>
      </div>
      <div class="field" style="max-width:200px;"><label>Personal spending</label><input id="m_spending" type="number"></div>
      <p class="hint" id="m_totalHint"></p>
      <button class="btn btn-primary" onclick="saveMoneyAllocation()">Save allocation</button>
    </div>
    <div class="panel">
      <h3>This month's split (based on ৳ collected)</h3>
      <div id="m_breakdown"></div>
    </div>
  </div>

  <div id="tab-settings" style="display:none;">
    <div class="panel">
      <h3>WhatsApp message templates</h3>
      <div class="field"><label>Payment confirmation</label><textarea id="t_payment" rows="3" style="width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;"></textarea></div>
      <div class="field"><label>Reminder</label><textarea id="t_reminder" rows="3" style="width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;"></textarea></div>
      <p class="hint">Use {name}, {amount}, {month}, {paid_through} as placeholders. Saved templates apply to every future draft until changed again.</p>
      <button class="btn btn-primary" onclick="saveTemplates()">Save templates</button>
    </div>
    <div class="panel">
      <h3>Backup</h3>
      <p class="hint" style="margin-top:0;">Export every customer, payment, and expense as a single JSON file you can store elsewhere.</p>
      <button class="btn btn-ghost" onclick="exportBackup()">Download full backup (JSON)</button>
    </div>
  </div>
</div>

<!-- Add customer modal -->
<div class="modal-bg" id="customerModal-bg"><div class="modal">
  <h3>Add customer</h3>
  <div class="field"><label>Customer ID (e.g. RASV043)</label><input id="c_code"></div>
  <div class="field"><label>Name</label><input id="c_name"></div>
  <div class="row">
    <div class="field"><label>Package</label><select id="c_package"><option value="wifi">Wifi</option><option value="wifi_dish">Wifi + Dish</option></select></div>
    <div class="field"><label>Monthly bill (Tk)</label><input id="c_bill" type="number"></div>
  </div>
  <div class="field"><label>Phone</label><input id="c_phone"></div>
  <div class="field"><label>IP address</label><input id="c_ip"></div>
  <div class="field"><label>Address</label><input id="c_address"></div>
  <div style="display:flex;gap:8px;margin-top:8px;">
    <button class="btn btn-primary" onclick="submitCustomer()">Save customer</button>
    <button class="btn btn-ghost" onclick="closeModal('customerModal')">Cancel</button>
  </div>
</div></div>

<!-- Add payment modal -->
<div class="modal-bg" id="paymentModal-bg"><div class="modal">
  <h3>Add payment</h3>
  <div class="field"><label>Customer</label><select id="p_customer" onchange="onPaymentCustomerChange()"></select></div>
  <div class="row">
    <div class="field"><label>Amount (Tk)</label><input id="p_amount" type="number"></div>
    <div class="field"><label>Method</label><select id="p_method"><option value="cash">Cash</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="bank">Bank</option></select></div>
  </div>
  <div class="row">
    <div class="field"><label>Billing month</label><input id="p_month" type="month"></div>
    <div class="field"><label>Paid through</label><input id="p_paidthrough" type="date"></div>
  </div>
  <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="submitPayment()">Save & generate receipt</button>
  <div class="hint">Target: ~20-25s once the customer list is loaded and a default amount/date is pre-filled.</div>
  <canvas id="receiptCanvas" width="640" height="800"></canvas>
  <div id="receiptPreview"></div>
</div></div>

<!-- Add expense modal -->
<div class="modal-bg" id="expenseModal-bg"><div class="modal">
  <h3>Add expense</h3>
  <div class="field"><label>Description</label><input id="e_desc"></div>
  <div class="row">
    <div class="field"><label>Category</label><input id="e_cat" placeholder="e.g. Equipment"></div>
    <div class="field"><label>Amount (Tk)</label><input id="e_amount" type="number"></div>
  </div>
  <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="submitExpense()">Save expense</button>
</div></div>

<button id="aiToggle" onclick="toggleAi()"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></button>
<div id="aiPanel">
  <div id="aiMessages"><div class="ai-msg bot">Hi! Ask me anything about your SVCN data or general questions — e.g. "who has dues this month?"</div></div>
  <div id="aiInputRow">
    <input id="aiInput" placeholder="Ask something..." onkeydown="if(event.key==='Enter') sendAiMessage()">
    <button class="btn btn-primary" onclick="sendAiMessage()">Send</button>
  </div>
</div>

<script>
// ====== CONFIG — replace with your Supabase project values ======
const SUPABASE_URL = 'https://aitgxtutqgryyvqgxelh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdGd4dHV0cWdyeXl2cWd4ZWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjkyMTIsImV4cCI6MjEwMDUwNTIxMn0.qoYbGI7KMSmEvEu3C_GWGTX6Ccz8qZUhmDWhR02g9yw';
const GROQ_API_KEY = 'YOUR-GROQ-API-KEY'; // free at console.groq.com — leave as-is to keep the AI assistant disabled
// ==================================================================

let db = null;
let customersCache = [];

function fmt(n){ return '৳' + Number(n||0).toLocaleString('en-BD'); }

function initSupabase(){
  const looksConfigured = SUPABASE_URL.startsWith('https://') && SUPABASE_URL.length > 20 && SUPABASE_ANON_KEY.length > 50;
  if (!looksConfigured){
    document.getElementById('configWarn').style.display = 'block';
    return false;
  }
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return true;
}

const TABS = ['dashboard','customers','transactions','money','settings'];
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===name));
  TABS.forEach(t=>{ document.getElementById('tab-'+t).style.display = (t===name) ? '' : 'none'; });
  if (name==='transactions') loadTransactions();
  if (name==='money') loadMoneyAllocation();
  if (name==='settings') loadTemplates();
}

function openModal(id){ document.getElementById(id+'-bg').classList.add('open'); }
function closeModal(id){ document.getElementById(id+'-bg').classList.remove('open'); }

async function loadCustomers(){
  const { data, error } = await db.from('customers').select('*').eq('status','active').order('name');
  if (error) { console.error(error); return; }
  customersCache = data;
  const rows = document.getElementById('customerRows');
  rows.innerHTML = data.map(c => `<tr>
    <td class="muted">${c.customer_code}</td><td>${c.name}</td>
    <td class="muted">${c.package_type==='wifi_dish'?'Wifi + Dish':'Wifi'}</td>
    <td class="muted">${c.phone||''}</td><td class="amt">${fmt(c.monthly_bill)}</td></tr>`).join('');
  const sel = document.getElementById('p_customer');
  sel.innerHTML = data.map(c => `<option value="${c.id}" data-bill="${c.monthly_bill}" data-code="${c.customer_code}" data-phone="${c.phone||''}" data-name="${c.name}">${c.name} (${c.customer_code})</option>`).join('');
  document.getElementById('mCustomers').textContent = data.length;
  onPaymentCustomerChange();
}

function onPaymentCustomerChange(){
  const sel = document.getElementById('p_customer');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  document.getElementById('p_amount').value = opt.dataset.bill;
  const now = new Date();
  document.getElementById('p_month').value = now.toISOString().slice(0,7);
  const paidThrough = new Date(now.getFullYear(), now.getMonth()+1, 0);
  document.getElementById('p_paidthrough').value = paidThrough.toISOString().slice(0,10);
}

async function loadDashboard(){
  const monthStart = new Date(); monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().slice(0,10);

  const { data: payments } = await db.from('payments').select('*, customers(name, package_type)').gte('billing_month', monthStartStr).order('created_at', { ascending:false });
  const collected = (payments||[]).reduce((s,p)=>s+Number(p.amount),0);
  document.getElementById('mCollected').textContent = fmt(collected);
  document.getElementById('recentPayments').innerHTML = (payments||[]).slice(0,6).map(p=>`<tr>
    <td>${p.customers?.name||''}</td>
    <td class="muted">${p.customers?.package_type==='wifi_dish'?'Wifi + Dish':'Wifi'}</td>
    <td class="amt">${fmt(p.amount)}</td></tr>`).join('');

  const { data: expenses } = await db.from('expenses').select('*').gte('spent_on', monthStartStr);
  const totalExpenses = (expenses||[]).reduce((s,e)=>s+Number(e.amount),0);
  document.getElementById('mExpenses').textContent = fmt(totalExpenses);

  const { data: dues } = await db.from('customer_dues').select('*').gt('dues', 0);
  const totalDues = (dues||[]).reduce((s,d)=>s+Number(d.dues),0);
  document.getElementById('mDues').textContent = fmt(totalDues);
  document.getElementById('duesList').innerHTML = (dues||[]).slice(0,8).map(d=>`<div class="due-row">
    <span>${d.name}</span>
    <span style="display:flex;align-items:center;gap:8px;">
      <span style="color:var(--red);font-weight:600;">${fmt(d.dues)}</span>
      <a class="wa-btn" href="${waLink(d.phone, buildReminderMessage(d.name, d.dues))}" target="_blank" title="Send reminder">
        <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
      </a>
    </span></div>`).join('') || '<p class="hint">No outstanding dues.</p>';
}

let reminderTemplateText = 'Hi {name}, a friendly reminder that your SVCN bill for {month} is due. Please clear it today — if you need a bit more time, just let us know beforehand. Thank you!';
async function loadReminderTemplate(){
  const { data } = await db.from('message_templates').select('*').eq('id','reminder').single();
  if (data?.body) reminderTemplateText = data.body;
}
function buildReminderMessage(name, dues){
  const monthLabel = new Date().toLocaleString('en', { month:'long', year:'numeric' });
  return reminderTemplateText.replace('{name}', name).replace('{month}', monthLabel).replace('{amount}', dues).replace('{paid_through}', '');
}

async function submitCustomer(){
  const payload = {
    customer_code: document.getElementById('c_code').value.trim(),
    name: document.getElementById('c_name').value.trim(),
    package_type: document.getElementById('c_package').value,
    monthly_bill: Number(document.getElementById('c_bill').value||0),
    phone: document.getElementById('c_phone').value.trim(),
    ip_address: document.getElementById('c_ip').value.trim(),
    address: document.getElementById('c_address').value.trim(),
    portal_password: document.getElementById('c_code').value.trim()
  };
  const { error } = await db.from('customers').insert(payload);
  if (error) { alert(error.message); return; }
  closeModal('customerModal');
  loadCustomers(); loadDashboard();
}

function waLink(phone, text){
  const clean = (phone||'').replace(/[^0-9]/g,'');
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

async function submitPayment(){
  const sel = document.getElementById('p_customer');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const amount = Number(document.getElementById('p_amount').value||0);
  const method = document.getElementById('p_method').value;
  const month = document.getElementById('p_month').value + '-01';
  const paidThrough = document.getElementById('p_paidthrough').value;
  const receiptNo = 'RCPT' + Date.now();

  const { error } = await db.from('payments').insert({
    customer_id: opt.value, billing_month: month, amount, method, paid_through: paidThrough, receipt_no: receiptNo
  });
  if (error) { alert(error.message); return; }

  const { data: tpl } = await db.from('message_templates').select('*').eq('id','payment_confirmation').single();
  const monthLabel = new Date(month).toLocaleString('en', { month:'long', year:'numeric' });
  const msg = (tpl?.body || 'Hi {name}, payment of Tk {amount} received for {month}.')
    .replace('{name}', opt.dataset.name).replace('{amount}', amount).replace('{month}', monthLabel)
    .replace('{paid_through}', paidThrough);

  drawReceipt({ name: opt.dataset.name, code: opt.dataset.code, month: monthLabel, amount, method, paidThrough, receiptNo });

  document.getElementById('receiptPreview').innerHTML = `
    <div class="receipt-actions">
      <a class="btn btn-primary" href="${waLink(opt.dataset.phone, msg)}" target="_blank">Open WhatsApp draft</a>
      <a class="btn btn-ghost" id="downloadReceiptPng">PNG</a>
      <a class="btn btn-ghost" id="downloadReceiptJpg">JPG</a>
    </div>`;
  document.getElementById('downloadReceiptPng').onclick = () => {
    const canvas = document.getElementById('receiptCanvas');
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = receiptNo + '.png'; a.click();
  };
  document.getElementById('downloadReceiptJpg').onclick = () => {
    const canvas = document.getElementById('receiptCanvas');
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/jpeg', 0.92); a.download = receiptNo + '.jpg'; a.click();
  };

  loadDashboard(); loadCustomers();
}

function drawReceipt({name, code, month, amount, method, paidThrough, receiptNo}){
  const canvas = document.getElementById('receiptCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#151a23'; ctx.font = '600 26px Space Grotesk, sans-serif';
  ctx.fillText('Payment successful', 40, 60);
  ctx.font = '400 14px Inter, sans-serif'; ctx.fillStyle = '#6b7686';
  ctx.fillText('Thank you for your payment', 40, 84);

  const rows = [
    ['Customer', name], ['Customer ID', code], ['Billing month', month],
    ['Amount paid', 'Tk ' + amount], ['Method', method], ['Dues remaining', 'Tk 0'],
    ['Paid through', paidThrough], ['Receipt no.', receiptNo]
  ];
  let y = 140;
  rows.forEach(([label, val])=>{
    ctx.fillStyle = '#6b7686'; ctx.font = '400 15px Inter, sans-serif'; ctx.fillText(label, 40, y);
    ctx.fillStyle = '#151a23'; ctx.font = '500 15px Inter, sans-serif'; ctx.fillText(String(val), 300, y);
    y += 34;
  });
  ctx.fillStyle = '#9aa4b2'; ctx.font = '400 12px Inter, sans-serif';
  ctx.fillText('This is a computer-generated receipt.', 40, y+30);
  ctx.fillText('Please clear the bill by today. If a delay is needed, kindly let us know beforehand.', 40, y+50);
}

async function submitExpense(){
  const payload = {
    description: document.getElementById('e_desc').value.trim(),
    category: document.getElementById('e_cat').value.trim(),
    amount: Number(document.getElementById('e_amount').value||0)
  };
  const { error } = await db.from('expenses').insert(payload);
  if (error) { alert(error.message); return; }
  closeModal('expenseModal');
  loadDashboard();
}

function exportCustomersExcel(){
  const rows = customersCache.map(c => ({
    'Customer ID': c.customer_code, 'Name': c.name, 'Package': c.package_type,
    'Phone': c.phone, 'IP Address': c.ip_address, 'Address': c.address, 'Monthly Bill': c.monthly_bill
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  XLSX.writeFile(wb, 'svcn-customers.xlsx');
}

async function importCustomersExcel(event){
  const file = event.target.files[0];
  if (!file) return;
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type:'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);
  const payload = rows.map(r => ({
    customer_code: String(r['Customer ID']||r['IP']||'').trim(),
    name: String(r['Name']||r['Client Name']||'').trim(),
    package_type: /dish/i.test(r['Package']||'') ? 'wifi_dish' : 'wifi',
    phone: String(r['Phone']||r['Phone Number']||'').trim(),
    ip_address: String(r['IP Address']||r['IP']||'').trim(),
    address: String(r['Address']||r['Client Address']||'').trim(),
    monthly_bill: Number(r['Monthly Bill']||r['Client Bill']||0),
    portal_password: String(r['Customer ID']||r['IP']||'').trim()
  })).filter(r => r.customer_code && r.name);
  if (!payload.length){ alert('No valid rows found — check the column headers match the template.'); return; }
  const { error } = await db.from('customers').insert(payload);
  if (error) { alert(error.message); return; }
  event.target.value = '';
  loadCustomers();
  alert(`Imported ${payload.length} customers.`);
}

let trendChartInstance = null;
async function loadTransactions(){
  const { data: payments } = await db.from('payments').select('*, customers(name)').order('created_at', { ascending:false });
  document.getElementById('allPayments').innerHTML = (payments||[]).map(p=>`<tr>
    <td class="muted">${new Date(p.created_at).toLocaleDateString()}</td>
    <td>${p.customers?.name||''}</td>
    <td class="muted">${new Date(p.billing_month).toLocaleString('en',{month:'short',year:'numeric'})}</td>
    <td class="muted">${p.method}</td><td class="amt">${fmt(p.amount)}</td></tr>`).join('');

  const { data: expenses } = await db.from('expenses').select('*').order('spent_on', { ascending:false });
  document.getElementById('allExpenses').innerHTML = (expenses||[]).map(e=>`<tr>
    <td class="muted">${new Date(e.spent_on).toLocaleDateString()}</td>
    <td>${e.description}</td><td class="muted">${e.category||''}</td><td class="amt">${fmt(e.amount)}</td></tr>`).join('');

  const months = [];
  const now = new Date();
  for (let i=5;i>=0;i--){ const d = new Date(now.getFullYear(), now.getMonth()-i, 1); months.push(d); }
  const labels = months.map(d=>d.toLocaleString('en',{month:'short'}));
  const collectedByMonth = months.map(d => (payments||[]).filter(p=>{
    const pd = new Date(p.billing_month); return pd.getFullYear()===d.getFullYear() && pd.getMonth()===d.getMonth();
  }).reduce((s,p)=>s+Number(p.amount),0));
  const expensesByMonth = months.map(d => (expenses||[]).filter(e=>{
    const ed = new Date(e.spent_on); return ed.getFullYear()===d.getFullYear() && ed.getMonth()===d.getMonth();
  }).reduce((s,e)=>s+Number(e.amount),0));

  const ctx = document.getElementById('trendChart');
  if (trendChartInstance) trendChartInstance.destroy();
  trendChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [
      { label:'Collected', data:collectedByMonth, backgroundColor:'#2f7de1', borderRadius:6 },
      { label:'Expenses', data:expensesByMonth, backgroundColor:'#e0503f', borderRadius:6 }
    ]},
    options: { responsive:true, plugins:{ legend:{ position:'top', labels:{ boxWidth:10, font:{ size:11 } } } }, scales:{ y:{ grid:{ color:'#e7ebf1' } }, x:{ grid:{ display:false } } } }
  });
}

async function loadMoneyAllocation(){
  const { data } = await db.from('money_allocation').select('*').eq('id',1).single();
  if (!data) return;
  document.getElementById('m_loan').value = data.loan_repayment_pct;
  document.getElementById('m_reinvest').value = data.reinvestment_pct;
  document.getElementById('m_marketing').value = data.marketing_pct;
  document.getElementById('m_savings').value = data.personal_savings_pct;
  document.getElementById('m_spending').value = data.personal_spending_pct;
  renderMoneyBreakdown(data);
}

async function renderMoneyBreakdown(alloc){
  const monthStart = new Date(); monthStart.setDate(1);
  const { data: payments } = await db.from('payments').select('amount').gte('billing_month', monthStart.toISOString().slice(0,10));
  const collected = (payments||[]).reduce((s,p)=>s+Number(p.amount),0);
  const rows = [
    ['Loan repayment', alloc.loan_repayment_pct], ['Reinvestment', alloc.reinvestment_pct],
    ['Marketing', alloc.marketing_pct], ['Personal savings', alloc.personal_savings_pct],
    ['Personal spending', alloc.personal_spending_pct]
  ];
  document.getElementById('m_breakdown').innerHTML = rows.map(([label,pct])=>`<div class="due-row">
    <span>${label} (${pct}%)</span><span style="font-weight:600;">${fmt(collected*pct/100)}</span></div>`).join('');
}

async function saveMoneyAllocation(){
  const payload = {
    id: 1,
    loan_repayment_pct: Number(document.getElementById('m_loan').value||0),
    reinvestment_pct: Number(document.getElementById('m_reinvest').value||0),
    marketing_pct: Number(document.getElementById('m_marketing').value||0),
    personal_savings_pct: Number(document.getElementById('m_savings').value||0),
    personal_spending_pct: Number(document.getElementById('m_spending').value||0)
  };
  const total = payload.loan_repayment_pct + payload.reinvestment_pct + payload.marketing_pct + payload.personal_savings_pct + payload.personal_spending_pct;
  document.getElementById('m_totalHint').textContent = `Total: ${total}%` + (total!==100 ? ' — heads up, this doesn\'t add up to 100%' : '');
  const { error } = await db.from('money_allocation').upsert(payload);
  if (error) { alert(error.message); return; }
  loadMoneyAllocation();
}

async function loadTemplates(){
  const { data } = await db.from('message_templates').select('*');
  const map = Object.fromEntries((data||[]).map(t=>[t.id, t.body]));
  document.getElementById('t_payment').value = map.payment_confirmation || '';
  document.getElementById('t_reminder').value = map.reminder || '';
}

async function saveTemplates(){
  const rows = [
    { id:'payment_confirmation', body: document.getElementById('t_payment').value },
    { id:'reminder', body: document.getElementById('t_reminder').value }
  ];
  const { error } = await db.from('message_templates').upsert(rows);
  if (error) { alert(error.message); return; }
  alert('Templates saved — every future draft will use the new wording.');
}

async function exportBackup(){
  const [{ data: customers }, { data: payments }, { data: expenses }] = await Promise.all([
    db.from('customers').select('*'), db.from('payments').select('*'), db.from('expenses').select('*')
  ]);
  const blob = new Blob([JSON.stringify({ exported_at:new Date().toISOString(), customers, payments, expenses }, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `svcn-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
}

function toggleAi(){ document.getElementById('aiPanel').classList.toggle('open'); }

async function sendAiMessage(){
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;
  const box = document.getElementById('aiMessages');
  box.innerHTML += `<div class="ai-msg user">${text}</div>`;
  input.value = '';
  box.scrollTop = box.scrollHeight;

  if (GROQ_API_KEY.includes('YOUR-GROQ')){
    box.innerHTML += `<div class="ai-msg bot">The AI assistant needs a free Groq API key — get one at console.groq.com and paste it into the GROQ_API_KEY line near the top of this file.</div>`;
    box.scrollTop = box.scrollHeight;
    return;
  }

  const { data: dues } = await db.from('customer_dues').select('*').gt('dues', 0);
  const context = `Customers currently with dues: ${(dues||[]).map(d=>`${d.name} owes ${d.dues}`).join('; ') || 'none'}.`;

  box.innerHTML += `<div class="ai-msg bot" id="aiThinking">Thinking...</div>`;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model:'llama-3.1-8b-instant',
        messages:[
          { role:'system', content:`You are a helpful assistant for SVCN, a small internet/dish provider in Chattogram. ${context}` },
          { role:'user', content:text }
        ]
      })
    });
    const json = await res.json();
    const reply = json.choices?.[0]?.message?.content || 'Sorry, I could not get a response.';
    document.getElementById('aiThinking').textContent = reply;
  } catch(e){
    document.getElementById('aiThinking').textContent = 'Something went wrong reaching the AI service.';
  }
  box.scrollTop = box.scrollHeight;
}

if (initSupabase()){
  loadCustomers();
  loadDashboard();
  loadReminderTemplate();
}
</script>
</body>
</html>
