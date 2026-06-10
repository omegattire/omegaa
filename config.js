/* ================================================================
   OMEGA ATTIRE – CONFIGURATION FILE
   ================================================================
   HOW TO SET UP:
   1. Go to https://supabase.com → your project → Settings → API
   2. Copy "Project URL"   → paste as SUPABASE_URL below
   3. Copy "anon public"   → paste as SUPABASE_ANON_KEY below
   4. Copy "service_role"  → paste as SUPABASE_SERVICE_KEY below
   5. Update WhatsApp, Instagram, Email with your real details
   6. Save this file
   ================================================================ */

const CONFIG = {

  /* ── SUPABASE ─────────────────────────────────────────────── */
  SUPABASE_URL:         'https://ydmlehoplbuhjkohbtqr.supabase.co',
  // Example:           'https://abcxyzabcxyz.supabase.co'

  SUPABASE_ANON_KEY:    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbWxlaG9wbGJ1aGprb2hidHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzg2NzUsImV4cCI6MjA5NjY1NDY3NX0.qZg-NTQqdDGRAOkTYZy4ptvkq0sit2gU2dr0HNGNj7U',
  // Example:           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

  SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbWxlaG9wbGJ1aGprb2hidHFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3ODY3NSwiZXhwIjoyMDk2NjU0Njc1fQ.LAPQjN4ppYXL3s_pAckYGrM_sPFmzBwE0acuxSR7d-s',
  // Only used in admin panel. Never share publicly.

  /* ── STORAGE ──────────────────────────────────────────────── */
  STORAGE_BUCKET: 'review-images',
  // Must match the bucket name you create in Supabase Storage

  /* ── YOUR BRAND DETAILS ───────────────────────────────────── */
  BRAND_NAME:       'Omega Attire',
  BRAND_TAGLINE:    'Real Reviews. Real Customers. Real Quality.',

  WHATSAPP_NUMBER:  '919999999999',
  // Format: country code + number. Example India: '919876543210'

  INSTAGRAM_HANDLE: 'omegaattire',
  // Without @ symbol

  CONTACT_EMAIL:    'hello@omegaattire.in',

  ADMIN_EMAIL:      'admin@omegaattire.in',
  // Create this user in Supabase → Authentication → Users

};
