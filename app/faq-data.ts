export const FAQ_ITEMS = [
  {
    q: "Do I need an API key?",
    a: "No, not by default — everything runs through your existing Claude, Codex, or Gemini CLI login (your choice). If you'd rather bill per-token instead of using your subscription, you can set that CLI's own API key env var, but it's optional. This repo never talks to any AI provider directly and never adds usage of its own.",
  },
  {
    q: "Is this a subscription?",
    a: "No — one-time payment. You get permanent collaborator access to the private repo and can `git pull` for updates whenever they ship.",
  },
  {
    q: "What if I don't have Claude Code set up?",
    a: "You don't have to use Claude — Codex CLI and Gemini CLI work too, pick whichever you already have. If you have none of the three set up (or an API key for one of them), set one up first, this isn't the right fit yet without it.",
  },
  {
    q: "Can I use a language other than Java for practice?",
    a: "Yes. The base solutions are Java, but the conversion feature ports any solution into the language you actually interview in.",
  },
  {
    q: "Can I share this with a friend?",
    a: "No — it's licensed to your GitHub account specifically. The app checks live that you're still a collaborator before it'll run, so it won't work under someone else's account.",
  },
  {
    q: "Do I need to know Git or GitHub well?",
    a: "Just the basics. Payment sends a GitHub collaborator invite to your account automatically, then it's one `git clone` to set up and `git pull` whenever updates ship — no dashboards, no other accounts.",
  },
  {
    q: "Does this work on Windows, Mac, or Linux?",
    a: "Yes — anywhere Node.js and your chosen AI CLI (Claude, Codex, or Gemini) run: Windows, macOS, and Linux.",
  },
  {
    q: "Do I need an internet connection?",
    a: "Yes. Coaching, grading, and dry-run generation all run through your local AI CLI, which talks to its provider over the internet.",
  },
  {
    q: "Does this work with a free plan?",
    a: "No. Free tiers generally don't support the non-interactive CLI usage this needs — you need a paid subscription (Claude Pro/Max/Code, ChatGPT Plus/Pro, or Gemini Code Assist/AI Pro/Ultra) or an API key for whichever CLI you pick.",
  },
  {
    q: "How long does setup take?",
    a: "A few minutes: sign in with GitHub, `git clone`, `node start.js`. Nothing else to install.",
  },
  {
    q: "Refunds?",
    a: "No refunds once GitHub access has been granted — it's a digital product, delivered and usable immediately.",
  },
];
