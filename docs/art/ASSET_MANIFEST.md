# Manifeste d'assets — SUXA TONDEUSE (cible « Stardew, mais avec des tondeuses »)

Ce document est la **source de vérité** de tous les sprites à générer. Respecte
les tailles, le nombre de frames et le nommage : l'art livré ainsi se branche
directement dans le moteur PixiJS (pas de retouche d'intégration).

## Règles globales (NON négociables)

- **Grille de base : 16 × 16 px** (le monde du jardin est en tuiles 16 px, comme
  Stardew). Les personnages/robots peuvent occuper 16×16 ou 16×32 (voir plus bas).
- **Pixel-art strict** : pas d'anti-aliasing, pas de dégradé lisse, bords nets.
  Échelle d'affichage gérée par le moteur (`image-rendering: pixelated`).
- **Palette limitée & partagée** (déjà définie dans `frontend/src/styles/tokens.css`) :
  - Herbe : `#d8e89a #b8d672 #8fbf4f #6ba53a #4a8a2e #2f6b22 #1d4a18`
  - Terre : `#e8d2a8 #c9a576 #a37c4f #7a5631 #4d3520`
  - Métal robot : `#e8eef2 #b8c4d0 #8595a8 #556678 #2f3a4a`
  - Bois/papier UI : `#fff8e7 #f5e6c8 #e3c896 #c49b6a #8b6240 #5c3d24`
  - Accents : rouge `#d54c4c`, or `#f5c443`, rose `#f29bb8`, vert `#6dbf5c`, violet `#9b6dc4`
  - Eau : `#c8ecec #7ec5c5 #4a96a8`
- **Fond transparent** (PNG RGBA) pour tout ce qui n'est pas une tuile de sol.
- **Contour** : liseré sombre 1 px (« outline ») cohérent sur les objets/persos,
  comme Stardew/Sprout Lands.
- **Nommage de fichier** : `kebab-case`, voir chaque section.

## Atlas (sprite sheets) attendus — `frontend/public/assets/sprites/`

| Fichier         | Taille cible | Grille (frame) | Contenu                              |
| --------------- | ------------ | -------------- | ------------------------------------ |
| `terrain.png`   | 256 × 256    | 16×16          | Sol : herbe (autotile), terre, eau   |
| `robots.png`    | 384 × 512    | 32×32          | Robots-animaux animés                |
| `decor.png`     | 512 × 512    | 16×16 / multi  | Props : fleurs, arbres, maison, déco |
| `mowing.png`    | 256 × 128    | 16×16          | Frames de tonte (herbe coupée + fx)  |
| `fx.png`        | 256 × 128    | 16×16          | Particules (sparkle, pièce, poussière)|
| `ui.png`        | 384 × 256    | 9-slice        | Cadres, boutons, icônes pixel        |

> Les dimensions peuvent grandir par multiples de la frame ; garde la grille
> régulière (le loader lit `frame = col*W, row*H`).

---

## 1. Terrain — `terrain.png` (frames 16×16)

Herbe en **autotile 4 stages de hauteur** (le robot tond → la hauteur baisse) :

- `grass-stage-3` (haute, fleurie) · `grass-stage-2` · `grass-stage-1` · `grass-stage-0` (tondue/rase)
- Pour chaque stage, idéalement un **mini-autotile 3×3** (bords/coins) pour des
  transitions propres entre zones tondues et non tondues (sinon 1 tuile par stage suffit pour démarrer).
- Tuiles **terre** (chemin) : centre + 8 bords (3×3).
- Tuiles **eau** : centre + bords + 2 frames d'animation (léger scintillement).

Rangée 0 : grass-3 (×3 variations) | grass-2 | grass-1 | grass-0
Rangée 1 : autotile herbe (coins/bords)
Rangée 2 : terre 3×3
Rangée 3 : eau (centre + bords + 2 frames anim)

## 2. Robots-animaux — `robots.png` (frames 32×32, perso = 16×24 dans la frame, centré bas)

Roster (tiers de la boutique). Chaque robot = une **tondeuse mignonne déguisée en animal**, métal chromé bleuté + accent de couleur de l'animal, gros yeux kawaii (style Stardew/cozy) :

1. **Coccinelle** (rouge à points noirs)
2. **Papillon** (ailes pastel rose/cyan)
3. **Escargot** (coquille spirale dorée, lent)
4. **Abeille** (rayé jaune/noir, petites ailes)
5. **Fourmi** (rouge sombre, antennes)
6. **Légende verte** (doré, premium — halo)

Pour CHAQUE robot, une **bande d'animation** :

- `idle` : 2 frames (respiration / antenne qui bouge)
- `walk-down` `walk-up` `walk-left` `walk-right` : 4 frames chacune
- `mow` : 2 frames (lame qui tourne, herbe qui vole)

Soit **20 frames / robot**. Layout : 1 robot par bloc de lignes, colonnes = frames.
Nommage si découpé en fichiers : `robot-coccinelle-walk-down-0.png` … etc.

## 3. Décor & props — `decor.png` (16×16, certains multi-tuiles)

- Fleurs (×4 couleurs), touffes, champignons, cailloux, clôture (bois), panneau.
- **Maison cottage de Mémé** (multi-tuiles, ~48×48) + perron.
- Arbre (×4 saisons : printemps/été/automne/hiver), buisson, lanterne.
- Personnages meme statiques : **Mémé**, **Marcel**, **Gisèle** (16×24, 2 frames idle).
- Props par thème (voir thèmes de carte) : cerisier (sakura), cactus/roche (volcanique),
  cristaux (cristal), tournesol (champ), etc.

## 4. Tonte & FX — `mowing.png` + `fx.png` (16×16)

- `mow-cut` : herbe fraîchement coupée (brins courts + brindilles éparses), 2 frames.
- `fx-sparkle` 4 frames · `fx-coin` 4 frames (pièce dorée qui tourne) ·
  `fx-dust` 3 frames (poussière de tonte) · `fx-confetti` 4 frames · `fx-heart` 2 frames.

## 5. Particules d'ambiance (thèmes) — peuvent vivre dans `fx.png`

`sakura` (pétale) · `fireflies` (point lumineux 2 frames) · `embers` (braise) ·
`snowflakes` (flocon) · `leaves` (feuille) · `gold-sparkles` (éclat doré). 1–4 frames chacun, 8×8 ou 16×16.

## 6. UI — `ui.png` (9-slice + icônes)

- Cadre panneau « papier cottage » 9-slice (coins/bords/centre) — réutilise les
  bois `#5c3d24 / #8b6240 / #e3c896`.
- Boutons 9-slice (normal/hover/press) pour les variantes du design system.
- Icônes pixel 16×16 : pièce, gemme, étoile, cœur, engrenage, cadenas, trophée,
  feuille, éclair, horloge. (Remplacent à terme les SVG `<rect>` faits main.)

---

## Cycle jour/nuit & éclairage (fait en code, pas en asset)

Le moteur applique un **overlay de teinte** (skyTint par thème) + lune/soleil.
Les assets doivent donc être peints en **lumière neutre/diurne** ; ne pas cuire
d'ombres colorées dans les sprites (le moteur s'en charge).

## Définition de « terminé » (qualité Stardew)

- Cohérence : même palette, même taille d'outline, même angle de lumière (haut-gauche).
- Lisibilité à 16 px réels (teste en zoom ×1 sur mobile).
- Aucun pixel orphelin / aucun anti-aliasing.
- Chaque sprite centré dans sa frame, pied sur la ligne du bas (pour les persos).
