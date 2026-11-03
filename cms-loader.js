
/* ANS Production - Pages CMS / GitHub Pages */
(() => {
  'use strict';

  const backup = window.ANS_CONFIG || {};
  const repo = 'Anisleouf/ans-production-site';
  const base = `https://api.github.com/repos/${repo}/contents/`;
  const paths = [
    ['site', 'content/site.json', {}],
    ['news', 'content/actualites.json', backup.news || []],
    ['archives', 'content/archives.json', backup.archives || []],
    ['gallery', 'content/galerie.json', backup.gallery || []],
    ['scenes', 'content/visuels.json', backup.scenes || []]
  ];

  function start() {
    const script = document.createElement('script');
    script.src = 'app.js';
    script.onerror = () => console.error('ANS Production : app.js introuvable');
    document.head.appendChild(script);
  }

  if (location.protocol === 'file:') {
    start();
    return;
  }

  async function getJSON(path, fallback) {
    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('ANS Production : fichier indisponible', path, error);
      return fallback;
    }
  }

  function readMarkdown(source) {
    const normalized = source.replace(/\r\n/g, '\n');
    const match = normalized.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
    const header = match ? match[1] : '';
    const body = match ? normalized.slice(match[0].length) : normalized;

    function field(name) {
      const lines = header.split('\n');
      const index = lines.findIndex(line => line.startsWith(name + ':'));
      if (index === -1) return '';
      const raw = lines[index].slice(name.length + 1).trim();

      if (!/^[>|][+-]?$/.test(raw)) {
        return raw.replace(/^['"]|['"]$/g, '').trim();
      }

      const collected = [];
      for (let i = index + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() && !/^\s/.test(line)) break;
        collected.push(line.replace(/^ {2}/, ''));
      }

      return collected.join(raw.startsWith('>') ? ' ' : '\n').trim();
    }

    function plain(text) {
      return text
        .replace(/^>\s?/gm, '')
        .replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[*_`#]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    return {
      title: field('title'),
      description: plain(field('description')),
      body: plain(body),
      date: field('date')
    };
  }

  async function getCollection(folder) {
    try {
      const response = await fetch(base + folder + '?ref=main', {
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const files = await response.json();
      if (!Array.isArray(files)) return [];

      const markdownFiles = files.filter(file =>
        file.type === 'file' && /\.md$/i.test(file.name)
      );

      const results = await Promise.all(markdownFiles.map(async file => {
        try {
          const response = await fetch(file.download_url, { cache: 'no-store' });
          if (!response.ok) return null;
          return { ...readMarkdown(await response.text()), filename: file.name };
        } catch {
          return null;
        }
      }));

      return results.filter(Boolean);
    } catch (error) {
      console.warn('ANS Production : collection indisponible', folder, error);
      return [];
    }
  }

  async function initialize() {
    const [values, articles, games] = await Promise.all([
      Promise.all(paths.map(async ([key, path, fallback]) =>
        [key, await getJSON(path, fallback)])),
      getCollection('content/actualites'),
      getCollection('content/jeux')
    ]);

    const data = Object.fromEntries(values);
    const site = data.site && typeof data.site === 'object' &&
      !Array.isArray(data.site) ? data.site : {};

    const game = games.find(item =>
      /another[\s-]?day/i.test(item.title) ||
      /another[\s-]?day/i.test(item.filename)
    );

    const gameText = game?.description || game?.body || '';
    const cmsGame = gameText ? {
      gameIntro: gameText,
      gameStory: gameText
    } : {};

    const cmsNews = articles.map(item => ({
      title: item.title || 'Actualité ANS Production',
      text: item.body || item.description,
      date: item.date || (item.filename.match(/^\d{4}-\d{2}-\d{2}/) || [])[0] || '',
      type: 'Actualité'
    })).filter(item => item.text);

    cmsNews.sort((a, b) => b.date.localeCompare(a.date));

    window.ANS_CONFIG = {
      ...backup,
      ...site,
      ...cmsGame,
      news: [...cmsNews, ...(Array.isArray(data.news) ? data.news : [])],
      archives: Array.isArray(data.archives) ? data.archives : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : backup.gallery || [],
      scenes: Array.isArray(data.scenes) ? data.scenes : backup.scenes || []
    };
  }

  initialize().catch(error => {
    console.error('ANS Production : chargement CMS impossible', error);
  }).finally(start);
})();
