# Prompts IA pour générer les sprites — SUXA TONDEUSE « Jardin de Poche »

Stratégie choisie : **génération IA + retouche**. Ce doc donne des prompts
prêts à coller, alignés sur le design system (`Design System.html`, section
Sprites) et le moteur (`ASSET_MANIFEST.md`). Objectif : un rendu cohérent
**type Stardew Valley / Sprout Lands**.

## ⚙️ Workflow recommandé (important)

Les générateurs d'images grand public font du « faux pixel-art » (flou, trop de
couleurs). Pour un vrai pixel-art exploitable :

1. **Génère grand** (512–1024 px) avec un prompt « pixel art sprite sheet ».
   Outils qui marchent bien : modèles spécialisés pixel-art (Retro Diffusion,
   PixelLab), ou un modèle généraliste + post-traitement.
2. **Post-traite** pour obtenir du vrai pixel : downscale à la taille cible
   (16/32/48 px) en **nearest-neighbor**, puis **quantification de palette** à
   ≤16 couleurs. Outils : Aseprite (Sprite > Color Mode > Indexed), ou
   `pixelit`, ou un script ImageMagick (`-resize 32x32 -dither None -colors 16`).
3. **Nettoie à la main** dans Aseprite : contour 1 px sombre net, supprime les
   pixels orphelins, recadre, fond transparent, ancrage **bas-centre**.
4. **Découpe en frames** empilées **verticalement**, une feuille par animation,
   nommage `snake_case` : `{sujet}_{action}_{variante}.png`.
5. Dépose dans `frontend/public/assets/sprites/` ; je branche le loader PixiJS.

> Astuce cohérence : génère TOUS les persos dans **un seul prompt de planche**
> (« character sheet, same style ») plutôt qu'un par un — la cohérence inter-sprites
> est le point faible n°1 de l'IA.

## 🎨 Contraintes de style à coller dans CHAQUE prompt

```
pixel art, 16-bit cozy farm game style, Stardew Valley / Sprout Lands inspired,
clean 1px dark outline, soft warm lighting from top-left, limited palette (<=16
colors), flat cel shading, no anti-aliasing, transparent background, centered,
adorable kawaii, wholesome cottagecore.
Palette: leaf greens, warm kraft browns, cream paper, gold coins, petal pink,
ladybug red, sky blue.
NEGATIVE: blurry, jpeg artifacts, gradients, realistic, 3d render, drop shadow
baked in, watermark, text, extra limbs, muddy colors.
```

---

## 1. Robots-animaux (persos) — 32×32, frames 32px empilées

Concept : des **tondeuses-robots déguisées en petits animaux**, chrome bleuté +
couleur de l'animal, gros yeux mignons, une lame qui dépasse sous le châssis.

**Marcel — la coccinelle** (`marcel_idle.png`, `marcel_walk.png`)

```
[STYLE] + a cute robot lawnmower disguised as a ladybug character, red domed
shell with black polka dots, two big friendly round eyes, tiny antennae, small
chrome mower body with a blade peeking underneath, 4 wheels.
Sprite sheet, 32x32 per frame, frames stacked vertically:
- idle: 4 frames (gentle breathing bob, antenna twitch)
- walk: 6 frames (rolling forward, wheels turning, slight bob)
View: 3/4 top-down, facing camera-down. Anchor bottom-center.
```

**Gisèle — le papillon** (`gisele_idle.png`, `gisele_fly.png`)

```
[STYLE] + a cute robot mower disguised as a butterfly, pastel pink and cyan
wings, chrome body, big sparkly eyes, hovering slightly.
Sprite sheet 32x32 per frame, stacked vertically:
- idle: 4 frames (wings folding/opening softly)
- fly: 4 frames (wing flap loop, gentle hover bob)
```

**Robert — l'escargot** (`robert_idle.png`, `robert_walk.png`)

```
[STYLE] + a cute robot mower disguised as a snail, golden spiral shell, sleepy
half-closed eyes, very slow, chrome treads instead of wheels.
Sprite sheet 32x32 per frame, stacked vertically:
- idle: 2 frames · walk: 6 frames (very slow glide, shell wobble)
```

(Décliner ensuite : Abeille rayée jaune/noir, Fourmi rouge sombre, et la
« Légende verte » dorée premium — même gabarit 32×32, même planche.)

## 2. Tuiles de sol — 16×16, terrain.png

```
[STYLE] + a top-down grass tile for a cozy farm game, 16x16 pixels, seamless
tileable. Produce a set:
- tall lush grass with tiny flowers (stage 3)
- medium grass (stage 2), short grass (stage 1), freshly mown stubble (stage 0)
- a 3x3 autotile for grass edges/corners
- dirt path 3x3 autotile, warm brown
- water tile with 2-frame gentle shimmer
Flat top-down, no perspective, seamless edges.
```

## 3. Maison & décor — 16×16 (multi-tuiles pour la maison)

```
[STYLE] + cottagecore pixel props for a cozy farm:
- Grandma's cottage (48x48, warm wood, flower window boxes, smoke from chimney)
- wooden fence pieces, a wooden sign, a lantern, a watering can
- flowers (4 colors), mushrooms, small bushes, pebbles
- a cherry blossom tree and a sunflower (for theme variants)
Top-down 3/4 view, transparent background, 1px outline.
```

## 4. FX / juice — 16×16, fx.png

```
[STYLE] + game juice effect sprite sheets, 16x16 per frame, stacked vertically,
transparent background:
- fx_coinpop.png: a spinning gold coin, 5 frames
- fx_confetti.png: colorful confetti pieces bursting, 8 frames
- fx_sparkle.png: a cute sparkle/star twinkle, 4 frames
- fx_dust.png: small grass-clipping dust puff, 3 frames
Bright, punchy, readable at small size.
```

## 5. Particules d'ambiance (par thème) — 8×8 ou 16×16

```
[STYLE] + tiny ambient particle sprites, transparent background:
sakura petal, firefly glow (2 frames), ember, snowflake, falling leaf,
gold sparkle. Each 8x8 or 16x16, soft and subtle.
```

## ✅ Checklist avant intégration (par fichier)

- [ ] Taille exacte (16/32/48), frames empilées verticalement.
- [ ] Fond transparent, ancrage bas-centre, contour 1px net.
- [ ] ≤16 couleurs, palette cohérente avec les tokens du design.
- [ ] Nom `snake_case` : `{sujet}_{action}_{variante}.png`.
- [ ] Lisible à l'échelle réelle (zoom ×1), pas de pixel orphelin.

Quand un lot est prêt dans `frontend/public/assets/sprites/`, ping-moi : je
branche le chargement PixiJS (atlas + animations) et le rendu dans la scène.
