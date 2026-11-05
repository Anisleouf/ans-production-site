
/* ANS Production — Another Day
   Site officiel + nouveaux personnages pixel art
   Fichier : story-upgrade.js
*/

(() => {
  "use strict";

  const page = document.body.dataset.page;
  if (page !== "home" && page !== "game") return;

  const app = document.getElementById("app");
  if (!app) return;

  const config = () => window.ANS_CONFIG || {};

  const asset = name =>
    `assets/another-day/${name}.jpg`;

  const oldPortrait = name =>
    `assets/personnages-authentiques/${name}.png`;

  const pixelPortrait = name =>
    `assets/personnages-pixel/${name}/idle.png`;

  const pixelWalk = name =>
    `assets/personnages-pixel/${name}/marche.webp`;

  const trailer = "another-day-trailer-premium.mp4";

  const personnages = [
    {
      id: "hugo",
      nom: "Hugo",
      role: "Personnage principal"
    },
    {
      id: "maman",
      nom: "Maman",
      role: "La mère de Hugo"
    },
    {
      id: "papa",
      nom: "Papa",
      role: "Le père de Hugo"
    },
    {
      id: "ilyes",
      nom: "Ilyes",
      role: "Camarade de classe"
    },
    {
      id: "professeur",
      nom: "Professeur",
      role: "Enseignant"
    },
    {
      id: "eleve",
      nom: "Élève",
      role: "Personnage secondaire"
    }
  ];

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );
  }

  function safeImage(input, fallback) {
    const path = String(input || "")
      .replace(/^\/+/, "")
      .trim();

    if (
      /^assets\/[a-z0-9_\/.%àâéèêôùç -]+\.(png|jpe?g|webp)$/i.test(path)
      && !path.includes("..")
    ) {
      return path;
    }

    return fallback;
  }

  /* =============================
     ACCUEIL
  ============================= */

  function hero() {
    const data = config();

    const intro = data.homeIntro ||
      "Chaque jour, Hugo avance. Au collège, chez lui, sur le chemin du retour… certains silences finissent par tout changer.";

    const background = safeImage(
      data.heroImage,
      asset("01_menu_crepuscule")
    );

    const title1 = data.homeTitle1 || "Une journée";
    const title2 = data.homeTitle2 || "comme les autres.";
    const title3 = data.homeTitle3 || "Jusqu’à aujourd’hui.";

    return `
      <section class="home-hero ans-story-hero"
               id="decouvrir">

        <img class="ans-hero-art"
             src="${escapeHTML(background)}"
             alt="Ville au crépuscule dans Another Day"
             fetchpriority="high">

        <div class="ans-hero-glow"></div>

        <div class="ans-hero-inner container">

          <div class="ans-hero-copy">

            <div class="ans-eyebrow">
              <span class="ans-live-dot"></span>
              ${escapeHTML(
                data.homeKicker ||
                "ANS PRODUCTION PRÉSENTE · UNE AVENTURE NARRATIVE"
              )}
            </div>

            <h1>
              ${escapeHTML(title1)}<br>
              <em>${escapeHTML(title2)}</em><br>
              <span>${escapeHTML(title3)}</span>
            </h1>

            <p>${escapeHTML(intro)}</p>

            <div class="ans-hero-actions">

              <a class="ans-action ans-action-primary"
                 href="#bande-annonce">
                ▶ Voir la bande-annonce
              </a>

              <a class="ans-action ans-action-secondary"
                 href="#histoire">
                Découvrir son histoire ↗
              </a>

            </div>

            <div class="ans-hero-facts">
              <span>JEU NARRATIF 2D</span>
              <span>CHOIX & ÉMOTIONS</span>
              <span>EN DÉVELOPPEMENT</span>
            </div>

          </div>

          <div class="ans-hero-hugo">
            <div class="ans-hugo-halo"></div>
            <img src="${pixelPortrait("hugo")}"
                 alt="Hugo en pixel art"
                 class="ans-pixel-home-portrait">
          </div>

        </div>

        <div class="ans-hero-bottom">
          <span>01 — UNE HISTOIRE À VIVRE</span>
          <a href="#bande-annonce">DÉFILER ↓</a>
        </div>

        <span class="ans-proof">
          VISUELS DU PROJET — PAS DES CAPTURES DE GAMEPLAY
        </span>

      </section>
    `;
  }

  /* =============================
     BANDE-ANNONCE
  ============================= */

  function trailerSection() {
    return `
      <section class="ans-trailer"
               id="bande-annonce">

        <div class="container ans-trailer-layout">

          <div class="ans-trailer-copy"
               data-ans-reveal>

            <div class="ans-overline">
              LE FILM DE PRÉSENTATION
              <span>01 / 03</span>
            </div>

            <h2>
              Tu ne connais pas encore
              <em>Hugo.</em>
            </h2>

            <p>
              Une chambre, un trajet, un collège.
              Une vie qui semble ordinaire.
              Mais chaque regard, chaque rencontre
              et chaque décision peuvent laisser une trace.
            </p>

            <div class="ans-trailer-sub">
              TRAILER OFFICIEL · SON À ACTIVER
            </div>

          </div>

          <div class="ans-video-frame"
               data-ans-reveal>

            <video class="ans-trailer-video"
                   controls
                   playsinline
                   preload="metadata"
                   poster="${asset("01_menu_crepuscule")}">

              <source src="${trailer}"
                      type="video/mp4">

              Votre navigateur ne prend pas en charge
              la vidéo.

            </video>

            <div class="ans-video-note">
              <span>ANOTHER DAY / BANDE-ANNONCE</span>
              <span>Appuie sur ▶ et active le son</span>
            </div>

          </div>

        </div>

      </section>
    `;
  }

  /* =============================
     HISTOIRE
  ============================= */

  function beat(number, label, title, description, image, extra = "") {
    return `
      <article class="ans-beat ${extra}"
               data-ans-reveal>

        <div class="ans-beat-media">
          <img src="${asset(image)}"
               alt="${escapeHTML(label)}"
               loading="lazy">
        </div>

        <div class="ans-beat-content">
          <span class="ans-beat-no">
            ${number} / ${escapeHTML(label.toUpperCase())}
          </span>

          <h3>${title}</h3>

          <p>${escapeHTML(description)}</p>
        </div>

      </article>
    `;
  }

  function storySections() {
    const gameText = config().gameStory ||
      "Another Day suit Hugo entre la maison, le collège et les rencontres qui dessinent peu à peu son parcours.";

    return `
      <section class="ans-narrative"
               id="histoire">

        <div class="container ans-narrative-head"
             data-ans-reveal>

          <span class="ans-overline">
            L'HISTOIRE <span>02 / 03</span>
          </span>

          <h2>
            Le plus difficile n’est pas toujours
            <em>visible.</em>
          </h2>

          <p>${escapeHTML(gameText)}</p>

        </div>

        <div class="ans-beat-grid container">

          ${beat(
            "01",
            "LE MATIN",
            "Tout commence comme <em>d’habitude.</em>",
            "La même chambre. Les mêmes gestes. Une nouvelle journée à traverser.",
            "03_chambre_hugo"
          )}

          ${beat(
            "02",
            "LE COLLÈGE",
            "Il y a des mots qu’on <em>retient.</em>",
            "Au milieu des autres, on peut parfois avoir l’impression d’être seul.",
            "09_salle_de_classe",
            "ans-beat-offset"
          )}

          ${beat(
            "03",
            "LE RETOUR",
            "Et si une rencontre <em>changeait tout ?</em>",
            "Dans une ville familière, certains instants ouvrent des chemins inattendus.",
            "06_rue_pluie"
          )}

        </div>

        <div class="ans-midquote"
             data-ans-reveal>

          <div class="container">
            <span>UN JEU SUR CE QU’ON VIT</span>

            <p>
              On ne choisit pas toujours ce qui arrive.<br>
              <em>Mais chaque choix laisse une trace.</em>
            </p>
          </div>

        </div>

      </section>

      <section class="ans-characters-story">

        <div class="container ans-char-layout">

          <div class="ans-char-visual"
               data-ans-reveal>

            <div class="ans-char-stage">

              <img src="${pixelPortrait("hugo")}"
                   alt="Hugo en pixel art"
                   class="ans-pixel-home-portrait"
                   loading="lazy">

              <img src="${pixelPortrait("maman")}"
                   alt="La mère de Hugo en pixel art"
                   class="ans-pixel-home-portrait"
                   loading="lazy">

            </div>

            <span>
              CONCEPTS PIXEL ART DES PERSONNAGES
            </span>

          </div>

          <div class="ans-char-text"
               data-ans-reveal>

            <div class="ans-overline">
              LES PERSONNAGES
              <span>03 / 03</span>
            </div>

            <h2>
              Derrière chaque visage,
              <em>une histoire.</em>
            </h2>

            <p>
              Hugo n’avance pas dans son histoire tout seul.
              Les relations, les silences et les petits gestes
              prennent une place immense.
            </p>

            <a class="ans-action ans-action-dark"
               href="another-day.html">
              Rencontrer les personnages ↗
            </a>

          </div>

        </div>

      </section>

      <section class="ans-final">

        <img src="${asset("05_rue_soir")}"
             alt="Rue au crépuscule"
             loading="lazy">

        <div class="container ans-final-copy"
             data-ans-reveal>

          <span>UNE JOURNÉE PEUT TOUT CHANGER</span>

          <h2>Another <em>Day.</em></h2>

          <p>
            Une aventure narrative sur le quotidien,
            les rencontres et les choix qui restent.
          </p>

          <div class="ans-hero-actions">

            <a class="ans-action ans-action-primary"
               href="another-day.html">
              Découvrir le jeu ↗
            </a>

            <a class="ans-action ans-action-secondary"
               href="#bande-annonce">
              Revoir le trailer ▶
            </a>

          </div>

          <small>
            EN DÉVELOPPEMENT · WINDOWS · ANS PRODUCTION
          </small>

        </div>

      </section>
    `;
  }

  function gameRibbon() {
    return `
      <section class="ans-game-ribbon">

        <div class="container ans-game-ribbon-inner">

          <div>
            <span>LE PREMIER JEU D'ANS PRODUCTION</span>

            <h2>L’histoire commence <em>ici.</em></h2>

            <p>
              Avant d'entrer dans l'univers d'Hugo,
              découvre l'ambiance du jeu.
            </p>
          </div>

          <a class="ans-action ans-action-primary"
             href="#bande-annonce">
            Voir la bande-annonce ▶
          </a>

        </div>

      </section>
    `;
  }

  /* =============================
     NOUVEAUX PERSONNAGES PIXEL ART
  ============================= */

  function installPixelStyles() {
    if (document.getElementById("ans-pixel-styles")) return;

    const style = document.createElement("style");
    style.id = "ans-pixel-styles";

    style.textContent = `
      .characters-section .character-grid.ans-pixel-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
      }

      .characters-section .ans-pixel-card {
        min-width: 0;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.12);
        background: #202b33;
        border-radius: 4px;
        transition: transform .2s ease, border-color .2s ease;
        outline-offset: 3px;
      }

      .characters-section .ans-pixel-card:hover,
      .characters-section .ans-pixel-card:focus-visible {
        transform: translateY(-3px);
        border-color: #e8a58d;
      }

      .characters-section .ans-pixel-photo {
        aspect-ratio: 1.05;
        position: relative;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        overflow: hidden;
        padding: 18px 16px 0;
        background:
          radial-gradient(
            circle at 50% 52%,
            rgba(108,130,134,.39),
            transparent 56%
          ),
          linear-gradient(
            145deg,
            #1b252e,
            #35434b 55%,
            #1d262d
          );
      }

      .characters-section .ans-pixel-portrait {
        position: relative;
        z-index: 1;
        display: block;
        width: auto;
        max-width: 95%;
        height: 93%;
        object-fit: contain;
        object-position: center bottom;
        image-rendering: pixelated;
        border-radius: 0;
        box-shadow: none;
        filter: drop-shadow(0 8px 8px rgba(0,0,0,.28));
      }

      .characters-section .ans-pixel-number {
        position: absolute;
        top: 13px;
        left: 15px;
        z-index: 2;
        color: #dcb5a4;
        font: 700 11px system-ui, sans-serif;
        letter-spacing: .12em;
      }

      .characters-section .ans-pixel-animation-tag {
        position: absolute;
        bottom: 10px;
        right: 11px;
        z-index: 2;
        color: #eee;
        background: rgba(8,16,20,.75);
        padding: 5px 7px;
        font: 600 9px system-ui, sans-serif;
        letter-spacing: .05em;
      }

      .characters-section .ans-pixel-text {
        padding: 16px 18px 19px;
      }

      .characters-section .ans-pixel-card h3 {
        color: #eee8e0;
        margin: 0 0 5px;
      }

      .characters-section .ans-pixel-card p {
        color: #c4c6c5;
        margin: 0;
      }

      .ans-pixel-poster {
        margin: 36px 0 0;
        max-width: 850px;
      }

      .ans-pixel-poster-link {
        display: block;
        border: 1px solid rgba(255,255,255,.2);
      }

      .ans-pixel-poster img {
        display: block;
        width: 100%;
        height: auto;
      }

      .ans-pixel-poster p {
        font-size: 12px;
        line-height: 1.6;
        margin-top: 11px;
        color: #c6c5c1;
      }

      .ans-pixel-home-portrait {
        image-rendering: pixelated;
      }

      .ans-hero-hugo img.ans-pixel-home-portrait {
        animation: none !important;
      }

      @media (max-width: 820px) {
        .characters-section .character-grid.ans-pixel-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
      }

      @media (max-width: 420px) {
        .characters-section .ans-pixel-photo {
          aspect-ratio: .8;
          padding: 9px 6px 0;
        }

        .characters-section .ans-pixel-animation-tag {
          font-size: 7px;
          left: 6px;
          right: 6px;
          bottom: 6px;
          text-align: center;
        }

        .characters-section .ans-pixel-text {
          padding: 12px 11px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .ans-pixel-card {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function create(tag, className, content) {
    const element = document.createElement(tag);

    if (className) element.className = className;

    if (content !== undefined) {
      element.textContent = content;
    }

    return element;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Animation au survol */

  function animateCharacter(image, walking) {
    if (reducedMotion) return;

    if (!walking) {
      image.dataset.walkWanted = "0";
      image.src = image.dataset.idle;
      return;
    }

    image.dataset.walkWanted = "1";

    if (image.dataset.walkReady === "1") {
      image.src = image.dataset.walk;
      return;
    }

    if (image.dataset.walkReady === "error") return;
    if (image.dataset.walkReady === "loading") return;

    image.dataset.walkReady = "loading";

    const preload = new Image();

    preload.onload = () => {
      image.dataset.walkReady = "1";

      if (image.dataset.walkWanted === "1") {
        image.src = image.dataset.walk;
      }
    };

    preload.onerror = () => {
      image.dataset.walkReady = "error";
      image.src = image.dataset.idle;
    };

    preload.src = image.dataset.walk;
  }

  function characterCard(personnage, index) {
    const card = create(
      "article",
      "character-card ans-pixel-card"
    );

    const photo = create(
      "div",
      "character-photo ans-pixel-photo"
    );

    const image = create("img", "ans-pixel-portrait");

    image.src = pixelPortrait(personnage.id);
    image.dataset.idle = image.src;
    image.dataset.walk = pixelWalk(personnage.id);
    image.dataset.walkWanted = "0";

    image.alt =
      `${personnage.nom}, personnage d'Another Day en pixel art`;

    image.loading = "lazy";
    image.decoding = "async";

    const number = create(
      "span",
      "ans-pixel-number",
      String(index + 1).padStart(2, "0")
    );

    const text = create(
      "div",
      "character-text ans-pixel-text"
    );

    text.append(
      create("h3", "", personnage.nom),
      create("p", "", personnage.role)
    );

    const animationLabel = create(
      "small",
      "ans-pixel-animation-tag",
      "ANIMATION DE MARCHE AU SURVOL"
    );

    photo.append(image, number, animationLabel);
    card.append(photo, text);

    card.tabIndex = 0;

    card.addEventListener("pointerenter", () => {
      animateCharacter(image, true);
    });

    card.addEventListener("pointerleave", () => {
      animateCharacter(image, false);
    });

    card.addEventListener("focusin", () => {
      animateCharacter(image, true);
    });

    card.addEventListener("focusout", () => {
      animateCharacter(image, false);
    });

    card.addEventListener("click", () => {
      if (!window.matchMedia("(hover: hover)").matches) {
        const isWalking =
          image.dataset.walkWanted === "1";

        animateCharacter(image, !isWalking);
      }
    });

    return card;
  }

  /* Galerie des six personnages */

  function updateCharacterGallery() {
    const grid = document.querySelector(
      'body[data-page="game"] .characters-section .character-grid'
    );

    if (!grid) return;
    if (grid.dataset.ansPixelReady === "1") return;

    const cards = personnages.map(
      (personnage, index) =>
        characterCard(personnage, index)
    );

    grid.replaceChildren(...cards);
    grid.classList.add("ans-pixel-grid");
    grid.dataset.ansPixelReady = "1";

    const section = grid.closest(".characters-section");

    const description = section?.querySelector(
      ".visual-title-row p"
    );

    if (description) {
      description.textContent =
        "Découvre les six nouveaux personnages pixel art d'Another Day et leurs animations de marche.";
    }

    if (
      section &&
      !section.querySelector(".ans-pixel-poster")
    ) {
      const poster = create(
        "div",
        "ans-pixel-poster"
      );

      const link = create(
        "a",
        "ans-pixel-poster-link"
      );

      link.href =
        "assets/personnages-pixel/affiche_originale.png";

      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const posterImage = create("img", "");

      posterImage.src = link.href;
      posterImage.alt =
        "Affiche des six personnages pixel art d'Another Day";

      posterImage.loading = "lazy";

      link.appendChild(posterImage);

      const description = create(
        "p",
        "",
        "Concept art des personnages. Survole leurs cartes pour découvrir les animations."
      );

      poster.append(link, description);
      grid.after(poster);
    }
  }

  /* Actualisation des personnages d'accueil */

  function replacePortrait(image, personnage) {
    if (!image) return;

    if (image.dataset.ansPixelReady === "1") {
      return;
    }

    image.src = pixelPortrait(personnage);
    image.alt = `${personnage} en pixel art`;

    image.classList.add("ans-pixel-home-portrait");
    image.dataset.ansPixelReady = "1";
  }

  function updateHomeCharacters() {
    replacePortrait(
      document.querySelector(".ans-hero-hugo img"),
      "hugo"
    );

    replacePortrait(
      document.querySelector(".home-hero .hero-character"),
      "hugo"
    );

    const stage = document.querySelector(".ans-char-stage");

    if (stage && stage.dataset.ansPixelReady !== "1") {
      const images = stage.querySelectorAll("img");

      replacePortrait(images[0], "hugo");
      replacePortrait(images[1], "maman");

      stage.dataset.ansPixelReady = "1";

      const label = stage.closest(
        ".ans-char-visual"
      )?.querySelector("span");

      if (label) {
        label.textContent =
          "CONCEPTS PIXEL ART DES PERSONNAGES · ANOTHER DAY";
      }
    }
  }

  /* =============================
     INSTALLATION SUR LES PAGES
  ============================= */

  function renderStory() {
    const main = app.querySelector("main#main");

    if (!main) return false;
    if (main.dataset.ansStoryApplied) return true;

    main.dataset.ansStoryApplied = "true";

    if (page === "home") {
      const oldHero = main.querySelector(".home-hero");

      if (oldHero) {
        oldHero.outerHTML = hero();
      }

      const newHero = main.querySelector(".ans-story-hero");

      if (newHero) {
        newHero.insertAdjacentHTML(
          "afterend",
          trailerSection() + storySections()
        );
      }
    } else {
      const gameHero = main.querySelector(".game-hero");

      if (gameHero) {
        gameHero.insertAdjacentHTML(
          "afterend",
          gameRibbon() + trailerSection()
        );
      }

      const story = main.querySelector(".story-block");

      if (story && !story.querySelector(".ans-game-story-tag")) {
        const note = create(
          "p",
          "ans-game-story-tag",
          "LES SILENCES. LES RENCONTRES. LES CHOIX."
        );

        story.querySelector(".story-copy")?.prepend(note);
      }
    }

    document.querySelectorAll(
      "[data-ans-reveal]"
    ).forEach(element => {
      element.classList.add("ans-ready");
    });

    if (
      "IntersectionObserver" in window &&
      !reducedMotion
    ) {
      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("ans-shown");
              observer.unobserve(entry.target);
            }
          }
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -30px 0px"
        }
      );

      document.querySelectorAll(
        "[data-ans-reveal]"
      ).forEach(element => observer.observe(element));

    } else {
      document.querySelectorAll(
        "[data-ans-reveal]"
      ).forEach(element => {
        element.classList.add("ans-shown");
      });
    }

    return true;
  }

  function refresh() {
    renderStory();

    if (page === "game") {
      updateCharacterGallery();
    } else {
      updateHomeCharacters();
    }
  }

  installPixelStyles();

  let queued = false;

  const observer = new MutationObserver(() => {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  });

  observer.observe(app, {
    childList: true,
    subtree: true
  });

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      refresh,
      { once: true }
    );
  }

  refresh();

})();

/* ANOTHER DAY — MISE À JOUR DES ÉMOTIONS PIXEL ART */

(() => {
  "use strict";

  const hugo = "assets/personnages-pixel/hugo/idle.png";

  const emotions = [
    ["Pensif", "Une journée qui commence autrement.", "#78aec3", "···"],
    ["Souriant", "Un instant qui fait du bien.", "#e2c58b", "✦"],
    ["Gêné", "Les mots qui ne viennent pas.", "#d59dad", "♡"],
    ["Triste", "Les silences pèsent parfois.", "#7993ba", "—"],
    ["Surpris", "Ce qu’on n’avait pas vu venir.", "#83b9b7", "!"],
    ["Déterminé", "Choisir de faire un pas.", "#e7a073", "↑"],
    ["Heureux", "La lumière revient, parfois.", "#e5ce74", "✳"],
    ["Neutre", "Le quotidien, simplement.", "#a6b5b8", "○"]
  ];

  const style = document.createElement("style");

  style.textContent = `
    .ans-pixel-deck .emotion-art {
      transition: background .35s ease;
    }

    .ans-pixel-deck .emotion-portrait {
      image-rendering: pixelated;
      object-fit: contain;
      object-position: center bottom;
      filter: drop-shadow(0 18px 26px rgba(0,0,0,.38));
    }

    .ans-pixel-deck .ans-pixel-mood {
      position: absolute;
      right: 24px;
      top: 23px;
      z-index: 3;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,.3);
      background: rgba(14,24,29,.56);
      color: #f7e9d9;
      font-size: 24px;
      font-weight: 600;
      pointer-events: none;
    }

    @media (max-width: 600px) {
      .ans-pixel-deck .ans-pixel-mood {
        right: 12px;
        top: 12px;
        width: 38px;
        height: 38px;
        font-size: 19px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ans-pixel-deck .emotion-art {
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);

  function install(deck) {
    if (deck.dataset.ansPixelEmotions === "1") return;

    const portrait = deck.querySelector(".emotion-portrait");
    const art = deck.querySelector(".emotion-art");

    if (!portrait || !art) return;

    deck.dataset.ansPixelEmotions = "1";
    deck.classList.add("ans-pixel-deck");

    const symbol = document.createElement("span");
    symbol.className = "ans-pixel-mood";
    symbol.setAttribute("aria-hidden", "true");
    art.appendChild(symbol);

    const heading = deck.querySelector(".emotion-top .smallcaps");
    if (heading) {
      heading.textContent = "HUGO · HUIT ÉTATS NARRATIFS";
    }

    const proof = deck.querySelector(".emotion-mini");
    if (proof) {
      proof.textContent = "PORTRAIT PIXEL ART · ANOTHER DAY";
    }

    const label = deck.querySelector("[data-emotion-label]");
    if (label) label.setAttribute("aria-live", "polite");

    let index = 0;

    function show(next) {
      index = (next + emotions.length) % emotions.length;

      const [name, description, tint, mark] = emotions[index];

      if (portrait.getAttribute("src") !== hugo) {
        portrait.src = hugo;
      }

      portrait.alt = `Hugo en pixel art — ambiance ${name}`;

      art.style.background =
        `radial-gradient(circle at 50% 55%, ${tint}55, transparent 58%), #1a2b30`;

      symbol.textContent = mark;

      if (label) label.textContent = name;

      const caption = deck.querySelector("[data-emotion-caption]");
      if (caption) caption.textContent = description;

      const number = String(index + 1).padStart(2, "0");

      const current = deck.querySelector("[data-emotion-current]");
      if (current) current.textContent = number;

      const counter = deck.querySelector(".emotion-index");
      if (counter) {
        counter.textContent = `ÉTAT ${number} — 08`;
      }

      deck.querySelectorAll("[data-emotion-tab]").forEach((button, i) => {
        button.setAttribute("aria-pressed", String(i === index));
      });
    }

    // Empêcher les anciens boutons d'afficher les images cassées.
    deck.addEventListener("click", event => {
      const button = event.target.closest("button");

      if (!button || !deck.contains(button)) return;

      let next;

      if (button.hasAttribute("data-emotion-prev")) {
        next = index - 1;
      } else if (button.hasAttribute("data-emotion-next")) {
        next = index + 1;
      } else if (button.hasAttribute("data-emotion-tab")) {
        next = Number(button.dataset.emotionTab);
      } else {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      show(next);
    }, true);

    show(0);
  }

  function refresh() {
    document.querySelectorAll("[data-emotion-deck]").forEach(install);

    document.querySelectorAll(".feelings-head > p").forEach(p => {
      if (p.dataset.ansPixelCaption) return;

      p.dataset.ansPixelCaption = "1";
      p.textContent =
        "Découvre huit ambiances de l’histoire d’Hugo à travers son nouveau portrait pixel art.";
    });
  }

  const app = document.getElementById("app");
  if (!app) return;

  new MutationObserver(refresh).observe(app, {
    childList: true,
    subtree: true
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh, {
      once: true
    });
  }

  refresh();
})();

