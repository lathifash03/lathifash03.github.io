// Draws the Open Graph card for each locale: 1200x630, the hero's own
// composition (status, name, statement) on --paper, every word taken from
// content/<locale>/profile.json (CLAUDE.md hard rule 6).
//
// Run by hand after changing a profile's name, status or statement:
//   node scripts/make-og.mjs
// It writes public/og/<locale>.png, which is committed. It is deliberately not
// part of `npm run build`: it drives headless Chrome and fetches the webfonts
// from Google, so a build would then need a browser and a network.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["en", "id"];

/** The tokens the card uses, copied from app/globals.css §2–§3. */
const paper = "#efede8";
const ink = "#1f1e1b";
const ink2 = "#5f5c56";
const line = "#dad6cc";

const chrome =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function card({ status, name, statement }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=Plus+Jakarta+Sans:wght@400;600&display=block" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:630px}
  body{
    background:${paper};color:${ink};
    font-family:"Plus Jakarta Sans",ui-sans-serif,system-ui,sans-serif;
    display:flex;flex-direction:column;justify-content:center;
    padding:84px 88px;
  }
  .status{
    font-family:"IBM Plex Mono",ui-monospace,monospace;
    font-size:21px;letter-spacing:.02em;color:${ink2};
    display:flex;align-items:center;gap:14px;
  }
  .status::before{
    content:"";width:52px;height:1px;background:${line};
  }
  h1{
    margin-top:30px;
    font-size:104px;font-weight:600;line-height:.95;letter-spacing:-.03em;
  }
  p{
    margin-top:34px;max-width:24em;
    font-size:33px;font-weight:400;line-height:1.32;letter-spacing:-.01em;
  }
</style></head>
<body>
  <div class="status">${escape(status)}</div>
  <h1>${escape(name)}</h1>
  <p>${escape(statement)}</p>
</body></html>`;
}

mkdirSync(join(root, "public/og"), { recursive: true });

for (const locale of locales) {
  const profile = JSON.parse(
    readFileSync(join(root, `content/${locale}/profile.json`), "utf8"),
  );
  const html = join(root, `public/og/.${locale}.html`);
  writeFileSync(html, card(profile), "utf8");

  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      // Lets the webfonts arrive before the shot is taken.
      "--virtual-time-budget=8000",
      `--screenshot=${join(root, `public/og/${locale}.png`)}`,
      `file://${html}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );

  rmSync(html);
  console.log(`✓ public/og/${locale}.png — ${profile.name}`);
}
