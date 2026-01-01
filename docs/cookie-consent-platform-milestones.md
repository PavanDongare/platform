# Cookie Consent Management Platform - Milestones

A OneTrust-like application for scanning websites, categorizing scripts, and generating consent management solutions.

---

## Project Overview

**Goal**: Build a cookie consent management tool that:
1. Scans websites to discover all JavaScript sources (including dynamically loaded via GTM)
2. Categorizes scripts using AI (Necessary vs Marketing)
3. Maintains a catalog of websites and their scripts
4. Generates a consent script for website integration
5. Demo on any public website via Chrome extension

---

## Architecture Overview (Simplified)

```
┌─────────────────────────────────────────────────────────────────┐
│                         DASHBOARD                               │
│         (Add website, view results, get consent script)         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API LAYER                              │
│    /api/scan    /api/websites    /api/generate-script           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CORE PIPELINE                              │
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   Browser    │ ─▶ │     AI       │ ─▶ │   Database   │     │
│   │  (Playwright)│    │ Categorize   │    │   (Catalog)  │     │
│   │   Network    │    │              │    │              │     │
│   │   Capture    │    │              │    │              │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

For demo on public sites:
┌─────────────────────────────────────────────────────────────────┐
│              CHROME EXTENSION (MV2)                             │
│         webRequest blocking + Consent UI                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why Browser Automation is Required

Google Tag Manager (GTM) and similar tag managers are extremely common. They load tracking scripts dynamically:

```
Simple fetch sees:     │  Browser sees:
                       │
- googletagmanager.com │  - googletagmanager.com
                       │  - google-analytics.com  (loaded by GTM)
                       │  - doubleclick.net       (loaded by GTM)
                       │  - facebook.net          (loaded by GTM)
```

**Network capture in browser catches everything that actually loads.**

---

## Deployment Consideration

Playwright needs a browser binary (~280MB). Vercel has a 50MB limit.

**Solution**: Use Browserless.io (browser-as-a-service)

| Environment | How it works |
|-------------|--------------|
| Local dev | Playwright runs browser locally |
| Production | Connect to Browserless.io via WebSocket |

```javascript
// Same code, different browser source
const browser = process.env.BROWSERLESS_URL
  ? await playwright.chromium.connect(process.env.BROWSERLESS_URL)
  : await playwright.chromium.launch();
```

Browserless.io free tier: 1000 requests/month (plenty for demo).

---

## Milestone 1: Script Scanner (Browser + Network Capture)

**Goal**: Given a URL, capture ALL scripts that load (including dynamically loaded ones).

### What to Build
```javascript
const playwright = require('playwright');

async function scanWebsite(url) {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  const scripts = [];

  // Capture all script network requests
  page.on('request', request => {
    if (request.resourceType() === 'script') {
      scripts.push(request.url());
    }
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for lazy-loaded scripts
  await page.waitForTimeout(3000);

  await browser.close();

  // Deduplicate and extract domains
  const uniqueScripts = [...new Set(scripts)];

  return uniqueScripts.map(url => ({
    url,
    domain: new URL(url).hostname
  }));
}
```

### Output
```javascript
[
  { url: "https://www.googletagmanager.com/gtag/js?id=G-XXX", domain: "googletagmanager.com" },
  { url: "https://www.google-analytics.com/analytics.js", domain: "google-analytics.com" },
  { url: "https://connect.facebook.net/en_US/fbevents.js", domain: "facebook.net" },
  { url: "https://js.stripe.com/v3/", domain: "stripe.com" }
]
```

### Test Cases
| Test | Input | Expected |
|------|-------|----------|
| Basic site | URL with scripts in HTML | Scripts captured |
| GTM site | Site using Google Tag Manager | GTM + all scripts GTM loads |
| No scripts | Simple HTML page | Empty array |
| Invalid URL | "not-a-url" | Error thrown |
| Timeout | Unresponsive site | Timeout error |

### Deliverable
```
src/
  scanner/
    index.ts
    scanner.test.ts
```

---

## Milestone 2: AI Categorizer

**Goal**: Send list of script URLs/domains to AI, get back categorization.

### What to Build
```javascript
async function categorizeScripts(scripts) {
  const prompt = `You are a web privacy expert. Categorize these JavaScript sources.

Scripts found:
${scripts.map(s => s.domain).join('\n')}

Categories:
- necessary: Essential for site function (payments, auth, core features)
- marketing: Analytics, advertising, tracking, social media pixels

Return JSON only:
{
  "necessary": ["domain1.com", "domain2.com"],
  "marketing": ["domain3.com", "domain4.com"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",  // cheap and fast
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### Why This Works
- Domain names alone tell the AI most of what it needs
- `googletagmanager.com` → AI knows it's analytics/marketing
- `stripe.com` → AI knows it's necessary (payments)
- No need to download or analyze actual script content

### Test Cases
| Test | Input | Expected |
|------|-------|----------|
| Known domains | ["stripe.com", "google-analytics.com"] | Correct categories |
| Mixed list | 10 various domains | All categorized |
| Unknown domain | ["random-cdn.com"] | Best guess with reasoning |
| API error | Network failure | Graceful error handling |

### Deliverable
```
src/
  categorizer/
    index.ts
    categorizer.test.ts
```

---

## Milestone 3: Database Catalog

**Goal**: Store websites and their categorized scripts.

### Schema (Simple)
```sql
-- Websites
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  last_scanned_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scripts with categories
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  url TEXT,
  category TEXT NOT NULL,  -- 'necessary' or 'marketing'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX idx_scripts_website ON scripts(website_id);
```

### API Functions
```javascript
// Save scan results
async function saveScanResults(websiteUrl, categorizedScripts) {
  // Upsert website
  const website = await db.query(`
    INSERT INTO websites (url, last_scanned_at)
    VALUES ($1, NOW())
    ON CONFLICT (url) DO UPDATE SET last_scanned_at = NOW()
    RETURNING id
  `, [websiteUrl]);

  const websiteId = website.rows[0].id;

  // Clear old scripts, insert new
  await db.query(`DELETE FROM scripts WHERE website_id = $1`, [websiteId]);

  for (const [category, domains] of Object.entries(categorizedScripts)) {
    for (const domain of domains) {
      await db.query(`
        INSERT INTO scripts (website_id, domain, category)
        VALUES ($1, $2, $3)
      `, [websiteId, domain, category]);
    }
  }

  return websiteId;
}

// Get catalog for a website
async function getCatalog(websiteId) {
  return db.query(`
    SELECT domain, category FROM scripts WHERE website_id = $1
  `, [websiteId]);
}
```

### Test Cases
| Test | Operation | Expected |
|------|-----------|----------|
| Save results | Insert new website + scripts | Data persisted |
| Rescan | Update existing website | Old scripts replaced |
| Get catalog | Fetch by website ID | All scripts returned |
| Delete website | Remove website | Cascade deletes scripts |

### Deliverable
```
src/
  database/
    schema.sql
    index.ts
    database.test.ts
```

---

## Milestone 4: Job Queue (Database-based)

**Goal**: Queue website scans for batch processing.

### Why Database Queue?
- Simple to understand and debug
- No external dependencies (Redis, etc.)
- Perfect for learning
- Can see job status by querying table

### Schema
```sql
CREATE TABLE scan_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, processing, completed, failed
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error TEXT
);
```

### Core Functions
```javascript
// Add job to queue
async function enqueueJob(websiteUrl) {
  const result = await db.query(`
    INSERT INTO scan_jobs (website_url)
    VALUES ($1)
    RETURNING id
  `, [websiteUrl]);
  return result.rows[0].id;
}

// Worker claims next job (atomic)
async function claimNextJob() {
  const result = await db.query(`
    UPDATE scan_jobs
    SET status = 'processing', started_at = NOW()
    WHERE id = (
      SELECT id FROM scan_jobs
      WHERE status = 'pending'
      ORDER BY created_at
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING *
  `);
  return result.rows[0] || null;
}

// Mark complete
async function completeJob(jobId) {
  await db.query(`
    UPDATE scan_jobs
    SET status = 'completed', completed_at = NOW()
    WHERE id = $1
  `, [jobId]);
}

// Mark failed
async function failJob(jobId, error) {
  await db.query(`
    UPDATE scan_jobs
    SET status = 'failed', error = $1
    WHERE id = $2
  `, [error, jobId]);
}
```

### Worker Loop
```javascript
async function runWorker() {
  while (true) {
    const job = await claimNextJob();

    if (!job) {
      await sleep(30000);  // No work, wait 30 seconds
      continue;
    }

    try {
      // Run the full pipeline
      const scripts = await scanWebsite(job.website_url);
      const categorized = await categorizeScripts(scripts);
      await saveScanResults(job.website_url, categorized);
      await completeJob(job.id);
    } catch (error) {
      await failJob(job.id, error.message);
    }
  }
}
```

### Test Cases
| Test | Scenario | Expected |
|------|----------|----------|
| Enqueue | Add job | Status = 'pending' |
| Claim | Worker takes job | Status = 'processing' |
| Complete | Job finishes | Status = 'completed' |
| Fail | Job errors | Status = 'failed', error saved |
| Empty queue | No pending jobs | claimNextJob returns null |
| Concurrent | Two workers | Only one gets the job |

### Deliverable
```
src/
  queue/
    index.ts
    worker.ts
    queue.test.ts
```

---

## Milestone 5: Consent Script Generator

**Goal**: Generate a JS file that blocks marketing scripts until user consents.

### What to Build
```javascript
function generateConsentScript(catalog) {
  const marketingDomains = catalog
    .filter(s => s.category === 'marketing')
    .map(s => s.domain);

  return `
(function() {
  const MARKETING_DOMAINS = ${JSON.stringify(marketingDomains)};
  const CONSENT_KEY = 'cookie_consent';

  // Check existing consent
  function getConsent() {
    const consent = localStorage.getItem(CONSENT_KEY);
    return consent ? JSON.parse(consent) : null;
  }

  function setConsent(accepted) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ marketing: accepted }));
    if (accepted) location.reload();  // Reload to load scripts
  }

  // Block scripts by modifying DOM before they load
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'SCRIPT' && node.src) {
          const domain = new URL(node.src).hostname;
          if (MARKETING_DOMAINS.some(d => domain.includes(d))) {
            if (!getConsent()?.marketing) {
              node.type = 'javascript/blocked';
              console.log('[Consent] Blocked:', domain);
            }
          }
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Show banner if no consent
  if (!getConsent()) {
    document.addEventListener('DOMContentLoaded', () => {
      const banner = document.createElement('div');
      banner.id = 'consent-banner';
      banner.innerHTML = \`
        <div style="position:fixed;bottom:0;left:0;right:0;background:#333;color:#fff;padding:20px;z-index:99999;display:flex;justify-content:space-between;align-items:center;">
          <span>This site uses cookies for analytics and advertising.</span>
          <div>
            <button onclick="window.__acceptConsent()" style="background:#4CAF50;color:#fff;border:none;padding:10px 20px;margin:0 5px;cursor:pointer;">Accept All</button>
            <button onclick="window.__rejectConsent()" style="background:#f44336;color:#fff;border:none;padding:10px 20px;margin:0 5px;cursor:pointer;">Reject All</button>
          </div>
        </div>
      \`;
      document.body.appendChild(banner);
    });
  }

  window.__acceptConsent = () => setConsent(true);
  window.__rejectConsent = () => setConsent(false);
})();
`;
}
```

### Test Cases
| Test | Input | Expected |
|------|-------|----------|
| Generate script | Catalog with 5 scripts | Valid JS output |
| Marketing domains | Known trackers | Included in block list |
| Necessary domains | Stripe, etc. | NOT in block list |
| Syntax check | Generated output | No JS errors |

### Deliverable
```
src/
  generator/
    index.ts
    generator.test.ts
```

---

## Milestone 6: Chrome Extension (MV2)

**Goal**: Demo consent management on any public website without their cooperation.

### Why MV2?
- `webRequest` API allows blocking scripts at network level
- Scripts blocked BEFORE they download
- Can't publish to Chrome Web Store (MV3 required) but works locally for demos

### Structure
```
extension/
├── manifest.json
├── background.js    # Network-level blocking
├── content.js       # Consent UI
├── popup.html       # Extension controls
└── popup.js
```

### manifest.json
```json
{
  "manifest_version": 2,
  "name": "Cookie Consent Demo",
  "version": "1.0",
  "permissions": [
    "webRequest",
    "webRequestBlocking",
    "storage",
    "<all_urls>"
  ],
  "background": {
    "scripts": ["background.js"],
    "persistent": true
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_start"
  }],
  "browser_action": {
    "default_popup": "popup.html"
  }
}
```

### background.js
```javascript
// Default: block marketing scripts
let blockMarketing = true;

const MARKETING_DOMAINS = [
  "google-analytics.com",
  "googletagmanager.com",
  "doubleclick.net",
  "facebook.net",
  "connect.facebook.net",
  "hotjar.com",
  "mixpanel.com"
];

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!blockMarketing) return { cancel: false };

    const url = new URL(details.url);
    const shouldBlock = MARKETING_DOMAINS.some(d => url.hostname.includes(d));

    if (shouldBlock) {
      console.log('[Blocked]', url.hostname);
    }

    return { cancel: shouldBlock };
  },
  { urls: ["<all_urls>"], types: ["script"] },
  ["blocking"]
);

// Listen for consent updates
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === 'SET_CONSENT') {
    blockMarketing = !msg.accepted;
    chrome.tabs.reload(sender.tab.id);
  }
});
```

### content.js
```javascript
// Show consent banner
function showBanner() {
  const banner = document.createElement('div');
  banner.innerHTML = `
    <div style="position:fixed;bottom:0;left:0;right:0;background:#333;color:#fff;padding:20px;z-index:99999;">
      <span>This site uses marketing cookies. [Demo by Cookie Consent Platform]</span>
      <button id="accept-btn" style="margin-left:20px;padding:10px;">Accept</button>
      <button id="reject-btn" style="margin-left:10px;padding:10px;">Reject</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('accept-btn').onclick = () => {
    chrome.runtime.sendMessage({ type: 'SET_CONSENT', accepted: true });
  };
  document.getElementById('reject-btn').onclick = () => {
    chrome.runtime.sendMessage({ type: 'SET_CONSENT', accepted: false });
  };
}

document.addEventListener('DOMContentLoaded', showBanner);
```

### Demo Flow
1. Load extension via `chrome://extensions` → "Load unpacked"
2. Visit any website (amazon.com, cnn.com, etc.)
3. See consent banner
4. Open DevTools → Network tab
5. See scripts being blocked
6. Click "Accept" → scripts load

### Test Cases
| Test | Scenario | Expected |
|------|----------|----------|
| Install | Load unpacked | Extension active |
| Block | Visit site, default state | Marketing scripts blocked |
| Accept | Click accept | Scripts load on reload |
| Network tab | DevTools | Blocked requests visible |

### Deliverable
```
extension/
  manifest.json
  background.js
  content.js
  popup.html
  popup.js
```

---

## Milestone 7: Dashboard UI

**Goal**: Simple web interface to manage everything.

### Features
```
┌─────────────────────────────────────────────────────────────┐
│  Cookie Consent Platform                    [+ Add Website] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ https://example.com                                     ││
│  │ Last scanned: 2 hours ago                [Rescan]       ││
│  │                                                         ││
│  │ Necessary (2):                                          ││
│  │   • stripe.com                                          ││
│  │   • cloudflare.com                                      ││
│  │                                                         ││
│  │ Marketing (4):                                          ││
│  │   • google-analytics.com                                ││
│  │   • googletagmanager.com                                ││
│  │   • facebook.net                                        ││
│  │   • doubleclick.net                                     ││
│  │                                                         ││
│  │ [Copy Consent Script]                                   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### API Endpoints
```
POST   /api/scan          - Scan a new website
GET    /api/websites      - List all scanned websites
GET    /api/websites/:id  - Get website + scripts
GET    /api/script/:id    - Get generated consent script
```

### Deliverable
```
app/
  consent-platform/
    page.tsx           # Dashboard UI
    api/
      scan/route.ts
      websites/route.ts
      script/[id]/route.ts
```

---

## Build Order

| # | Milestone | What You Can Demo After |
|---|-----------|------------------------|
| 1 | Scanner | "I can scan a URL and see all scripts that load" |
| 2 | AI Categorizer | "I can categorize them as necessary vs marketing" |
| 3 | Database | "I can save and retrieve scan results" |
| 4 | Job Queue | "I can queue multiple sites and process them" |
| 5 | Script Generator | "I can generate a consent script for any site" |
| 6 | Chrome Extension | "I can demo blocking on any public website" |
| 7 | Dashboard | "Full working product with UI" |

---

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Scanner | Playwright | Network capture, handles SPAs |
| Browser (prod) | Browserless.io | Works with Vercel |
| AI | OpenAI GPT-4o-mini | Cheap, fast, good enough |
| Database | Supabase (PostgreSQL) | Already in your stack |
| Queue | Database table | Simple, debuggable |
| Frontend | Next.js | Already in your stack |
| Extension | Chrome MV2 | webRequest blocking |

---

## Full Pipeline (End to End)

```javascript
async function fullPipeline(websiteUrl) {
  // 1. Scan website (capture all script network requests)
  const scripts = await scanWebsite(websiteUrl);
  // → ["stripe.com", "googletagmanager.com", "facebook.net", ...]

  // 2. AI categorizes them
  const categorized = await categorizeScripts(scripts);
  // → { necessary: ["stripe.com"], marketing: ["googletagmanager.com", ...] }

  // 3. Save to database
  const websiteId = await saveScanResults(websiteUrl, categorized);

  // 4. Generate consent script
  const consentScript = generateConsentScript(categorized);

  return { websiteId, categorized, consentScript };
}
```

That's the whole thing. Simple.

---

## Success Criteria

Project is complete when you can:

1. Enter a URL in the dashboard
2. See it get scanned (scripts discovered)
3. See AI categorization (necessary vs marketing)
4. Copy the generated consent script
5. Load Chrome extension on any public website
6. See marketing scripts blocked in DevTools
7. Demo the whole flow in under 5 minutes
