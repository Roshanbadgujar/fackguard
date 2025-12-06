// src/lib/fakeDetector.js

const CLICKBAIT_WORDS = [
  "shocking",
  "you won't believe",
  "secret",
  "exposed",
  "breaking",
  "sensational",
  "miracle",
  "guaranteed",
  "click here",
  "viral",
  "trending",
];

const ALL_CAPS_REGEX = /[A-Z]{8,}/g;

const TRUSTED_DOMAINS = [
  "bbc.com",
  "thehindu.com",
  "ndtv.com",
  "indiatoday.in",
  "indianexpress.com",
  "reuters.com",
  "apnews.com",
  "theguardian.com",
];

const SUS_DOMAINS_HINT = [
  "blogspot.",
  "wordpress.",
  "substack.com",
  "medium.com",
  "clickbait",
  "news-xyz",
];

export function analyzeTextContent(text) {
  let fakeScore = 0;
  const reasons = [];
  const lower = text.toLowerCase();

  // length check
  if (text.length < 60) {
    fakeScore += 15;
    reasons.push("Text is very short – less context provided.");
  } else if (text.length > 600) {
    reasons.push("Text is relatively detailed, which is slightly positive.");
    fakeScore -= 5;
  }

  // clickbait words
  CLICKBAIT_WORDS.forEach((word) => {
    if (lower.includes(word)) {
      fakeScore += 12;
      reasons.push(`Contains clickbait term: "${word}".`);
    }
  });

  // ALL CAPS emphasis
  const capsMatches = text.match(ALL_CAPS_REGEX);
  if (capsMatches && capsMatches.length > 0) {
    fakeScore += 10;
    reasons.push("Contains long ALL CAPS words – looks sensational.");
  }

  // exclamation marks
  const exclamCount = (text.match(/!/g) || []).length;
  if (exclamCount >= 3) {
    fakeScore += 10;
    reasons.push("Too many exclamation marks – looks exaggerated.");
  }

  // numbers without source
  const numbersCount = (text.match(/\d+/g) || []).length;
  if (numbersCount > 3 && !/source|report|study|data/gi.test(text)) {
    fakeScore += 7;
    reasons.push("Multiple numeric claims with no mentioned source.");
  }

  // normalize
  if (fakeScore < 0) fakeScore = 0;
  if (fakeScore > 100) fakeScore = 100;

  let label = "SUSPECT";
  if (fakeScore >= 65) label = "FAKE";
  else if (fakeScore <= 35) label = "LIKELY_REAL";

  return { fakeScore, label, reasons };
}

export function analyzeUrl(urlString) {
  let fakeScore = 50;
  const reasons = [];

  let host = "";
  try {
    const u = new URL(urlString);
    host = u.hostname.replace("www.", "");
  } catch (err) {
    fakeScore += 10;
    reasons.push("Invalid URL format.");
  }

  if (host) {
    if (TRUSTED_DOMAINS.some((d) => host.endsWith(d))) {
      fakeScore -= 25;
      reasons.push(`Domain "${host}" is in trusted news sources list.`);
    }

    if (SUS_DOMAINS_HINT.some((d) => host.includes(d))) {
      fakeScore += 20;
      reasons.push(`Domain "${host}" looks like a personal/low-cred blog.`);
    }

    // hyphens and digits in domain
    const dashCount = (host.match(/-/g) || []).length;
    if (dashCount >= 3) {
      fakeScore += 10;
      reasons.push("Domain has many dashes – suspicious naming.");
    }
  }

  if (fakeScore < 0) fakeScore = 0;
  if (fakeScore > 100) fakeScore = 100;

  let label = "SUSPECT";
  if (fakeScore >= 65) label = "FAKE";
  else if (fakeScore <= 35) label = "LIKELY_REAL";

  return { fakeScore, label, reasons, host };
}
