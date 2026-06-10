/* ================================================================
   OMEGA ATTIRE – SHARED UI UTILITIES
   Used by all pages: nav, dark mode, cards, forms, lightbox, toast
   ================================================================ */

/* ── NAVBAR ────────────────────────────────────────────────── */
function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (navbar) {
    window.addEventListener('scroll', () =>
      navbar.classList.toggle('scrolled', window.scrollY > 36), { passive: true });
  }
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      })
    );
  }
}

/* ── DARK MODE ─────────────────────────────────────────────── */
function initDarkMode() {
  const btn   = document.getElementById('darkToggle');
  const apply = (dark) => {
    document.body.classList.toggle('dark', dark);
    if (btn) btn.textContent = dark ? '☀' : '☽';
  };
  apply(localStorage.getItem('oa-dark') === '1');
  if (btn) {
    btn.addEventListener('click', () => {
      const dark = !document.body.classList.contains('dark');
      localStorage.setItem('oa-dark', dark ? '1' : '0');
      apply(dark);
    });
  }
}

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ── TOAST ─────────────────────────────────────────────────── */
function showToast(msg, duration) {
  duration = duration || 3200;
  let t = document.getElementById('oa-toast');
  if (!t) {
    t = document.createElement('div');
    t.id        = 'oa-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tmr);
  t._tmr = setTimeout(() => t.classList.remove('show'), duration);
}

/* ── LIGHTBOX ──────────────────────────────────────────────── */
var _lb = null;
function openLightbox(src) {
  if (!_lb) {
    _lb = document.createElement('div');
    _lb.className = 'lightbox';
    _lb.innerHTML = '<button class="lightbox-close" aria-label="Close">&#10005;</button><img src="" alt="Photo">';
    _lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    _lb.addEventListener('click', function(e){ if (e.target === _lb) closeLightbox(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLightbox(); });
    document.body.appendChild(_lb);
  }
  _lb.querySelector('img').src = src;
  _lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (_lb) _lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── HTML ESCAPE ───────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

/* ── AVATAR HELPERS ────────────────────────────────────────── */
var AVATAR_COLORS = ['#E61919','#0d47a1','#2e7d32','#6a1b9a','#e65100','#00695c','#c62828','#283593'];
function avatarColor(name) {
  var h = 0;
  for (var i = 0; i < (name||'A').length; i++)
    h = (h * 31 + (name||'A').charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}
function initials(name) {
  return (name||'?').trim().split(/\s+/).map(function(w){ return w[0]; }).join('').toUpperCase().slice(0,2);
}
function starsHtml(n) {
  return '<span style="color:#f5a623">' + '★'.repeat(n) + '</span>' +
         '<span style="color:var(--g5)">'  + '★'.repeat(5-n) + '</span>';
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN',
    { day:'numeric', month:'short', year:'numeric' });
}

/* ── BUILD REVIEW CARD ─────────────────────────────────────── */
function buildReviewCard(r) {
  var imgs = '';
  if (r.images && r.images.length) {
    r.images.slice(0,4).forEach(function(src){
      imgs += '<img src="'+src+'" class="rc-img" alt="Customer photo" loading="lazy" onclick="openLightbox(\''+src+'\')">';
    });
    imgs = '<div class="rc-images">'+imgs+'</div>';
  }
  return (
    '<div class="review-card reveal">' +
      '<div class="rc-top">' +
        '<div class="rc-author">' +
          '<div class="rc-avatar" style="background:'+avatarColor(r.name)+'">'+initials(r.name)+'</div>' +
          '<div>' +
            '<div class="rc-name">'+escapeHtml(r.name)+'</div>' +
            '<div class="rc-city">📍 '+escapeHtml(r.city)+'</div>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div style="font-size:.95rem;letter-spacing:1px">'+starsHtml(r.rating)+'</div>' +
          (r.verified ? '<div class="verified-badge">✓ Verified</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="rc-text">&ldquo;'+escapeHtml(r.review_text)+'&rdquo;</div>' +
      '<div class="rc-meta">' +
        '<span>🛍 '+escapeHtml(r.product)+'</span>' +
        '<span>📅 '+formatDate(r.created_at)+'</span>' +
      '</div>' +
      imgs +
      '<button class="rc-share" onclick="shareReview(\''+escapeHtml(r.name)+'\','+r.rating+')">🔗 Share</button>' +
    '</div>'
  );
}

/* ── SHARE ─────────────────────────────────────────────────── */
function shareReview(name, rating) {
  var text = 'Check out '+name+'\'s '+rating+'★ review on Omega Attire! #OmegaAttire';
  var url  = window.location.origin + '/reviews.html';
  if (navigator.share) {
    navigator.share({ title:'Omega Attire Review', text:text, url:url });
  } else {
    navigator.clipboard.writeText(text + ' ' + url)
      .then(function(){ showToast('🔗 Link copied!'); });
  }
}

/* ── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCount(el, target, isDecimal, suffix) {
  if (!el) return;
  isDecimal = isDecimal || false;
  suffix    = suffix    || '';
  var start = null, duration = 1600;
  function step(ts) {
    if (!start) start = ts;
    var prog = Math.min((ts - start) / duration, 1);
    var ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = (isDecimal ? (ease*target).toFixed(1) : Math.floor(ease*target)) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── FAQ ───────────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item   = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── CONTACT FORM ──────────────────────────────────────────── */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    showToast('✅ Message sent! We\'ll reply within 24 hours.');
    form.reset();
  });
}

/* ── DYNAMIC LINKS (WhatsApp / Instagram) ──────────────────── */
function setContactLinks() {
  document.querySelectorAll('[data-wa]').forEach(function(el){
    el.href = 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER;
  });
  document.querySelectorAll('[data-ig]').forEach(function(el){
    el.href = 'https://instagram.com/' + CONFIG.INSTAGRAM_HANDLE;
  });
  document.querySelectorAll('[data-email]').forEach(function(el){
    el.href = 'mailto:' + CONFIG.CONTACT_EMAIL;
    if (el.dataset.showtext) el.textContent = CONFIG.CONTACT_EMAIL;
  });
}

/* ── STAR PICKER ───────────────────────────────────────────── */
var STAR_LABELS = ['','Poor','Fair','Good','Great','Excellent!'];
function initStarPicker(pickerId, hiddenId, labelId) {
  var picker = document.getElementById(pickerId);
  var hidden = document.getElementById(hiddenId);
  var lbl    = document.getElementById(labelId);
  if (!picker) return;
  var stars  = picker.querySelectorAll('.star-pick');

  stars.forEach(function(s){
    s.addEventListener('mouseenter', function(){
      var v = +s.dataset.v;
      stars.forEach(function(x){ x.classList.toggle('on', +x.dataset.v <= v); });
      if (lbl) lbl.textContent = STAR_LABELS[v];
    });
    s.addEventListener('click', function(){
      var v = +s.dataset.v;
      if (hidden) hidden.value = v;
      if (lbl) lbl.textContent = STAR_LABELS[v] + ' (' + v + '/5)';
    });
  });
  picker.addEventListener('mouseleave', function(){
    var v = hidden ? +hidden.value : 0;
    stars.forEach(function(x){ x.classList.toggle('on', +x.dataset.v <= v); });
    if (lbl) lbl.textContent = v ? STAR_LABELS[v]+' ('+v+'/5)' : 'Select rating';
  });
}

/* ── PHOTO UPLOAD ──────────────────────────────────────────── */
function initPhotoUpload(zoneId, inputId, previewId, errId) {
  var zone    = document.getElementById(zoneId);
  var input   = document.getElementById(inputId);
  var preview = document.getElementById(previewId);
  if (!zone || !input) return;
  zone._files = [];

  zone.addEventListener('click', function(){ input.click(); });
  zone.addEventListener('dragover',  function(e){ e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', function(){ zone.classList.remove('dragover'); });
  zone.addEventListener('drop', function(e){
    e.preventDefault(); zone.classList.remove('dragover');
    addFiles(Array.from(e.dataTransfer.files));
  });
  input.addEventListener('change', function(){
    addFiles(Array.from(input.files));
    input.value = '';
  });

  function addFiles(files) {
    var errEl = document.getElementById(errId);
    var valid = files.filter(function(f){
      return f.type.startsWith('image/') && f.size <= 5*1024*1024;
    });
    if (errEl) {
      errEl.textContent = valid.length < files.length
        ? 'Some files skipped (must be image, max 5 MB each).' : '';
    }
    zone._files = (zone._files || []).concat(valid).slice(0, 5);
    renderThumbs();
  }

  function renderThumbs() {
    if (!preview) return;
    preview.innerHTML = '';
    (zone._files || []).forEach(function(f, i){
      var url  = URL.createObjectURL(f);
      var wrap = document.createElement('div');
      wrap.className = 'photo-thumb-wrap';
      wrap.innerHTML = '<img src="'+url+'" class="photo-thumb" alt="preview">'+
        '<button class="thumb-remove" type="button" data-i="'+i+'">&#10005;</button>';
      wrap.querySelector('.thumb-remove').addEventListener('click', function(){
        zone._files.splice(i, 1);
        renderThumbs();
      });
      preview.appendChild(wrap);
    });
  }
}

/* ── EMPTY STATE HTML ──────────────────────────────────────── */
function emptyState(icon, title, msg) {
  return '<div class="empty-state" style="grid-column:1/-1">'+
    '<div class="empty-icon">'+icon+'</div>'+
    '<h3>'+title+'</h3>'+
    '<p>'+msg+'</p>'+
  '</div>';
}
function setupNotConfiguredHtml() {
  return emptyState('⚙️','Supabase Not Connected',
    'Open <code>config.js</code>, paste your Supabase URL + anon key, then reload.');
}
function spinnerHtml(colspan) {
  colspan = colspan || 1;
  var style = colspan > 1 ? 'style="grid-column:1/-1"' : '';
  return '<div class="spinner-wrap" '+style+'><div class="spinner"></div></div>';
}

/* ── AUTO-INIT ON EVERY PAGE ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  initNav();
  initDarkMode();
  initFAQ();
  initContactForm();
  setContactLinks();
});
