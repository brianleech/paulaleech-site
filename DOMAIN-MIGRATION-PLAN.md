# paulaleech.com — Domain Migration Plan

Durable reference for taking Paula's redesigned site live and getting fully off Squarespace.
Created 2026-06-26. Owner: Brian. Agent: Cinder.

---

## The plan (phased — DO NOT do all at once)

Cinder's recommendation, agreed by Brian 2026-06-26:

1. **Option 1 — Launch now (DNS repoint, registration stays at Squarespace).**
   Point paulaleech.com's website records at Netlify. Lowest risk, reversible, gets Paula live the day she approves. Still paying Squarespace ~$20/yr for registration only (no website).

2. **Option 2 — A week later: move DNS to Cloudflare.**
   Point the domain's nameservers at Cloudflare (free), recreate all records there (including the Google MX — copy exactly). Modernizes off Squarespace DNS. Has a propagation window.

3. **Option 3 — Eventually: full registration transfer off Squarespace.**
   Move the actual domain registration to Cloudflare. 5–7 days, needs auth code + unlock. Only when everything else is stable. Stops paying Squarespace entirely.

**Why phased:** each step is a clean, reversible move. Stacking them multiplies the ways email can break.

---

## THE SACRED RULE — protect Google Workspace email

paula@paulaleech.com runs on Google Workspace. Email and website are independent — only the website records (A / www CNAME) change during migration. NEVER delete or alter these (captured live 2026-06-26):

**MX (email routing):**
```
1  aspmx.l.google.com.
5  alt1.aspmx.l.google.com.
5  alt2.aspmx.l.google.com.
10 alt3.aspmx.l.google.com.
10 alt4.aspmx.l.google.com.
```

**TXT (SPF + Google verification):**
```
v=spf1 include:_spf.google.com ~all
google-site-verification=wI1Xxwt-wYcWW3DHS5XWGuRs5M4R_CGkKmVjsWjD9zI
```

If anything ever looks off with email after a DNS change, restore the records above.

**Current website records (Squarespace — these are what we REPLACE with Netlify):**
- Root A: 198.185.159.144/145, 198.49.23.144/145
- www: CNAME -> ext-sq.squarespace.com
- Nameservers currently: Squarespace (ns0X.squarespacedns.com) + nsone.net

---

## Go-live steps (Option 1 — when Paula approves)

1. **Add custom domain in Netlify** — tell the paulaleechsite project its domain is paulaleech.com. (Cinder can do via API — token saved.)
2. **Update DNS at Squarespace** — replace the root A records + www CNAME with what Netlify provides. LEAVE ALL MX + TXT UNTOUCHED.
3. **Wait for propagation** — 1–4 hrs typical, up to a day. Mixed old/new during window is normal.
4. **Netlify auto-provisions SSL** — free HTTPS cert once DNS resolves. No action.
5. **Flip off noindex** — remove the `X-Robots-Tag: noindex` header from netlify.toml, push. (One-line change, Cinder does it.)
6. **Verify** — load https://paulaleech.com on real devices, confirm SSL padlock, test forms, send a test email to paula@paulaleech.com to confirm email still works.

---

## Netlify reference

- Site name: `paulaleechsite`
- Site ID: `ebbcdbaa-27e0-41ca-b457-c16c173a472c`
- Watched branch: `redesign`
- Preview URL: https://paulaleechsite.netlify.app
- API token: macOS keychain, service `netlify-api-token` (NEVER paste the literal — fetch at runtime via `security find-generic-password -s netlify-api-token -w`)
- API docs: https://docs.netlify.com/api/get-started/
