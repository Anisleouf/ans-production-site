
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
