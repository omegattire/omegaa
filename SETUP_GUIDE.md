# Omega Attire – Complete Setup & Deployment Guide
### Production-Ready · Supabase Backend · Netlify Hosting

---

## ✅ PROJECT FILE STRUCTURE

```
omega-attire-v2/
├── config.js           ← YOUR CREDENTIALS GO HERE (edit this first)
├── supabase-client.js  ← Supabase connection + helper functions
├── ui.js               ← Shared UI components (nav, dark mode, cards)
├── style.css           ← Complete stylesheet
├── index.html          ← Homepage (hero, featured reviews, submit form)
├── reviews.html        ← All reviews (search, filter, pagination)
├── gallery.html        ← Customer photo gallery
├── admin.html          ← Admin dashboard (approve/reject/delete)
├── database.sql        ← Run this in Supabase SQL Editor
├── netlify.toml        ← Netlify deployment config
└── SETUP_GUIDE.md      ← This file
```

---

## STEP 1 — CREATE SUPABASE PROJECT

1. Go to **https://supabase.com** → Sign up free
2. Click **"New project"**
3. Fill in:
   - **Name:** `omega-attire`
   - **Database password:** create a strong password (save it)
   - **Region:** `ap-south-1` (Mumbai — closest to India)
4. Click **"Create new project"**
5. Wait ~2 minutes for it to provision

---

## STEP 2 — RUN DATABASE SQL

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open `database.sql` from this project folder
4. **Copy ALL the content** and paste it into the SQL editor
5. Click **"Run"** (green button)
6. You should see: `Success. No rows returned.`

This creates:
- `reviews` table with all required columns
- Row Level Security policies (public can only see approved reviews)
- `review_stats` view (for public homepage counters)
- `admin_stats` view (for admin dashboard)
- Indexes for fast queries
- Auto-updating `updated_at` trigger

---

## STEP 3 — CREATE STORAGE BUCKET

1. In Supabase sidebar, click **"Storage"**
2. Click **"New bucket"**
3. Set **Name:** `review-images` ← must match exactly
4. Toggle **"Public bucket"** → ON (so images are viewable by everyone)
5. Click **"Save"**
6. Then click on the `review-images` bucket → **"Policies"** tab
7. Click **"New policy"** → **"For full customization"**
8. Set:
   - **Policy name:** `allow_public_upload`
   - **Allowed operation:** INSERT
   - **Target roles:** anon
   - **Policy definition:** `true`
9. Save policy

---

## STEP 4 — CREATE ADMIN USER

1. In Supabase sidebar, click **"Authentication"** → **"Users"**
2. Click **"Invite user"** or **"Add user"**
3. Enter your admin email (e.g. `admin@omegaattire.in`)
4. Set a strong password
5. Click **"Create user"**

This is the email + password you'll use to log into the admin panel.

---

## STEP 5 — GET YOUR API KEYS

1. In Supabase sidebar, click **"Settings"** → **"API"**
2. Copy these three values:

   | Value | Where to find |
   |-------|--------------|
   | **Project URL** | Under "Project URL" — looks like `https://abcdefgh.supabase.co` |
   | **anon public key** | Under "Project API keys" → `anon` `public` |
   | **service_role key** | Under "Project API keys" → `service_role` (click to reveal) |

---

## STEP 6 — CONFIGURE config.js

Open `config.js` in a text editor and replace the placeholder values:

```js
const CONFIG = {
  SUPABASE_URL:         'https://abcdefghijkl.supabase.co',  // ← your project URL
  SUPABASE_ANON_KEY:    'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...',  // ← anon public key
  SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...',  // ← service_role key

  STORAGE_BUCKET: 'review-images',  // ← keep this as-is

  BRAND_NAME:       'Omega Attire',
  WHATSAPP_NUMBER:  '919876543210',   // ← your number (no + or spaces)
  INSTAGRAM_HANDLE: 'omegaattire',   // ← your Instagram handle
  CONTACT_EMAIL:    'hello@omegaattire.in',  // ← your email

  ADMIN_EMAIL: 'admin@omegaattire.in',  // ← same as Supabase Auth user
};
```

Save the file.

---

## STEP 7 — TEST LOCALLY

Open `index.html` directly in your browser (double-click the file).

**Test checklist:**
- [ ] Homepage loads with no console errors
- [ ] Submit a test review → should show "pending approval" message
- [ ] Go to Supabase → Table Editor → `reviews` → confirm the row exists
- [ ] Open `admin.html` → login with your admin email/password
- [ ] Approve the test review
- [ ] Refresh `index.html` → the approved review should now appear
- [ ] Refresh on a different browser/device → same review appears (confirms real DB)

---

## STEP 8 — DEPLOY TO NETLIFY

### Option A — Drag & Drop (Easiest, 60 seconds)

1. Go to **https://netlify.com** → sign up free
2. From your dashboard, look for the area that says **"Want to deploy a new site without connecting to Git?"**
3. Drag and drop the **entire `omega-attire-v2` folder** onto that area
4. Netlify deploys instantly → gives you a URL like `https://amazing-name-12345.netlify.app`
5. Done! Share that URL with customers.

### Option B — GitHub + Auto-Deploy (Recommended for ongoing use)

1. Create a free account at **https://github.com**
2. Create a new repository called `omega-attire`
3. Upload all project files to the repository
4. Go to **https://netlify.com** → **"Add new site"** → **"Import an existing project"**
5. Connect GitHub → select your repository
6. Deploy settings: leave all as default
7. Click **"Deploy site"**

Now every time you edit `config.js` or any file and push to GitHub, Netlify auto-redeploys.

### Custom Domain (Optional)

1. In Netlify → your site → **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter `reviews.omegaattire.in` (or your domain)
4. Add a CNAME record in your domain registrar:
   - **Name:** `reviews`
   - **Value:** `your-netlify-site.netlify.app`
5. Netlify auto-provisions HTTPS (free SSL)

---

## STEP 9 — SUPABASE CORS SETUP

If you see CORS errors in the browser console:

1. In Supabase → **Settings** → **API**
2. Scroll to **"CORS allowed origins"**
3. Add your Netlify URL: `https://your-site.netlify.app`
4. Also add: `http://localhost:*` (for local testing)
5. Save

---

## STEP 10 — VERIFY PRODUCTION CHECKLIST

Run through each item before sharing with customers:

**Database:**
- [ ] `reviews` table exists in Supabase
- [ ] `review_stats` view exists
- [ ] `admin_stats` view exists
- [ ] RLS is enabled on `reviews` table
- [ ] All 3 policies are active (public_read_approved, public_insert_reviews, admin_full_access)

**Storage:**
- [ ] `review-images` bucket exists
- [ ] Bucket is set to Public
- [ ] Upload policy allows `anon` inserts

**Auth:**
- [ ] Admin user exists in Supabase Authentication

**Config:**
- [ ] `config.js` has real Supabase URL (not placeholder)
- [ ] `config.js` has real anon key
- [ ] `config.js` has real WhatsApp number
- [ ] `config.js` has real Instagram handle

**Functionality:**
- [ ] Submit review → appears as pending in admin
- [ ] Approve review → appears on public website
- [ ] Reject review → hidden from public website
- [ ] Delete review → removed from DB and Storage
- [ ] Upload photos → stored in Supabase Storage, visible in gallery
- [ ] Reviews visible on different browsers/devices (proves real DB, not localStorage)
- [ ] Dark mode footer text is visible (white text on dark background)
- [ ] Mobile responsive on phone browser

---

## HOW REVIEWS FLOW

```
Customer submits review
        ↓
Saved to Supabase DB (status = 'pending')
        ↓
Admin logs in → sees in "Pending" tab
        ↓
Admin clicks "Approve"
        ↓
status = 'approved' in DB
        ↓
Review now visible to ALL users on ALL devices
```

---

## SECURITY NOTES

- The **anon key** in `config.js` is safe to expose publicly. It's designed for client-side use.
- The **service_role key** should ideally only be used server-side, but since this is a static site, it's used for admin features. Protect admin.html with a strong Supabase Auth password.
- The admin panel requires Supabase Authentication — no password is hardcoded.
- Row Level Security ensures anonymous users can only read approved reviews and insert new pending ones.

---

## SUPPORT

For issues, contact: <your email>  
WhatsApp: +91 XXXXXXXXXX  
Instagram: @omegaattire

---

*Omega Attire Review Platform — Production Ready · Made in India 🇮🇳*
