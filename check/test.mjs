// node check/test.mjs : checks the receipts check against known emails.
import { createRequire } from "module"
import assert from "assert"
const { check } = createRequire(import.meta.url)("./receipts-check.js")
const bad = "Subject: Quick idea for Acme's 3x growth\n\nHi Priya,\n\nI saw Acme is expanding into Europe. Congrats on the recent funding!\nTeams like yours usually struggle with pipeline once they pass 50 reps.\nWe helped a fintech like you grow pipeline by 312% in 90 days.\nTrusted by 500+ revenue teams, we're the #1 AI SDR on the market.\nWorth a 15-minute call next week?\n\nBest,\nSam"
const good = "Subject: Your 6 open SDR roles\n\nHi Priya,\n\nYou have 6 open SDR roles on your careers page, 4 posted this month [1].\nYour CEO said on 3 Oct that Europe is the next market [2].\nHow are you thinking about ramping the new reps before Q1?\nWe wrote up how one services firm cut ramp time from 90 to 45 days: https://example.com/case-study\nOpen to a 20-minute call on Thursday?\n\nThanks,\nSam\n\n[1] https://example.com/careers\n[2] https://example.com/ceo-post"
const ask = "Hi Priya,\n\nWould it help to see how other teams handle the first week of a new SDR?\nHappy to send a short guide.\n\nCheers,\nSam"
let r = check(bad); assert.equal(r.summary, "Receipts: 0 of 6 claims (0)"); assert.equal(r.guesses, 1); assert.equal(r.asked, 1)
r = check(good); assert.equal(r.summary, "Receipts: 4 of 4 claims (100)"); assert.equal(r.asked, 2)
r = check(ask); assert.equal(r.summary, "Receipts: 0 of 0 claims (100)")
r = check("Most sales teams now waste half their week on research."); assert.equal(r.items[0].status, "unsourced")
r = check("I'm guessing pipeline is top of mind this quarter."); assert.equal(r.items[0].status, "guess")
r = check("Would a short call on Tuesday at 3pm work?"); assert.equal(r.items[0].status, "asked")
r = check("We cut research time by 70% for Acme (case study: https://example.com/acme)."); assert.equal(r.items[0].status, "sourced")
r = check("Line without punctuation about your 12 new hires"); assert.equal(r.claims, 1)
console.log("receipts check: all tests passed")
