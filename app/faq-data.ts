export const FAQ_ITEMS = [
  {
    q: "Do I need an API key or Claude credits?",
    a: "No. Everything runs through your existing `claude` CLI login (Pro, Max, or Code). This repo never talks to the Anthropic API directly and never adds usage of its own.",
  },
  {
    q: "Is this a subscription?",
    a: "No — one-time payment. You get permanent collaborator access to the private repo and can `git pull` for updates whenever they ship.",
  },
  {
    q: "What if I don't have Claude Code set up?",
    a: "Then this isn't the right fit yet. You need a Claude subscription you can run non-interactively from a terminal — set that up first.",
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
    a: "Yes — anywhere Node.js and the `claude` CLI run: Windows, macOS, and Linux.",
  },
  {
    q: "Do I need an internet connection?",
    a: "Yes. Coaching, grading, and dry-run generation all run through your local `claude` CLI, which talks to Anthropic over the internet.",
  },
  {
    q: "Does this work with the Claude free plan?",
    a: "No. The free plan doesn't support the CLI usage this needs — you need Claude Pro, Max, or a Code plan you can run non-interactively.",
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
