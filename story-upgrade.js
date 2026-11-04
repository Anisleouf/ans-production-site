/* ANS Production — Another Day, Story Edition.
   Progressive enhancement: neither app.js nor Pages CMS is replaced. */
(() => {
  'use strict';
  const page = document.body.dataset.page;
  if (page !== 'home' && page !== 'game') return;
  const app = document.getElementById('app');
  if (!app) return;

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
  const safeImage = (input, fallback) => {
    const p = String(input || '').replace(/^\/+/, '').trim();
    return /^assets\/[a-z0-9_\/.%àâéèêôùç -]+\.(png|jpe?g|webp)$/i.test(p) && !p.includes('..') ? p : fallback;
  };
  const D = () => window.ANS_CONFIG || {};
  const asset = name => `assets/another-day/${name}.jpg`;
  const portrait = name => `assets/personnages-authentiques/${name}.png`;
  const videoPath = 'another-day-trailer-premium.mp4';
  const authenticNote = '<span class="ans-proof">VISUELS DU PROJET — PAS DES CAPTURES DE GAMEPLAY</span>';

  function hero() {
    const config = D();
    const text = config.homeIntro || 'Chaque jour, Hugo avance. Au collège, chez lui, sur le chemin du retour… certains silences finissent par tout changer.';
    const image = safeImage(config.heroImage, asset('01_menu_crepuscule'));
    const line1 = config.homeTitle1 || 'Une journée';
    const line2 = config.homeTitle2 || 'comme les autres.';
    const line3 = config.homeTitle3 || 'Jusqu’à aujourd’hui.';
    return `
    <section class="home-hero ans-story-hero" aria-label="Découvrir l'histoire d’Another Day" id="decouvrir">
      <img class="ans-hero-art" src="${escapeHTML(image)}" alt="Décor du menu d’Another Day, ville au crépuscule" fetchpriority="high">
      <div class="ans-hero-glow" aria-hidden="true"></div>
      <div class="ans-hero-inner container">
        <div class="ans-hero-copy">
          <div class="ans-eyebrow"><span class="ans-live-dot"></span>${escapeHTML(config.homeKicker || 'ANS PRODUCTION PRÉSENTE · UNE AVENTURE NARRATIVE')}</div>
          <h1>${escapeHTML(line1)}<br><em>${escapeHTML(line2)}</em><br><span>${escapeHTML(line3)}</span></h1>
          <p>${escapeHTML(text)}</p>
          <div class="ans-hero-actions">
            <a class="ans-action ans-action-primary" href="#bande-annonce"><span class="ans-play-glyph" aria-hidden="true">▶</span> Voir la bande-annonce</a>
            <a class="ans-action ans-action-secondary" href="#histoire">Découvrir son histoire <span aria-hidden="true">↗</span></a>
          </div>
          <div class="ans-hero-facts"><span>JEU NARRATIF 2D</span><span>CHOIX & ÉMOTIONS</span><span>EN DÉVELOPPEMENT</span></div>
        </div>
        <div class="ans-hero-hugo" aria-hidden="true"><div class="ans-hugo-halo"></div><img src="${portrait('hugo')}" alt=""></div>
      </div>
      <div class="ans-hero-bottom"><span>01 — UNE HISTOIRE À VIVRE</span><a href="#bande-annonce" aria-label="Faire défiler jusqu'à la bande-annonce">DÉFILER ↓</a></div>
      ${authenticNote}
    </section>`;
  }

  function trailerSection() {
    return `
      <section class="ans-trailer" id="bande-annonce" aria-labelledby="ans-trailer-title">
        <div class="container ans-trailer-layout">
          <div class="ans-trailer-copy" data-ans-reveal>
            <div class="ans-overline">LE FILM DE PRÉSENTATION <span>01 / 03</span></div>
            <h2 id="ans-trailer-title">Tu ne connais pas encore <em>Hugo.</em></h2>
            <p>Une chambre, un trajet, un collège. Une vie qui semble ordinaire. Mais chaque regard, chaque rencontre et chaque décision peuvent laisser une trace.</p>
            <div class="ans-trailer-sub">75 SECONDES · TRAILER OFFICIEL · SON À ACTIVER</div>
          </div>
          <div class="ans-video-frame" data-ans-reveal>
            <video class="ans-trailer-video" controls playsinline preload="metadata" poster="${asset('01_menu_crepuscule')}" aria-label="Bande-annonce d'Another Day, avec musique">
              <source src="${videoPath}" type="video/mp4">
              Votre navigateur ne prend pas en charge la vidéo MP4.
            </video>
            <div class="ans-video-note"><span>ANOTHER DAY / BANDE-ANNONCE</span><span>Appuie sur ▶ et active le son</span></div>
          </div>
        </div>
      </section>`;
  }

  function beat(no, label, heading, body, image, tone='') {
    return `<article class="ans-beat ${tone}" data-ans-reveal>
       <div class="ans-beat-media"><img src="${asset(image)}" alt="${escapeHTML(label)} : décor archivé d'Another Day" loading="lazy"></div>
       <div class="ans-beat-content">
         <span class="ans-beat-no">${no} / ${escapeHTML(label.toUpperCase())}</span>
         <h3>${heading}</h3>
         <p>${escapeHTML(body)}</p>
       </div>
     </article>`;
  }

  function storySections() {
    const config = D();
    const gameText = config.gameStory || 'Another Day suit Hugo entre la maison, le collège et les rencontres qui dessinent peu à peu son parcours.';
    return `
      <section class="ans-narrative" id="histoire" aria-labelledby="ans-narrative-title">
        <div class="container ans-narrative-head" data-ans-reveal>
          <span class="ans-overline">L'HISTOIRE <span>02 / 03</span></span>
          <h2 id="ans-narrative-title">Le plus difficile n’est pas toujours <em>visible.</em></h2>
          <p>${escapeHTML(gameText)}</p>
        </div>
        <div class="ans-beat-grid container">
          ${beat('01','LE MATIN','Tout commence comme <em>d’habitude.</em>','La même chambre. Les mêmes gestes. Une nouvelle journée à traverser.','03_chambre_hugo')}
          ${beat('02','LE COLLÈGE','Il y a des mots qu’on <em>retient.</em>','Au milieu des autres, on peut parfois avoir l’impression d’être seul.','09_salle_de_classe','ans-beat-offset')}
          ${beat('03','LE RETOUR','Et si une rencontre <em>changeait tout ?</em>','Dans une ville familière, certains instants ouvrent des chemins inattendus.','06_rue_pluie')}
        </div>
        <div class="ans-midquote" data-ans-reveal><div class="container"><span>UN JEU SUR CE QU’ON VIT</span><p>On ne choisit pas toujours ce qui arrive.<br><em>Mais chaque choix laisse une trace.</em></p></div></div>
      </section>
      <section class="ans-characters-story" aria-labelledby="ans-characters-title">
        <div class="container ans-char-layout">
          <div class="ans-char-visual" data-ans-reveal>
            <div class="ans-char-stage"><img src="${portrait('hugo')}" alt="Hugo, personnage d’Another Day" loading="lazy"><img src="${portrait('noe')}" alt="Noé, personnage d’Another Day" loading="lazy"></div>
            <span>PORTRAITS ISSUS DES RESSOURCES DU PROJET</span>
          </div>
          <div class="ans-char-text" data-ans-reveal>
            <div class="ans-overline">LES PERSONNAGES <span>03 / 03</span></div>
            <h2 id="ans-characters-title">Derrière chaque visage, <em>une histoire.</em></h2>
            <p>Hugo n’avance pas dans son histoire tout seul. Les relations, les silences et les petits gestes prennent une place immense.</p>
            <a class="ans-action ans-action-dark" href="another-day.html">Rencontrer les personnages <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <section class="ans-final" aria-labelledby="ans-final-title">
        <img src="${asset('05_rue_soir')}" alt="Rue du jeu Another Day au crépuscule" loading="lazy">
        <div class="container ans-final-copy" data-ans-reveal>
          <span>UNE JOURNÉE PEUT TOUT CHANGER</span>
          <h2 id="ans-final-title">Another <em>Day.</em></h2>
          <p>Une aventure narrative sur le quotidien, les rencontres et les choix qui restent.</p>
          <div class="ans-hero-actions">
            <a class="ans-action ans-action-primary" href="another-day.html">Découvrir le jeu <span aria-hidden="true">↗</span></a>
            <a class="ans-action ans-action-secondary" href="#bande-annonce">Revoir le trailer <span aria-hidden="true">▶</span></a>
          </div>
          <small>EN DÉVELOPPEMENT · WINDOWS · ANS PRODUCTION</small>
        </div>
      </section>`;
  }

  function gameRibbon() {
    return `<section class="ans-game-ribbon" aria-label="Bande-annonce et présentation du jeu">
      <div class="container ans-game-ribbon-inner">
        <div><span>LE PREMIER JEU D'ANS PRODUCTION</span><h2>L’histoire commence <em>ici.</em></h2><p>Avant d'entrer dans l'univers d'Hugo, découvre l'ambiance du jeu.</p></div>
        <a class="ans-action ans-action-primary" href="#bande-annonce">Voir la bande-annonce <span aria-hidden="true">▶</span></a>
      </div>
    </section>`;
  }

  function render() {
    const main = app.querySelector('main#main');
    if (!main || main.dataset.ansStoryApplied) return false;
    main.dataset.ansStoryApplied = 'true';

    if (page === 'home') {
      const originalHero = main.querySelector('.home-hero');
      if (originalHero) originalHero.outerHTML = hero();
      const newHero = main.querySelector('.ans-story-hero');
      if (newHero) newHero.insertAdjacentHTML('afterend', trailerSection() + storySections());
    } else {
      const pageHero = main.querySelector('.game-hero');
      if (pageHero) pageHero.insertAdjacentHTML('afterend', gameRibbon() + trailerSection());
      const story = main.querySelector('.story-block');
      if (story) {
        const note = document.createElement('p');
        note.className = 'ans-game-story-tag';
        note.textContent = 'LES SILENCES. LES RENCONTRES. LES CHOIX.';
        story.querySelector('.story-copy')?.prepend(note);
      }
    }
    document.querySelectorAll('[data-ans-reveal]').forEach(el => el.classList.add('ans-ready'));
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const io = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('ans-shown'); io.unobserve(entry.target);
        }
      }, {threshold: 0.08, rootMargin: '0px 0px -30px 0px'});
      document.querySelectorAll('[data-ans-reveal]').forEach(el => io.observe(el));
    } else document.querySelectorAll('[data-ans-reveal]').forEach(el => el.classList.add('ans-shown'));
    // Video is never autoplayed: iOS visitors initiate playback with audio themselves.
    return true;
  }

  if (!render()) {
    const watch = new MutationObserver(() => {
      if (render()) watch.disconnect();
    });
    watch.observe(app, {childList: true, subtree: true});
    document.addEventListener('DOMContentLoaded', () => { if (render()) watch.disconnect(); }, {once: true});
  }
})();
