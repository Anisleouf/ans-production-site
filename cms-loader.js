
/* ANS Production - CMS et personnalisation v2.1 */
(() => {
  'use strict';
  const backup = window.ANS_CONFIG || {};
  const api = 'https://api.github.com/repos/Anisleouf/ans-production-site/contents/';
  const palettes = {
    orange: ['#fa7350', '#ffc1a2'],
    bleu: ['#69b7ff', '#b8e3ff'],
    violet: ['#bb8cff', '#dec6ff'],
    vert: ['#72d5b1', '#bdf1db'],
    rose: ['#ff86b7', '#ffd1e3']
  };
  const backgrounds = {
    creme: ['#f2eee6', '#e9e3d8', '#faf7f0'],
    blanc: ['#fcfbf8', '#f1eee9', '#ffffff'],
    gris: ['#eef1f2', '#e2e7e9', '#f9fafb']
  };
  const localImage = path => {
    const p = String(path || '').trim().replace(/^\/+/, '');
    return /^assets\/[a-z0-9_\/\-.%àâéèêôùç ]+\.(jpg|jpeg|png|webp)$/i.test(p) &&
      !p.includes('..') ? p : '';
  };
  const text = name => typeof name === 'string' ? name.trim() : '';

  function customizeTheme(D) {
    const root = document.documentElement;
    if (palettes[D.themeColor]) {
      root.style.setProperty('--accent', palettes[D.themeColor][0]);
      root.style.setProperty('--accent2', palettes[D.themeColor][1]);
    }
    if (backgrounds[D.backgroundColor]) {
      ['--paper', '--paper2', '--paper3'].forEach((key, i) =>
        root.style.setProperty(key, backgrounds[D.backgroundColor][i]));
    }
    if (palettes[D.themeColor]) {
      const themeCss = document.createElement('style');
      themeCss.textContent = '.home-hero h1 em{color:var(--accent2)}';
      document.head.appendChild(themeCss);
    }
    if (D.fontStyle === 'moderne') {
      root.style.setProperty('--serif', "'DM Sans', Arial, sans-serif");
    } else if (D.fontStyle === 'classique') {
      root.style.setProperty('--sans', 'Georgia, serif');
    }
    if (D.buttonColor && D.buttonColor !== 'auto' && palettes[D.buttonColor]) {
      root.style.setProperty('--button-bg', palettes[D.buttonColor][0]);
      root.style.setProperty('--button-hover', palettes[D.buttonColor][1]);
      const css = document.createElement('style');
      css.textContent = '.btn:not(.btn-outline){background:var(--button-bg);border-color:var(--button-bg)}' +
        '.btn:not(.btn-outline):hover{background:var(--button-hover);border-color:var(--button-hover)}';
      document.head.appendChild(css);
    }
  }

  function customizePage(D) {
    const one = selector => document.querySelector(selector);
    const updateText = (selector, value) => {
      if (text(value) && one(selector)) one(selector).textContent = text(value);
    };
    const updateImage = (selector, value) => {
      const safe = localImage(value);
      if (safe && one(selector)) one(selector).src = safe;
    };
    const toggle = (selector, value) => {
      if (value === false) document.querySelectorAll(selector)
        .forEach(el => { el.hidden = true; });
    };
    const twoLines = (selector, first, second, defaults) => {
      if (!text(first) && !text(second)) return;
      const node = one(selector);
      if (!node) return;
      const em = document.createElement('em');
      em.textContent = text(second) || defaults[1];
      node.replaceChildren(document.createTextNode(text(first) || defaults[0]),
        document.createElement('br'), em);
    };

    // Images : tous les chemins sont limités aux images du dépôt.
    updateImage('.brand-logo', D.logoImage);
    updateImage('.hero-bg-img', D.heroImage);
    updateImage('.hero-character', D.homeCharacterImage);
    updateImage('.feature-panorama .panorama-image img', D.featureBannerImage);
    updateImage('.game-hero .page-hero-image img', D.gameHeroImage);
    updateImage('.catalog-photo img', D.gameCardImage);
    updateImage('.studio-art img', D.studioLogoImage);
    updateImage('.studio-fullbleed > img', D.studioBannerImage);

    // Grands titres et textes.
    if (text(D.homeTitle1) || text(D.homeTitle2) || text(D.homeTitle3)) {
      const h = one('.home-hero h1');
      if (h) {
        const em = document.createElement('em');
        em.textContent = text(D.homeTitle2) || 'histoires';
        const dot = document.createElement('span');
        dot.className = 'title-dot';
        dot.textContent = '.';
        h.replaceChildren(document.createTextNode(text(D.homeTitle1) || 'On crée des'),
          document.createElement('br'), em, document.createElement('br'),
          document.createTextNode(text(D.homeTitle3) || 'à ressentir'), dot);
      }
    }
    if (text(D.homeKicker) && one('.hero-kicker')) {
      const kicker = one('.hero-kicker');
      const label = [...kicker.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
      if (label) label.textContent = text(D.homeKicker);
    }
    updateText('.home-hero .hero-intro .btn > span:first-child', D.homeButtonText);
    const allowedPages = ['another-day.html', 'jeux.html', 'studio.html', 'actualites.html'];
    if (allowedPages.includes(D.homeButtonPage) && one('.home-hero .hero-intro .btn'))
      one('.home-hero .hero-intro .btn').href = D.homeButtonPage;
    twoLines('.feature-title', D.featureTitle1, D.featureTitle2, ['Another', 'Day.']);
    twoLines('.studio-lead .inner-page-title', D.studioTitle1, D.studioTitle2,
      ['Un petit studio.', 'De grandes histoires.']);
    twoLines('.story-block .section-title', D.gameSectionTitle1, D.gameSectionTitle2,
      ['Des journées', 'pas si ordinaires.']);
    twoLines('.footer-top h2', D.footerTitle1, D.footerTitle2,
      ['Les histoires', 'continuent.']);
    updateText('.footer-bottom > span:nth-child(2)', D.footerCaption);

    // Menu ordinateur et iPhone : conserver numéros et flèches mobiles.
    const nav = [
      ['index.html', 'Home'], ['another-day.html', 'Game'],
      ['visuels-du-jeu.html', 'Visuals'], ['studio.html', 'Studio'],
      ['actualites.html', 'Journal'], ['contact.html', 'Contact']
    ];
    for (const [href, key] of nav) {
      const label = text(D['nav' + key + 'Text']);
      for (const a of document.querySelectorAll(`.nav-links a[href="${href}"], .mobile-nav a[href="${href}"]`)) {
        if (D['showNav' + key] === false) a.hidden = true;
        if (label) {
          const node = [...a.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
          if (node) node.textContent = label;
        }
      }
    }
    for (const a of document.querySelectorAll('.header-contact')) {
      if (D.showNavContact === false) a.hidden = true;
      if (text(D.navContactText)) {
        const node = [...a.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
        if (node) node.textContent = text(D.navContactText) + ' ';
      }
    }

    // Les sections non configurées restent affichées.
    toggle('.home-hero', D.showHero);
    toggle('.ticker', D.showTicker);
    toggle('.manifesto', D.showManifesto);
    toggle('.feature-section', D.showFeaturedGame);
    toggle('body[data-page="home"] .feelings-section', D.showFeelings);
    toggle('.visual-preview', D.showGallery);
    toggle('.ending-callout', D.showEnding);
    if (D.showManifesto === false) toggle('.hero-bottom a[href="#manifesto"]', false);
    if (D.showHero === false) {
      const style = document.createElement('style');
      style.textContent = 'body[data-page="home"] .header:not(.scrolled){color:var(--ink);background:var(--paper);border-color:var(--line)}';
      document.head.appendChild(style);
    }
  }

  function start(D) {
    customizeTheme(D);
    const script = document.createElement('script');
    script.src = 'app.js';
    script.onload = () => customizePage(D);
    script.onerror = () => console.error('ANS Production : app.js introuvable');
    document.head.appendChild(script);
  }

  if (location.protocol === 'file:') {
    start(backup);
    return;
  }

  async function getJSON(path, fallback) {
    try {
      const r = await fetch(path, { cache: 'no-store' });
      return r.ok ? await r.json() : fallback;
    } catch { return fallback; }
  }

  function readMarkdown(source, filename) {
    const normalized = source.replace(/\r\n/g, '\n');
    const match = normalized.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
    const header = match ? match[1] : '';
    const body = match ? normalized.slice(match[0].length) : normalized;
    function field(name) {
      const lines = header.split('\n');
      const i = lines.findIndex(line => line.startsWith(name + ':'));
      if (i < 0) return '';
      const raw = lines[i].slice(name.length + 1).trim();
      if (!/^[>|][+-]?$/.test(raw)) return raw.replace(/^['"]|['"]$/g, '').trim();
      const linesOut = [];
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() && !/^\s/.test(lines[j])) break;
        linesOut.push(lines[j].replace(/^ {2}/, ''));
      }
      return linesOut.join(raw.startsWith('>') ? ' ' : '\n').trim();
    }
    const plain = value => value.replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#*_`>]/g, '').replace(/\s+/g, ' ').trim();
    return { title: field('title'), description: plain(field('description')),
      body: plain(body), date: field('date'), filename };
  }

  async function getCollection(folder) {
    try {
      const response = await fetch(api + folder + '?ref=main', { cache: 'no-store' });
      if (!response.ok) return [];
      const files = await response.json();
      if (!Array.isArray(files)) return [];
      return (await Promise.all(files.filter(f => f.type === 'file' && /\.md$/i.test(f.name))
        .map(async f => {
          try {
            const r = await fetch(f.download_url, { cache: 'no-store' });
            return r.ok ? readMarkdown(await r.text(), f.name) : null;
          } catch { return null; }
        }))).filter(Boolean);
    } catch { return []; }
  }

  async function initialize() {
    const files = [
      ['site', 'content/site.json', {}],
      ['news', 'content/actualites.json', backup.news || []],
      ['archives', 'content/archives.json', backup.archives || []],
      ['gallery', 'content/galerie.json', backup.gallery || []],
      ['scenes', 'content/visuels.json', backup.scenes || []]
    ];
    const [results, articles, games] = await Promise.all([
      Promise.all(files.map(async ([key, path, fallback]) =>
        [key, await getJSON(path, fallback)])),
      getCollection('content/actualites'), getCollection('content/jeux')
    ]);
    const data = Object.fromEntries(results);
    const site = data.site && typeof data.site === 'object' && !Array.isArray(data.site)
      ? data.site : {};
    const game = games.find(g => /another[\s-]?day/i.test(g.title) ||
      /another[\s-]?day/i.test(g.filename));
    const gameText = game?.description || game?.body || '';
    const cmsNews = articles.map(a => ({
      title: a.title || 'Actualité ANS Production',
      text: a.body || a.description,
      date: a.date || a.filename.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '',
      type: 'Actualité'
    })).filter(a => a.text).sort((a, b) => b.date.localeCompare(a.date));
    const D = {
      ...backup, ...site,
      ...(gameText ? { gameIntro: gameText, gameStory: gameText } : {}),
      news: [...cmsNews, ...(Array.isArray(data.news) ? data.news : [])],
      archives: Array.isArray(data.archives) ? data.archives : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : backup.gallery || [],
      scenes: Array.isArray(data.scenes) ? data.scenes : backup.scenes || []
    };
    window.ANS_CONFIG = D;
    return D;
  }

  initialize().then(start).catch(error => {
    console.error('ANS Production : données CMS indisponibles', error);
    start(backup);
  });
})();
/* Logo officiel Another Day — ajout sans téléchargement */
(() => {
  const root = document.getElementById('app');
  if (!root) return;

  const logo = `<svg class="ad-wordmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 104" role="img" aria-label="Another Day — logo officiel pixel art"><path fill="#f7f6ee" fill-rule="evenodd" d="M249 46h-18v4h13l2 2v2l-1 1h-9l-2 4h-3v10l-1 1h-2l-2 4h-4v3l-1 1h-9l-1 1v4l-1 1h-11v4h12v-4l1 -1h9v-4l1 -1h5v-4l1 -1h3v-2l1 -1h20v-20h-2l-1 -1z M238 61l1 -1h6l1 1v3l-1 1h-6l-1 -1z M149 46v3l-2 1v16l2 1v3h15l1 1v4h4l1 1v3h4l1 1v4l1 1h4l1 1v4h6l1 1v5h5v-5h-5l-1 -1v-4h-5l-1 -1v-5h-5l-1 -1v-4h-5l-1 -1v-3l1 -1h5v-16l1 -1h10v-7h-17v23l-1 1h-2l-1 -1v-5h-12l-1 -1v-3l1 -1h12v-9h-2l-1 -1v-3z M152 51l1 -1h5l1 1v3l-1 1h-5l-1 -1z M84 46v23h13v-2l1 -1h2v-16l-2 -1v-3z M90 53h4l1 1v8l-1 1h-4l-1 -1v-8z M256 45v21h3l2 3h9l1 1v3l-1 1h-14v8h16v-4l1 -1h6v-32h-7v14l-2 2h-6l-1 -1v-14l-1 -1z M28 38v35h8v-11l1 -1h12l1 1v11h11l2 4h5l1 1v4h5l1 1v5h7l1 -1v-4h-7l-1 -1v-4h-6l-1 -1v-3h-5l-1 -1v-3l1 -1h5v-14l1 -1h4l1 1v14h5v-5l1 -1v-12l-3 -2v-3h-15v20l-1 1h-2l-1 -1v-29h-22l-1 1z M36 44l1 -1h12l1 1v10l-1 1h-12l-1 -1z M104 36v30h1l2 3h11v-7h-6l-1 -1v-7l1 -1h6v-7h-6l-1 -1v-8l-1 -1z M227 36h-4l-2 -5h-27v5l-1 1h-6l-1 -1v-5h-4l-1 -1v-4h-5l-1 -1v-4h-4l-1 -1v-4l-1 -1h-4v5l-1 1h-5v4l-1 1h-4v4l-1 1h-4l-1 1v4l-1 1h-5v4l-1 1h-4v3l-1 1h-5l-2 -2v-9l1 -1v-2l-1 -1h-11l-1 1v4l1 1h4l1 1v35l-1 1h-5v3l-1 1h-4l-2 5h-5v3l-1 1h-5v4l1 1h4l1 -1v-4l1 -1h5v-3l1 -1h4v-3l1 -1h5v-4l1 -1h5v-2l2 -3v-10l-1 -1v-2l2 -2h4l1 1v15h7v-19h-2l-2 -3l3 -2v-3l1 -1h5v-4l1 -1h4v-4l1 -1h5v-5l1 -1h4v-4l1 -1h4l1 1v4h5l1 1v5h4l1 1v4l1 1h4l1 1v3h11l1 1v21l-1 1h-4v6h28v-3l1 -1h4z M207 39h11l1 1v22l-1 1h-11l-1 -1v-22z"/><path fill="#40c423" fill-rule="evenodd" d="M204 88h-6v3l-1 1h-4v3l-1 1h-5v6h5v-4l1 -1h5v-3l1 -1h5z M82 87v5l1 1h4l2 4h4l1 1v4h6v-5l-1 -1h-3l-1 -1v-3h-6l-1 -1v-4z M272 77v6l1 1h5l1 1v4h5l1 1v4l1 1h2l1 -1l2 1l1 -1v-6h-6l-1 -1v-4h-5l-2 -2l1 -1l-1 -3z M49 18h-7v5l-1 1h-7v5l-1 1h-6v6h7v-5l1 -1h7v-5l1 -1h6z M169 2h-6v5l-1 1h-4v6h5v-5l1 -1h5z"/></svg>`;

  const css = document.createElement('style');
  css.textContent = `
    .ad-logo-title {
      font-size: 0!important;
      letter-spacing: 0!important;
      line-height: 1!important;
    }
    .ad-logo-title svg {
      display: block;
      width: 100%;
      height: auto;
    }
    .feature-title.ad-logo-title { width: min(62vw,760px); }
    .game-display.ad-logo-title {
      width: min(76vw,850px);
      margin: 22px 0;
    }
    .catalog-body h2.ad-logo-title {
      width: 100%;
      max-width: 440px;
      margin: 30px 0;
    }
    .studio-fullbleed-text h2.ad-logo-title {
      width: min(55vw,540px);
      margin: 20px 0;
    }
    .ad-logo-home {
      width: min(45vw,350px);
      margin: 12px 0 16px;
    }
    .ad-logo-home svg {
      display: block;
      width: 100%;
      height: auto;
      filter: drop-shadow(0 5px 15px #0006);
    }
    @media (max-width:700px) {
      .feature-title.ad-logo-title,
      .game-display.ad-logo-title { width: 90%; }
      .ad-logo-home { width: min(65vw,290px); }
      .studio-fullbleed-text h2.ad-logo-title {
        width: min(75vw,440px);
      }
    }
  `;
  document.head.append(css);

  function apply() {
    for (const selector of [
      '.feature-section .feature-title',
      '.game-hero .game-display',
      '.games-catalog .catalog-body h2',
      '.studio-fullbleed-text h2'
    ]) {
      const el = root.querySelector(selector);
      if (el && !el.querySelector('svg.ad-wordmark')) {
        el.classList.add('ad-logo-title');
        el.innerHTML = logo;
      }
    }

    const eyebrow = root.querySelector(
      '.ans-story-hero .ans-hero-copy .ans-eyebrow'
    );
    if (eyebrow && !root.querySelector('.ad-logo-home')) {
      const div = document.createElement('div');
      div.className = 'ad-logo-home';
      div.innerHTML = logo;
      eyebrow.after(div);
    }
  }

  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  }).observe(root, { childList: true, subtree: true });

  apply();
})();
