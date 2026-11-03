# ANS Production — V1000000

## Ce que contient le site

Dix pages HTML statiques, une direction artistique éditoriale, 16 décors extraits du projet Unity, les sprites originaux de la version 1.6, 8 compositions décor + portrait et une galerie avec filtres et vue plein écran. Toutes les compositions sont présentées comme des assemblages de ressources, pas des captures de gameplay.

## Voir le site sur ordinateur

1. Décompresse le ZIP.
2. Ouvre **index.html** dans Chrome, Firefox ou Safari. Les contenus de secours sont inclus pour un aperçu hors connexion.
3. Pour prévisualiser le comportement de Pages CMS, héberge le dossier localement (`python -m http.server 8000`) et ouvre `http://localhost:8000/`.

## Rendre le site public et modifiable

1. Crée un dépôt GitHub et charge **tous les fichiers/dossiers contenus dans ce ZIP**, sans mettre le ZIP lui-même dans le dépôt.
2. Connecte ce dépôt à Netlify (import GitHub), configuration : **commande de build vide**, dossier de publication **`.`**.
3. Une fois déployé, ouvre https://app.pagescms.org et connecte-toi avec le compte GitHub autorisé, puis sélectionne le dépôt du site.
4. Dans Pages CMS, modifie les rubriques « Accueil, jeu et studio », « Galerie », « Scènes illustrées », « Actualités », et « Archives ». Les changements enregistrés sont publiés sur GitHub, puis Netlify redéploie le site si le lien GitHub-Netlify est actif.
5. Pour un vrai `.com`, achète un nom de domaine disponible avec un parent/tuteur et ajoute-le dans Netlify > Domain management. Suis les paramètres DNS affichés par Netlify. Le domaine n'est PAS inclus et n'a pas été réservé.

**Important** : l'éditeur Pages CMS sert à modifier les textes, images, actualités et compositions, pas librement déplacer les blocs du site. La structure graphique reste dans `app.js` et `styles.css`.

## Garder l'identité originale

- `assets/logo-original.jpg` : véritable logo fourni par le créateur.
- `assets/logo-transparent.png` : le même logo, avec fond supprimé pour l'en-tête (sans nouvelle typographie).
- `assets/another-day/` : 16 vraies images de décors extraites des fichiers Unity reconstitués.
- `assets/personnages-authentiques/` : sprites issus des images 1.6 fournies dans la conversation.
- Aucun décor ou personnage supplémentaire généré pour ce site.

## Modifier les informations

- `content/site.json` : accroches, jeu, studio, images, liens éventuels, statut et version publique.
- `content/galerie.json` : décors présentés et descriptions.
- `content/visuels.json` : compositions des vrais décors et portraits.
- `content/actualites.json` et `content/archives.json` : publications, actuellement vides pour ne pas inventer d'annonces.

`site-config.js` sert de miroir de secours hors ligne. En ligne, le site lit les fichiers `content/*.json` directement ; les changements Pages CMS s'affichent donc après déploiement sans nécessité de modifier `site-config.js`.

## Contact et informations légales

Le formulaire est désactivé, car aucun service de collecte sûr n'est encore raccordé. Pour l'activer plus tard, configure un service de formulaire sécurisé et renseigne `contactEndpoint` dans `site-config.js` ; le service devra être vérifié en conditions réelles. Ne publie jamais d'adresse personnelle, mot de passe ou clé privée. Complète les pages `mentions-legales.html` et `confidentialite.html` via les deux champs prévus dans Pages CMS avant publication, avec un adulte responsable.

## Vérifications avant publication

- Accueil, Another Day, Univers, Studio, Journal, Contact.
- Les 8 émotions et les 16 décors.
- Filtres de galerie, visionneuse, menu mobile, chargement des images, navigation clavier.
- Liens de téléchargement et bande-annonce uniquement quand de vraies URL HTTPS existent.
- Vérifie les droits d'usage/publication de toutes les ressources graphiques que tu as fournies.

Ce site est une version **préparée pour publication**, pas un site déjà hébergé. Le numéro « V1000000 » est une version interne du site ; la version publique du jeu Another Day reste prévue comme « 1.1 ».
