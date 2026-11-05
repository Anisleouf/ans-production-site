/* ANS Production — personnages pixel art, ajout non destructif.
   Ajoute uniquement la galerie, sans remplacer le moteur du site, le CMS ou ses pages. */
(()=>{
  'use strict';
  const names = [
    {id:'hugo',label:'Hugo',role:'Personnage principal'},
    {id:'maman',label:'Maman',role:'La mère de Hugo'},
    {id:'papa',label:'Papa',role:'Le père de Hugo'},
    {id:'ilyes',label:'Ilyes',role:'Camarade de classe'},
    {id:'professeur',label:'Professeur',role:'Enseignant'},
    {id:'eleve',label:'Élève',role:'Personnage secondaire'}
  ];
  const imgPath = id => `assets/personnages-pixel/${id}/idle.png`;
  const walkPath = id => `assets/personnages-pixel/${id}/marche.webp`;
  const sitePage = document.body.dataset.page;
  if (sitePage !== 'game' && sitePage !== 'home') return;

  // Autonomie : une seule ligne de script à ajouter aux pages, la feuille CSS se charge ici.
  if (!document.querySelector('link[data-ans-pixel-style]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'personnages-pixel.css';
    css.dataset.ansPixelStyle = 'true';
    document.head.append(css);
  }
  const make = (tag, className, value) => {
    const e=document.createElement(tag);
    if(className) e.className=className;
    if(value!==undefined) e.textContent=value;
    return e;
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateSprite(img, on) {
    if (reduced) return;
    img.src = on ? img.dataset.walk : img.dataset.idle;
  }
  function card(char, index) {
    const article=make('article','character-card ans-pixel-card');
    const photo=make('div','character-photo ans-pixel-photo');
    const still=make('img','ans-pixel-portrait');
    still.src=imgPath(char.id);
    still.dataset.idle=still.src;
    still.dataset.walk=walkPath(char.id);
    still.alt=`${char.label}, personnage du jeu Another Day en pixel art`;
    still.loading='lazy'; still.decoding='async';
    const num=make('span','ans-pixel-number',String(index+1).padStart(2,'0'));
    const cardLabel=make('div','character-text ans-pixel-text');
    cardLabel.append(make('h3','',char.label),make('p','',char.role));
    const badge=make('small','ans-pixel-animation-tag','ANIMATION DE MARCHE AU SURVOL');
    photo.append(still,num,badge);
    article.append(photo,cardLabel);
    article.tabIndex=0;
    article.addEventListener('pointerenter',()=>animateSprite(still,true));
    article.addEventListener('pointerleave',()=>animateSprite(still,false));
    article.addEventListener('focusin',()=>animateSprite(still,true));
    article.addEventListener('focusout',()=>animateSprite(still,false));
    article.addEventListener('click', e=>{
      if (e.pointerType==='touch' || !matchMedia('(hover: hover)').matches) {
        animateSprite(still,still.src!==still.dataset.walk);
      }
    });
    return article;
  }
  function addRoster() {
    const grid = document.querySelector('body[data-page="game"] .characters-section .character-grid');
    if(!grid || grid.dataset.ansPixelReady==='1') return;
    grid.replaceChildren(...names.map(card));
    grid.classList.add('ans-pixel-grid');
    grid.dataset.ansPixelReady='1';
    const section=grid.closest('.characters-section');
    const titleDesc=section?.querySelector('.visual-title-row p');
    if (titleDesc) titleDesc.textContent='Hugo et les cinq autres personnages adoptent leur nouvelle direction pixel art. Découvre les six designs et leurs animations de marche.';
    if (section && !section.querySelector('.ans-pixel-poster')) {
      const poster=make('div','ans-pixel-poster');
      const link=make('a','ans-pixel-poster-link');
      link.href='assets/personnages-pixel/affiche_originale.png';
      link.target='_blank'; link.rel='noopener noreferrer';
      const pict=make('img','ans-pixel-poster-art');
      pict.src=link.href;
      pict.loading='lazy'; pict.decoding='async';
      pict.alt='Affiche originale des six personnages pixel art d’Another Day';
      link.append(pict);
      const caption=make('p','', 'Concept art des personnages — illustration de référence. Les mouvements se découvrent sur les cartes ci-dessus.');
      poster.append(link,caption);
      grid.after(poster);
    }
  }
  function swapImage(img, name, text) {
    if (!img || img.dataset.ansPixelReady==='1') return;
    img.src=imgPath(name);
    img.alt=text;
    img.classList.add('ans-pixel-home-portrait');
    img.dataset.ansPixelReady='1';
  }
  function addHome() {
    swapImage(document.querySelector('.ans-hero-hugo img'),'hugo','Hugo en pixel art');
    swapImage(document.querySelector('.home-hero .hero-character'),'hugo','Hugo en pixel art');
    const stage = document.querySelector('.ans-char-stage');
    if(stage && stage.dataset.ansPixelReady!=='1') {
      const imgs=stage.querySelectorAll('img');
      swapImage(imgs[0],'hugo','Hugo en pixel art');
      swapImage(imgs[1],'maman','Maman en pixel art');
      stage.dataset.ansPixelReady='1';
      const note=stage.closest('.ans-char-visual')?.querySelector('span');
      if(note) note.textContent='CONCEPTS PIXEL ART DES PERSONNAGES · ANOTHER DAY';
    }
  }
  function refresh() {
    if(sitePage==='game') addRoster();
    else addHome();
  }
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;refresh();});
  });
  const root = document.getElementById('app') || document.body;
  observer.observe(root,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',refresh,{once:true});
  refresh();
})();
