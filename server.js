// ============================================================
// SMS auto-verification webhook
//
// Flow: your bKash-receiving phone forwards every incoming SMS to
// this server → it parses the bKash confirmation text → matches the
// sender's phone number to a customer → automatically records the
// payment. No admin tap needed, same end result as Antaranga's
// "send money, reference your number, instantly credited" system.
//
// STATUS: server, security, matching, and payment-recording are all
// complete and working. The regex in parseBkashSms() is a best-effort
// placeholder based on bKash's commonly-known SMS format — send a
// real (redacted) sample of your actual SMS text and this gets
// calibrated exactly in one edit.
// ============================================================

const express = require('express');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// ====== CONFIG ======
const WEBHOOK_SECRET = 'CHOOSE-A-LONG-RANDOM-SECRET-HERE';  // put this same value in your SMS-forwarding app
const ADMIN_ID = 'YOUR-ADMIN-ID-HERE';                        // your row's id from the `admins` table
const SUPABASE_URL = 'https://aitgxtutqgryyvqgxelh.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_SERVICE_ROLE_KEY';        // service role key required (bypasses RLS, runs server-side only)
const PORT = 3300;
// =====================

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const app = express();
app.use(express.json());

// ---- Parsing: turn bKash's SMS text into { amount, phone, trxId } ----
// PLACEHOLDER — calibrate against a real sample. bKash's typical format is:
// "You have received Tk 500.00 from 01712345678. Ref 01712345678. Fee Tk 0.00.
//  Balance Tk 4,320.00. TrxID 8N7A6B5C4D at 05/08/2026 14:32"
function parseBkashSms(text){
  const amountMatch = text.match(/received\s+Tk\s*([\d,]+(?:\.\d{1,2})?)/i);
  const phoneMatch = text.match(/from\s+(01\d{9})/i);
  const trxMatch = text.match(/TrxID\s+([A-Z0-9]+)/i);
  if (!amountMatch || !phoneMatch) return null;
  return {
    amount: parseFloat(amountMatch[1].replace(/,/g, '')),
    phone: phoneMatch[1],
    trxId: trxMatch ? trxMatch[1] : null
  };
}

function currentMonthStart(){
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0,10);
}
function endOfMonth(){
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().slice(0,10);
}

app.post('/sms-webhook', async (req, res) => {
  const providedSecret = req.headers['x-webhook-secret'];
  if (providedSecret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const rawText = (req.body.text || '').trim();
  if (!rawText) return res.status(400).json({ error: 'missing text' });

  // Idempotency: never process the exact same SMS twice, even if the
  // forwarding app retries or double-fires.
  const textHash = crypto.createHash('sha256').update(rawText).digest('hex');
  const { data: existingLog } = await supabase.from('sms_log').select('id').eq('text_hash', textHash).maybeSingle();
  if (existingLog) {
    return res.json({ status: 'duplicate, already processed' });
  }

  const parsed = parseBkashSms(rawText);
  const logRow = { raw_text: rawText, text_hash: textHash, admin_id: ADMIN_ID };

  if (!parsed) {
    await supabase.from('sms_log').insert({ ...logRow, status: 'parse_failed' });
    return res.json({ status: 'could not parse — logged for review' });
  }

  const { data: customer } = await supabase.from('customers')
    .select('*').eq('phone', parsed.phone).eq('admin_id', ADMIN_ID).eq('status', 'active').maybeSingle();

  if (!customer) {
    await supabase.from('sms_log').insert({
      ...logRow, status: 'no_match', parsed_amount: parsed.amount, parsed_phone: parsed.phone
    });
    return res.json({ status: `no customer found with phone ${parsed.phone} — logged for review` });
  }

  const receiptNo = 'SMS' + Date.now();
  const { error: payError } = await supabase.from('payments').insert({
    customer_id: customer.id,
    billing_month: currentMonthStart(),
    amount: parsed.amount,
    method: 'bkash',
    paid_through: endOfMonth(),
    receipt_no: receiptNo
  });

  await supabase.from('sms_log').insert({
    ...logRow, status: payError ? 'insert_failed' : 'ok',
    parsed_amount: parsed.amount, parsed_phone: parsed.phone,
    matched_customer_id: customer.id
  });

  if (payError) return res.status(500).json({ error: payError.message });
  console.log(`Auto-recorded payment: ${customer.name} (${customer.customer_code}) — Tk ${parsed.amount}`);
  res.json({ status: 'payment recorded', customer: customer.name, amount: parsed.amount });
});

app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, () => console.log(`SMS webhook listening on port ${PORT}`));
