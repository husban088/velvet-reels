/* =====================================================================
   Velvet Reel — shared engine
   (helpers · poster art · real poster loader · nav/footer · watchlist ·
    auth · search · trailer modal · effects)
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const C = window.VR;
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} },
  del(k) { try { localStorage.removeItem(k) } catch (e) {} }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => C.CURRENCY + ' ' + n.toLocaleString('en-US');
const hm = m => Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0') + 'm';
const BN = C.BRAND.map(s => s[0] + s.slice(1).toLowerCase()).join(' ');
document.title = document.title.split('|')[0].trim() + ' | ' + BN;

/* ---------- built-in cinematic poster art (works offline, never breaks) ---------- */
function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
function wrapT(t, max) { const w = t.split(' '), L = []; let c = ''; w.forEach(x => { if ((c + ' ' + x).trim().length > max && c) { L.push(c); c = x } else c = (c + ' ' + x).trim() }); if (c) L.push(c); return L.slice(0, 4) }
const ARTM = {};
function art(m, k) {
  const key = m.id + k; if (ARTM[key]) return ARTM[key];
  const p = k == 'p', W = p ? 600 : 1600, H = 900, h = m.h, R = rng([...m.n].reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7));
  const L = wrapT(m.n.toUpperCase(), p ? 11 : 24), fs = p ? (L.some(x => x.length > 9) ? 62 : 74) : 78, cx = W / 2;
  const y0 = p ? 640 - (L.length - 1) * fs * .5 : 470 - (L.length - 1) * fs * .5;
  let ridge1 = `0,${H}`, ridge2 = `0,${H}`; const n = p ? 10 : 22;
  for (let i = 0; i <= n; i++) { const x = W / n * i; ridge1 += ` ${x},${H * .8 - R() * H * .09}`; ridge2 += ` ${x},${H * .87 - R() * H * .07}` }
  ridge1 += ` ${W},${H}`; ridge2 += ` ${W},${H}`;
  const beams = [0, 1, 2, 3].map(i => { const a = cx + (i - 1.5) * W * .22, b = cx + (i - 1.5) * W * .7; return `<polygon points="${cx - 6},0 ${cx + 6},0 ${b + 40},${H} ${b - 40},${H}" fill="url(#bm)" opacity="${.06 + R() * .07}"/>` }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>
<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h},55%,20%)"/><stop offset=".6" stop-color="hsl(${(h + 25) % 360},55%,9%)"/><stop offset="1" stop-color="#050406"/></linearGradient>
<radialGradient id="gl" cx=".5" cy=".38" r=".55"><stop offset="0" stop-color="hsl(${h},95%,62%)" stop-opacity=".6"/><stop offset="1" stop-color="hsl(${h},95%,40%)" stop-opacity="0"/></radialGradient>
<linearGradient id="bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3dfa2"/><stop offset="1" stop-color="#f3dfa2" stop-opacity="0"/></linearGradient>
<linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e7b4"/><stop offset=".5" stop-color="#d9b76a"/><stop offset="1" stop-color="#9c7629"/></linearGradient>
<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .16 0"/></filter></defs>
<rect width="${W}" height="${H}" fill="url(#sk)"/><rect width="${W}" height="${H}" fill="url(#gl)"/>${beams}
<circle cx="${cx}" cy="${p ? 330 : 330}" r="${p ? 120 : 120}" fill="hsl(${(h + 20) % 360},90%,72%)" opacity=".16"/><circle cx="${cx}" cy="330" r="${p ? 74 : 74}" fill="hsl(${(h + 20) % 360},95%,78%)" opacity=".85"/>
<polygon points="${ridge1}" fill="hsl(${h},40%,7%)" opacity=".92"/><polygon points="${ridge2}" fill="#050406"/>
<rect width="${W}" height="${H}" filter="url(#gr)" opacity=".55"/>
<rect x="16" y="16" width="${W - 32}" height="${H - 32}" fill="none" stroke="url(#gd)" stroke-opacity=".55" stroke-width="2"/>
${L.map((s, i) => `<text x="${cx}" y="${y0 + i * fs * 1.08}" font-size="${fs}" font-family="Playfair Display,Georgia,serif" font-weight="700" fill="url(#gd)" text-anchor="middle" letter-spacing="2">${esc(s)}</text>`).join('')}
<text x="${cx}" y="${y0 + (L.length - 1) * fs * 1.08 + 52}" font-size="26" font-family="Outfit,Arial,sans-serif" fill="#f1ece2" fill-opacity=".8" text-anchor="middle" letter-spacing="9">${m.y}</text></svg>`;
  return ARTM[key] = 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/* ---------- real posters: Wikipedia (no key) or TMDB (optional key) ---------- */
const ARTC = LS.get('vr_art_v2', {}), inflight = {};
async function wiki(m) {
  const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(m.w.replace(/ /g, '_')));
  if (!r.ok) return null;
  const d = await r.json(), o = d.originalimage, t = d.thumbnail, s = (o && o.source) || (t && t.source);
  if (!s) return null;
  const ow = (o && o.width) || 0, sz = n => /\/thumb\/.*\/\d+px-/.test(t ? t.source : '') ? t.source.replace(/\/\d+px-/, '/' + n + 'px-') : s;
  if (ow >= 960) return { p: sz(500), b: sz(960) };
  if (ow >= 500) return { p: sz(500), b: sz(500) };
  return { p: s, b: s };
}
async function tmdb(m) {
  const k = C.TMDB_KEY, B = 'https://api.themoviedb.org/3';
  const s = await (await fetch(`${B}/search/movie?api_key=${k}&query=${encodeURIComponent(m.n)}&year=${m.y}`)).json();
  const x = s.results && s.results[0]; if (!x) return wiki(m);
  const d = await (await fetch(`${B}/movie/${x.id}?api_key=${k}&append_to_response=videos`)).json();
  const vs = (d.videos && d.videos.results) || [], v = vs.find(v => v.site == 'YouTube' && v.type == 'Trailer') || vs.find(v => v.site == 'YouTube');
  return { p: d.poster_path ? 'https://image.tmdb.org/t/p/w500' + d.poster_path : '', b: d.backdrop_path ? 'https://image.tmdb.org/t/p/w1280' + d.backdrop_path : '', v: v ? v.key : '' };
}
function getArt(m) {
  const ck = (C.TMDB_KEY ? 't' : 'w') + m.id;
  if (ARTC[ck]) return Promise.resolve(ARTC[ck]);
  if (inflight[ck]) return inflight[ck];
  return inflight[ck] = (C.TMDB_KEY ? tmdb(m) : wiki(m)).then(a => { if (a && (a.p || a.b)) { ARTC[ck] = a; LS.set('vr_art_v2', ARTC) } return a || {} }).catch(() => ({}));
}
function hydrate(root = document) {
  $$('img[data-m]', root).forEach(el => {
    if (el._h) return; el._h = 1;
    const m = M.find(x => x.id == el.dataset.m); if (!m) return;
    getArt(m).then(a => {
      const k = el.dataset.k, u = k == 'p' ? a.p : (a.b || a.p); if (!u) return;
      const im = new Image(); im.onload = () => { el.src = u; el.classList.add('real'); if (k == 'b' && !a.b) el.classList.add('pf') }; im.src = u;
    });
  });
}
const pic = (m, k, c = '') => `<img class="${c}" data-m="${m.id}" data-k="${k}" alt="${esc(m.n)}" src="${art(m, k)}" decoding="async"${k == 'p' ? ' loading="lazy"' : ''}>`;

/* ---------- state: watchlist + auth ---------- */
const W = () => LS.get('vr_wish', []), setW = a => LS.set('vr_wish', a);
const U = () => LS.get('vr_user', null);
const TK = () => LS.get('vr_tickets', []);
async function sha(s) { try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('') } catch (e) { return btoa(unescape(encodeURIComponent(s))) } }

/* ---------- templates ---------- */
const card = m => `<a class="gc" href="movie.html?id=${m.id}"><div class="art">${pic(m, 'p', 'ph')}</div><span class="rt"><i class="bi bi-star-fill"></i> ${m.r.toFixed(1)}</span><span class="hb ${W().includes(m.id) ? 'on' : ''}" data-w="${m.id}" role="button" tabindex="0" aria-label="Save to watchlist"><i class="bi bi-bookmark-heart-fill"></i></span><div class="gl"></div><div class="inf"><small>${m.g} · ${m.y}</small><h3>${esc(m.n)}</h3><div class="d-flex justify-content-between align-items-center"><b>${hm(m.rt)}</b><span class="pl">${m.c}</span></div><div class="mo">${esc(m.t.slice(0, 105))}…</div></div></a>`;
const col = m => `<div class="col-6 col-md-4 col-lg-3 rv">${card(m)}</div>`;
function toast(msg) { const t = document.createElement('div'); t.className = 'vr-toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600) }
function reveal() {
  if (!window.IntersectionObserver) { $$('.rv').forEach(el => el.classList.add('in')); hydrate(); return }
  const o = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); o.unobserve(x.target) } }), { threshold: .08 });
  $$('.rv').forEach(el => { if (!el._o) { el._o = 1; o.observe(el) } }); hydrate();
}
function updBadge() {
  const w = $('#wc'), t = $('#tc');
  if (w) { w.textContent = W().length; w.style.display = W().length ? '' : 'none' }
  if (t) { const n = TK().filter(x => x.user == (U() || {}).email).length; t.textContent = n; t.style.display = n ? '' : 'none' }
}
function barcode(s) { const R = rng([...s].reduce((a, c) => a * 33 + c.charCodeAt(0) | 0, 5)); let x = 0, o = ''; while (x < 210) { const w = 1 + Math.floor(R() * 4); if (R() > .38) o += `<rect x="${x}" y="0" width="${w}" height="46"/>`; x += w + 1 + Math.floor(R() * 2) } return `<svg viewBox="0 0 210 46" class="bars" fill="currentColor" aria-hidden="true">${o}</svg>` }

/* ---------- nav + footer ---------- */
const page = location.pathname.split('/').pop() || 'index.html';
const L = [['index.html', 'Home'], ['movies.html', 'Movies'], ['watchlist.html', 'Watchlist', 'wc'], ['tickets.html', 'My Tickets', 'tc'], ['about.html', 'About'], ['contact.html', 'Contact']];
const u0 = U();
const brandHtml = (cls = '') => `<a class="navbar-brand brand ${cls}" href="index.html"><i class="bi bi-film"></i> ${C.BRAND[0]}<span>${C.BRAND[1]}</span></a>`;
$('#nav').innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark fixed-top vr-nav"><div class="container">${brandHtml()}<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#m" aria-label="Menu"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="m"><ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">${L.map(l => `<li class="nav-item"><a class="nav-link ${page == l[0] ? 'active' : ''}" href="${l[0]}">${l[1]}${l[2] ? `<span class="wc" id="${l[2]}">0</span>` : ''}</a></li>`).join('')}</ul><div class="d-flex align-items-center gap-2 mt-3 mt-lg-0 ms-lg-3"><button class="sbtn" id="sb" aria-label="Search"><i class="bi bi-search"></i></button>${u0 ? `<span class="usr"><i class="bi bi-person-circle"></i> ${esc(u0.name.split(' ')[0])}</span><button class="btn btn-line btn-sm" id="out">Sign out</button>` : `<a class="btn btn-line btn-sm" href="login.html">Sign in</a><a class="btn btn-gold btn-sm" href="signup.html">Join free</a>`}</div></div></div></nav><div id="sprog"></div>`;
$('#foot').innerHTML = `<footer><div class="container"><div class="row g-4"><div class="col-lg-5">${brandHtml('fs-2')}<p class="mt-3">Your private cinema. Discover great films, save your watchlist, pick your seats and keep your tickets, all in one beautiful place.</p></div><div class="col-6 col-lg-3"><h5>Explore</h5>${L.map(l => `<div><a href="${l[0]}">${l[1]}</a></div>`).join('')}</div><div class="col-6 col-lg-4"><h5>Contact</h5><div>${C.EMAIL}</div><div>${C.PHONE}</div><div>${C.CITY}</div></div></div><hr class="mt-4" style="border-color:var(--line)"><small>Film titles and poster artwork belong to their respective owners and are shown here for demo purposes. © ${new Date().getFullYear()} ${BN}.</small></div></footer>`;
const nv = $('.vr-nav'), sp = $('#sprog');
function onScroll() { nv.classList.toggle('solid', scrollY > 40); const h = document.documentElement.scrollHeight - innerHeight; sp.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%' }
addEventListener('scroll', onScroll, { passive: true }); onScroll(); updBadge();
const out = $('#out'); if (out) out.onclick = () => { LS.del('vr_user'); toast('Signed out'); setTimeout(() => location.href = 'index.html', 500) };

/* ---------- search overlay (click the search icon, press / or Ctrl+K) ---------- */
const so = document.createElement('div'); so.id = 'srch'; so.innerHTML = `<div class="sbox"><div class="sinp"><i class="bi bi-search"></i><input id="sq" placeholder="Search a movie, actor, director or genre…" autocomplete="off"><kbd>Esc</kbd></div><div id="sres"></div></div>`; document.body.appendChild(so);
function sRender(q) {
  q = q.trim().toLowerCase();
  const a = q ? M.filter(m => (m.n + ' ' + m.dir + ' ' + m.cast.join(' ') + ' ' + m.tg.join(' ') + ' ' + m.g + ' ' + m.y).toLowerCase().includes(q)).slice(0, 6) : [...M].sort((x, y) => y.r - x.r).slice(0, 5);
  $('#sres').innerHTML = (q ? '' : '<div class="shd">Top rated</div>') + (a.length ? a.map(m => `<a class="sr" href="movie.html?id=${m.id}">${pic(m, 'p')}<div class="flex-grow-1"><b>${esc(m.n)}</b><small>${m.g} · ${m.y} · ${esc(m.dir)}</small></div><span class="stars">${m.r.toFixed(1)}</span></a>`).join('') : '<div class="empty py-4">No movie found.</div>') + (q ? `<a class="sr all" href="movies.html?q=${encodeURIComponent(q)}">See all results for “${esc(q)}” <i class="bi bi-arrow-right"></i></a>` : ''); hydrate($('#sres'));
}
function sOpen() { so.classList.add('on'); document.body.style.overflow = 'hidden'; sRender(''); const i = $('#sq'); i.value = ''; setTimeout(() => i.focus(), 60) }
function sClose() { so.classList.remove('on'); document.body.style.overflow = '' }
$('#sb').onclick = sOpen; so.onclick = e => { if (e.target === so) sClose() };
$('#sq').oninput = e => sRender(e.target.value);
$('#sq').onkeydown = e => { if (e.key == 'Enter' && e.target.value.trim()) location.href = 'movies.html?q=' + encodeURIComponent(e.target.value.trim()) };
addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
  if (e.key == 'Escape') { sClose(); closeTrailer() }
  else if ((e.key == '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() == 'k')) { e.preventDefault(); sOpen() }
});

/* ---------- trailer ---------- */
function closeTrailer() { const t = $('#tm'); if (t) { t.remove(); document.body.style.overflow = '' } }
function openTrailer(id) {
  const m = M.find(x => x.id == id); if (!m) return;
  if (!C.TMDB_KEY) { window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(m.n + ' ' + m.y + ' official trailer'), '_blank', 'noopener'); return }
  closeTrailer(); const t = document.createElement('div'); t.id = 'tm'; t.innerHTML = `<div class="tbox"><button class="tx" aria-label="Close"><i class="bi bi-x-lg"></i></button><div class="tfr"><div class="tload">Loading trailer…</div></div><div class="tcap">${esc(m.n)} <span>${m.y}</span></div></div>`;
  document.body.appendChild(t); document.body.style.overflow = 'hidden';
  t.onclick = e => { if (e.target === t || e.target.closest('.tx')) closeTrailer() };
  getArt(m).then(a => { const f = $('.tfr', t); if (!f) return; f.innerHTML = a.v ? `<iframe src="https://www.youtube-nocookie.com/embed/${a.v}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="${esc(m.n)} trailer"></iframe>` : `<div class="tload">No trailer found. <a target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(m.n + ' ' + m.y + ' official trailer')}">Search on YouTube</a></div>` });
}

/* ---------- global click / hover behaviours ---------- */
document.addEventListener('click', e => {
  const tr = e.target.closest('[data-tr]'); if (tr) { e.preventDefault(); openTrailer(tr.dataset.tr); return }
  const b = e.target.closest('[data-w]'); if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const id = b.dataset.w; let w = W(); const on = w.includes(id); w = on ? w.filter(x => x != id) : [...w, id]; setW(w);
  $$(`[data-w="${id}"]`).forEach(x => { x.classList.toggle('on', !on); const s = x.querySelector('.wt'); if (s) s.textContent = on ? 'Add to watchlist' : 'In your watchlist' });
  toast(on ? 'Removed from watchlist' : 'Saved to watchlist'); updBadge(); if (window.onW) onW();
});
document.addEventListener('keydown', e => { if ((e.key == 'Enter' || e.key == ' ') && e.target.matches && e.target.matches('.hb')) { e.preventDefault(); e.target.click() } });
document.addEventListener('mousemove', e => {
  const c = e.target.closest && e.target.closest('.gc'); if (!c) return;
  const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  c.style.setProperty('--rx', ((.5 - y) * 10) + 'deg'); c.style.setProperty('--ry', ((x - .5) * 12) + 'deg'); c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
});
document.addEventListener('mouseout', e => { const c = e.target.closest && e.target.closest('.gc'); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg') } });

/* ---------- opening curtain (home page, once per visit) ---------- */
if (document.body.hasAttribute('data-curtain') && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  let seen = false; try { seen = sessionStorage.getItem('vr_c') } catch (e) {}
  if (!seen) {
    try { sessionStorage.setItem('vr_c', 1) } catch (e) {}
    const c = document.createElement('div'); c.id = 'curtain'; c.innerHTML = `<i></i><i></i><span>${C.BRAND[0]}<b>${C.BRAND[1]}</b></span>`; document.body.appendChild(c);
    setTimeout(() => c.classList.add('open'), 900); setTimeout(() => c.remove(), 2500);
  }
}
