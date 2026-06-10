/* ================================================================
   OMEGA ATTIRE – SUPABASE CLIENT
   Fixed: renamed variable to avoid conflict with Supabase CDN
   ================================================================ */

var _db = null;  // renamed from 'supabase' to avoid CDN conflict

function isConfigured() {
  return (
    typeof CONFIG !== 'undefined' &&
    CONFIG.SUPABASE_URL &&
    !CONFIG.SUPABASE_URL.includes('PASTE_YOUR') &&
    CONFIG.SUPABASE_ANON_KEY &&
    !CONFIG.SUPABASE_ANON_KEY.includes('PASTE_YOUR')
  );
}

function initSupabase() {
  if (!isConfigured()) {
    console.warn('Supabase not configured. Edit config.js first.');
    return false;
  }
  try {
    _db = window.supabase.createClient(
      CONFIG.SUPABASE_URL,
      CONFIG.SUPABASE_ANON_KEY,
      { auth: { persistSession: true } }
    );
    return true;
  } catch(e) {
    console.error('Supabase init error:', e);
    return false;
  }
}

function showSetupBanner() {
  if (isConfigured()) return;
  if (document.getElementById('setupBanner')) return;
  var b = document.createElement('div');
  b.id = 'setupBanner';
  b.style.cssText = 'background:#1a1a1a;color:#fff;text-align:center;padding:13px 20px;font-size:.875rem;position:relative;z-index:9998;line-height:1.6;';
  b.innerHTML = '⚙️ <strong>Supabase not connected.</strong> Open <code style="background:#333;padding:2px 7px;border-radius:4px">config.js</code> and paste your Supabase URL + anon key. <a href="SETUP_GUIDE.md" style="color:#E61919;font-weight:700;margin-left:10px;text-decoration:underline">Setup Guide →</a>';
  document.body.insertBefore(b, document.body.firstChild);
}

/* ── UPLOAD IMAGE ─────────────────────────────────────────── */
async function uploadImage(file) {
  if (!_db) throw new Error('Supabase not connected. Fill in config.js first.');
  var ext     = file.name.split('.').pop().toLowerCase();
  var allowed = ['jpg','jpeg','png','webp'];
  if (!allowed.includes(ext)) throw new Error('File type .' + ext + ' not allowed. Use JPG, PNG or WEBP.');
  if (file.size > 5 * 1024 * 1024) throw new Error('"' + file.name + '" is over 5 MB. Please compress it.');

  var path = 'reviews/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
  var res  = await _db.storage.from(CONFIG.STORAGE_BUCKET).upload(path, file, { cacheControl: '3600', upsert: false });
  if (res.error) throw new Error('Image upload failed: ' + res.error.message);

  var urlRes = _db.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
  return urlRes.data.publicUrl;
}

async function uploadImages(files, onProgress) {
  var urls = [];
  for (var i = 0; i < files.length; i++) {
    if (onProgress) onProgress(i + 1, files.length);
    urls.push(await uploadImage(files[i]));
  }
  return urls;
}

/* ── SUBMIT REVIEW ────────────────────────────────────────── */
async function submitReview(payload) {
  if (!_db) throw new Error('Supabase not connected. Fill in config.js first.');
  var res = await _db.from('reviews').insert([payload]);
  if (res.error) throw new Error(res.error.message);
}

/* ── FETCH APPROVED REVIEWS ───────────────────────────────── */
async function fetchApprovedReviews(opts) {
  opts = opts || {};
  var rating  = opts.rating  || 0;
  var search  = opts.search  || '';
  var page    = opts.page    || 1;
  var perPage = opts.perPage || 9;
  var sort    = opts.sort    || 'newest';

  if (!_db) return { data: [], count: 0, error: 'Supabase not connected' };

  var q = _db.from('reviews').select('*', { count: 'exact' }).eq('status', 'approved');

  if (rating > 0)     q = q.eq('rating', rating);
  if (search.trim())  q = q.or('name.ilike.%' + search + '%,city.ilike.%' + search + '%,review_text.ilike.%' + search + '%');

  q = sort === 'oldest'
    ? q.order('created_at', { ascending: true })
    : q.order('created_at', { ascending: false });

  var from = (page - 1) * perPage;
  q = q.range(from, from + perPage - 1);

  var res = await q;
  return { data: res.data || [], count: res.count || 0, error: res.error ? res.error.message : null };
}

/* ── FETCH STATS ──────────────────────────────────────────── */
async function fetchStats() {
  if (!_db) return null;
  var res = await _db.from('review_stats').select('*').single();
  return res.data || null;
}

/* Make _db accessible as 'supabase' for admin page direct queries */
function getDB() { return _db; }
