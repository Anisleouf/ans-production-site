
/* ANS Production - Pages CMS */
(() => {
  "use strict";

  const backup = window.ANS_CONFIG || {};

  const paths = [
    ["site", "content/site.json", {}],
    ["news", "content/actualites.json", backup.news || []],
    ["archives", "content/archives.json", backup.archives || []],
    ["gallery", "content/galerie.json", backup.gallery || []],
    ["scenes", "content/visuels.json", backup.scenes || []]
  ];

  const start = () => {
    const script = document.createElement("script");
    script.src = "app.js";
    script.onerror = () => console.error("app.js introuvable");
    document.head.append(script);
  };

  if (location.protocol === "file:") {
    start();
    return;
  }

  async function loadJSON(path, fallback) {
    try {
      const response = await fetch(path, {cache: "no-store"});
      if (!response.ok) return fallback;
      return await response.json();
    } catch {
      return fallback;
    }
  }

  function parseMarkdown(source, filename) {
    const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)/);
    const metadata = match ? match[1] : "";
    const body = match ? match[2] : source;

    const title = metadata.match(/^title:\s*(.+)$/m)?.[1] || filename;
    const date = metadata.match(/^date:\s*(.+)$/m)?.[1]
      || filename.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
      || "";

    return {
      title: title.replace(/^["']|["']$/g, ""),
      date,
      type: "Actualité",
      text: body.replace(/[#*_>`]/g, "").trim().slice(0, 1200)
    };
  }

  async function loadCMSNews() {
    const api = "https://api.github.com/repos/Anisleouf/ans-production-site/contents/content/actualites?ref=main";

    try {
      const response = await fetch(api, {cache: "no-store"});
      if (!response.ok) return [];

      const files = await response.json();
      if (!Array.isArray(files)) return [];

      const articles = await Promise.all(
        files.filter(f => f.name.endsWith(".md"))
          .map(async f => {
            const r = await fetch(f.download_url);
            if (!r.ok) return null;
            return parseMarkdown(await r.text(), f.name);
          })
      );

      return articles.filter(Boolean)
        .sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
      console.warn("Pages CMS temporairement indisponible", error);
      return [];
    }
  }

  async function initialize() {
    const values = await Promise.all(
      paths.map(async ([key, path, fallback]) =>
        [key, await loadJSON(path, fallback)])
    );

    const data = Object.fromEntries(values);
    const site = data.site && typeof data.site === "object"
      && !Array.isArray(data.site) ? data.site : {};

    const cmsNews = await loadCMSNews();
    
    let cmsGame = {};
    try {
      const api = "https://api.github.com/repos/Anisleouf/ans-production-site/contents/content/jeux?ref=main";
      const response = await fetch(api);
      if (response.ok) {
        const files = await response.json();
        const game = files.find(f => f.name.toLowerCase().includes("another-day") && f.name.endsWith(".md"));
        if (game) {
          const raw = await fetch(game.download_url).then(r => r.text());
          const front = raw.match(/^---\s*\n([\s\S]*?)\n---/);
          const description = front?.[1].match(/^description:\s*(.+)$/m);
          if (description) {
            cmsGame.gameIntro = description[1].replace(/^["']|["']$/g, "");
          }
        }
      }
    } catch (e) {
      console.warn("Chargement du jeu impossible", e);
    }


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

  initialize().catch(console.error).finally(start);
})();
