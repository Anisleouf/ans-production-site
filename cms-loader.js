/* Load editable JSON on a hosted website, preserve local index.html preview. */
(()=>{
 'use strict';
 const backup=window.ANS_CONFIG||{};
 const paths=[['site','content/site.json',{}],['news','content/actualites.json',backup.news||[]],['archives','content/archives.json',backup.archives||[]],['gallery','content/galerie.json',backup.gallery||[]],['scenes','content/visuels.json',backup.scenes||[]]];
 const start=()=>{const s=document.createElement('script');s.src='app.js';s.defer=true;s.onerror=()=>{const p=document.createElement('p');p.textContent='Le fichier app.js manque. Vérifie ton dossier de site.';document.getElementById('app')?.append(p)};document.head.append(s)};
 if(location.protocol==='file:'){start();return;}
 Promise.all(paths.map(async([k,path,fallback])=>{try{const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(`${r.status}`);return[k,await r.json()]}catch(e){console.warn('ANS Production: secours pour '+path,e);return[k,fallback]}})).then(values=>{
  const data=Object.fromEntries(values);const rawSite=data.site&&typeof data.site==='object'&&!Array.isArray(data.site)?data.site:{};
  window.ANS_CONFIG={...backup,...rawSite,news:Array.isArray(data.news)?data.news:[],archives:Array.isArray(data.archives)?data.archives:[],gallery:Array.isArray(data.gallery)?data.gallery:backup.gallery||[],scenes:Array.isArray(data.scenes)?data.scenes:backup.scenes||[]};
 }).finally(start);
})();