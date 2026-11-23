/** Run: node scripts/verify-local-date.mjs */

function formatLocalDateYmd(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseLocalDateYmd(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

function isLocalDateTodayOrFuture(value) {
  const selected = parseLocalDateYmd(value);
  if (!selected) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected.getTime() >= today.getTime();
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
  console.log(`PASS: ${msg}`);
}

const today = formatLocalDateYmd();
assert(isLocalDateTodayOrFuture(today), "Today accepted");
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
assert(isLocalDateTodayOrFuture(formatLocalDateYmd(tomorrow)), "Future accepted");
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
assert(!isLocalDateTodayOrFuture(formatLocalDateYmd(yesterday)), "Past rejected");
assert(!isLocalDateTodayOrFuture("1999-12-31"), "Old date rejected");

console.log("\nAll frontend local-date checks passed.");
