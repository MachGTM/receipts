/*
 * Receipts check: a pattern check for sales emails, following the Receipts Standard v1.
 * https://github.com/MachGTM/receipts/blob/main/STANDARD.md
 *
 * It finds sentences that look like claims and tells you which ones carry a source.
 * It is not a fact check: it can't tell whether a claim is true, only whether it shows
 * where it came from. Runs entirely in the browser (or Node). No network calls.
 * Licence: MIT.
 */
(function (root) {
  "use strict";

  var URL_RE = /\bhttps?:\/\/[^\s<>()\]]+/i;
  var FOOTNOTE_MARK_RE = /\[(\d{1,2})\]|\((\d{1,2})\)|([¹²³⁴⁵⁶⁷⁸⁹])/g;
  var SUPERSCRIPTS = { "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };

  var SIGN_OFF_RE = /^(best|best regards|regards|kind regards|warm regards|thanks|thank you|many thanks|cheers|talk soon|all the best|sincerely|warmly|speak soon)\b[\s,!.]*$/i;
  var GREETING_RE = /^(hi|hey|hello|dear|good (morning|afternoon|evening))\b[^.!?]{0,40}[,!]?\s*$/i;
  var SOURCES_HEADER_RE = /^(sources?|receipts?|references?|links?)\s*:?\s*$/i;
  var FOOTNOTE_LINE_RE = /^\s*(?:\[(\d{1,2})\]|(\d{1,2})[.)]|([¹²³⁴⁵⁶⁷⁸⁹]))\s*(.*)$/;

  // What makes a sentence a claim. Each rule names the part of the standard it relates to.
  var CLAIM_RULES = [
    { id: "saw", about: "prospect", re: /\b(i|we)\s+(just\s+)?(saw|noticed|read|came across|see|heard|spotted|found)\b/i,
      why: "Says you saw something about them. R1: link to what you saw." },
    { id: "congrats", about: "prospect", re: /\b(congrats|congratulations|kudos)\b/i,
      why: "Congratulates them on something. R1: link to the news." },
    { id: "you-did", about: "prospect",
      re: /\b(you|your\s+(team|company|firm|business|org|organisation|organization|sales team|founders?|ceo|cto|board))\b[^.!?]{0,40}?\b(just\s+)?(raised|hired|have|has|'ve|run|runs|sell|sells|serve|serves|employ|employs|work with|said|says|wrote|shared|mentioned|told|tweeted|published|are hiring|is hiring|'re hiring|launched|expanded|are expanding|'re expanding|is expanding|opened|grew|are growing|'re growing|is growing|use|uses|are using|'re using|switched|announced|posted|acquired|closed|moved|rolled out|started|won|signed|partnered|released|shipped|doubled|tripled|added|built|went)\b/i,
      why: "States a fact about their company. R1: add the source and date." },
    { id: "since-you", about: "prospect", re: /\b(since|now that|given that|given|as|with)\s+(you|your)\s+(recent|new|latest|focus|growth|expansion|launch|funding|raise|move|push|plans?|hiring|are|'re|have|'ve|just)\b/i,
      why: "Builds on something about them. R1: show where that came from." },
    { id: "pain", about: "guess",
      re: /\b(you|your|teams like yours|companies like yours|leaders like you|folks like you)\b[^.!?]{0,60}\b(struggl\w*|challeng\w*|pain\w*|frustrat\w*|bottleneck\w*|problem\w*|issues?|headaches?|stuck|losing|wasting|burning|behind)\b/i,
      why: "States a problem they might not have. R3: ask it as a question instead." },
    { id: "pain2", about: "guess",
      re: /\b(probably|likely|i bet|i imagine|i('m| am) guessing|i('m| am) sure|must be|i assume)\b/i,
      why: "A guess written as a statement. R3: ask it instead." },
    { id: "everyone", about: "world",
      re: /\b(most|many|every|all|the majority of|nearly all|top)\s+(companies|teams|leaders|founders|sales teams|sales leaders|revenue teams|cfos|ctos|ceos|buyers|reps|sdrs|startups|firms|b2b companies)\b[^.!?]*\b(are|is|have|has|struggle|use|want|need|see|lose|waste|miss|now)\b/i,
      why: "A claim about the market. R1: name the study and link it." },
    { id: "we-did", about: "seller",
      re: /\b(we|our\s+(team|customers|clients|platform|product|tool|software|ai))\b[^.!?]{0,60}?\b(helped|help|increased|increase|reduced|reduce|grew|grow|saved|save|cut|doubled|tripled|boosted|boost|improved|improve|generated|booked|drove|delivered|achieved|lifted|raised|lowered)\b[^.!?]*\d/i,
      why: "A result with a number. R2: link the case study." },
    { id: "social-proof", about: "seller",
      re: /\b(trusted by|used by|loved by|chosen by|relied on by|customers like|clients like|clients such as|customers such as|companies like|brands like|teams at|working with companies like)\b/i,
      why: "Names customers or proof. R2: link it or name only customers who agreed." },
    { id: "superlative", about: "seller",
      re: /(#1\b|\bnumber one\b|\bleading\b|\bindustry[- ]leading\b|\bbest[- ]in[- ]class\b|\bworld[- ]class\b|\bthe only\b|\bfastest\b|\bmost (accurate|trusted|advanced|powerful)\b)/i,
      why: "A ranking or 'best' claim. R2: show who said so." },
    { id: "stat", about: "world",
      re: /(\b\d+(\.\d+)?\s?%|\bper ?cent\b|\b(studies|research|surveys?|reports?|data|analysts?|gartner|forrester|mckinsey)\b[^.!?]{0,30}\b(show|shows|showed|found|finds|says|said|suggest|suggests|predict|predicts)\b|\baccording to\b)/i,
      why: "A statistic or study. R1: name it and link it." },
    { id: "number", about: "unknown", re: /(\b\d+\s+(open|new|roles?|jobs?|people|employees|reps|sellers|engineers|offices|locations|customers|clients|countries|markets|hires|accounts)\b|\$\s?\d|\b\d[\d,]*(\.\d+)?\s?(x|k|m|mn|bn|million|billion|crore|lakh)\b|\b\d{2,}[\d,]*\b)/i,
      why: "Contains a number. If it's a fact, it needs a source." }
  ];

  // Sentences that are the ask, not a claim. Checked before the claim rules.
  var CTA_RE = /\b(worth a|open to|happy to|would you|could we|can we|shall we|let me know|grab|book|hop on|jump on|find time|15|20|30)\b[^.!?]*\b(call|chat|minutes|mins|meeting|demo|time|conversation|look|walkthrough)\b/i;
  var TIME_ONLY_RE = /^\W*(mon|tues|wednes|thurs|fri|satur|sun)day\b|\b\d{1,2}(:\d{2})?\s?(am|pm)\b/i;

  function splitSentences(text) {
    var out = [];
    String(text || "").split("\n").forEach(function (line) {
      if (!line.trim()) return;
      // protect links and abbreviations so their dots don't end a sentence
      var saved = [];
      var safe = line.replace(/\bhttps?:\/\/[^\s<>()\]]+|\b(e\.g|i\.e|etc|vs|mr|mrs|ms|dr|inc|ltd|co|st)\./gi, function (m) {
        saved.push(m);
        return "\u0000" + (saved.length - 1) + "\u0000";
      });
      safe.split(/(?<=[.!?]["')\]]?)\s+(?=\S)/).forEach(function (part) {
        var restored = part.replace(/\u0000(\d+)\u0000/g, function (_, i) { return saved[Number(i)]; }).trim();
        if (restored) out.push(restored);
      });
    });
    return out;
  }

  function parse(raw) {
    var lines = String(raw || "").replace(/\r\n?/g, "\n").split("\n");
    var footnotes = {};
    var body = [];
    var subject = null;
    var inSources = false;
    var signedOff = false;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var t = line.trim();
      if (!t) { body.push(""); continue; }
      var sm = t.match(/^subject\s*:\s*(.+)$/i);
      if (sm && subject === null && body.join("").trim() === "") { subject = sm[1]; continue; }
      if (SOURCES_HEADER_RE.test(t)) { inSources = true; continue; }
      var fm = t.match(FOOTNOTE_LINE_RE);
      if (fm && URL_RE.test(fm[4] || "")) {
        var n = fm[1] || fm[2] || SUPERSCRIPTS[fm[3]];
        footnotes[String(n)] = (fm[4].match(URL_RE) || [""])[0];
        continue;
      }
      if (inSources && URL_RE.test(t)) { footnotes["*" + i] = (t.match(URL_RE) || [""])[0]; continue; }
      if (signedOff) continue;
      if (SIGN_OFF_RE.test(t)) { signedOff = true; continue; }
      if (body.join("").trim() === "" && GREETING_RE.test(t)) continue;
      body.push(line);
    }
    return { subject: subject, body: body.join("\n"), footnotes: footnotes };
  }

  function receiptFor(sentence, footnotes) {
    var u = sentence.match(URL_RE);
    if (u) return { kind: "link", source: u[0] };
    var m;
    FOOTNOTE_MARK_RE.lastIndex = 0;
    while ((m = FOOTNOTE_MARK_RE.exec(sentence)) !== null) {
      var n = m[1] || m[2] || SUPERSCRIPTS[m[3]];
      if (footnotes[String(n)]) return { kind: "footnote", source: footnotes[String(n)], mark: String(n) };
    }
    return null;
  }

  function classify(sentence, footnotes) {
    var s = sentence.trim();
    var bare = s.replace(URL_RE, " ");
    if (/\?["')\]]*\s*$/.test(s)) {
      return { status: "asked", label: "Asked, not stated", why: "Questions are always fine under R3." };
    }
    var hits = CLAIM_RULES.filter(function (r) { return r.re.test(bare); });
    var strong = hits.filter(function (r) { return r.id !== "number"; });
    // The ask ("Worth a 15-minute call next week.") is not a claim, unless it also asserts something.
    if (!strong.length && (CTA_RE.test(bare) || TIME_ONLY_RE.test(bare))) {
      return { status: "plain", label: "The ask", why: "An invitation, not a claim." };
    }
    if (!hits.length) {
      return { status: "plain", label: "Not a claim", why: "Nothing here a reader could check." };
    }
    var guess = hits.filter(function (r) { return r.about === "guess"; })[0];
    if (guess) {
      return { status: "guess", label: "Guess stated as fact", why: guess.why, rule: guess.id, about: "prospect" };
    }
    var rule = strong[0] || hits[0];
    var receipt = receiptFor(s, footnotes);
    if (receipt) {
      return { status: "sourced", label: "Has a source", why: "Links to " + receipt.source, rule: rule.id, about: rule.about, receipt: receipt };
    }
    return { status: "unsourced", label: "No source", why: rule.why, rule: rule.id, about: rule.about };
  }

  function check(raw) {
    var p = parse(raw);
    var items = [];
    var subjectItem = null;
    if (p.subject) {
      subjectItem = classify(p.subject, p.footnotes);
      subjectItem.text = p.subject; subjectItem.where = "subject";
      items.push(subjectItem);
    }
    splitSentences(p.body).forEach(function (s) {
      var c = classify(s, p.footnotes);
      c.text = s; c.where = "body";
      items.push(c);
    });
    // A subject line that repeats a sourced claim from the body borrows its receipt.
    if (subjectItem && subjectItem.status === "unsourced") {
      var keys = function (t) {
        return (t.toLowerCase().match(/\$?\d[\d,.]*%?|[a-z]{5,}/g) || []);
      };
      var sk = keys(subjectItem.text);
      var backer = items.filter(function (x) { return x.where === "body" && x.status === "sourced"; }).filter(function (x) {
        var bk = keys(x.text);
        var shared = sk.filter(function (k) { return bk.indexOf(k) !== -1; });
        return shared.some(function (k) { return /\d/.test(k); }) || shared.length >= 2;
      })[0];
      if (backer) {
        subjectItem.status = "sourced"; subjectItem.label = "Has a source";
        subjectItem.why = "Repeats a sourced line in the email."; subjectItem.receipt = backer.receipt;
      }
    }
    var claims = items.filter(function (x) { return x.status === "sourced" || x.status === "unsourced" || x.status === "guess"; });
    var sourced = claims.filter(function (x) { return x.status === "sourced"; }).length;
    var guesses = claims.filter(function (x) { return x.status === "guess"; }).length;
    var asked = items.filter(function (x) { return x.status === "asked"; }).length;
    var score = claims.length === 0 ? 100 : Math.round((sourced / claims.length) * 100);
    return {
      standard: "Receipts Standard v1.0",
      items: items,
      claims: claims.length,
      sourced: sourced,
      unsourced: claims.length - sourced - guesses,
      guesses: guesses,
      asked: asked,
      score: score,
      summary: "Receipts: " + sourced + " of " + claims.length + " claims (" + score + ")"
    };
  }

  var api = { check: check, parse: parse, splitSentences: splitSentences, classify: classify, rules: CLAIM_RULES };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ReceiptsCheck = api;
})(this);
