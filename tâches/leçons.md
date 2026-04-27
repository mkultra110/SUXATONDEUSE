# Leçons apprises — ROBOMOW TYCOON

> Ce fichier capture les corrections utilisateur et les règles auto-imposées pour ne pas refaire les mêmes erreurs.
> À relire au début de chaque session.

## Règles globales (issues du GDD et du workflow)

- Tous les commentaires de code en **français**.
- Variables et fonctions en **anglais** (convention internationale).
- TypeScript **strict** partout (frontend + backend + shared).
- Currencies en **BigInt** côté serveur, `break_infinity.js` côté client.
- Validation **Zod** systématique avant toute écriture DB.
- PixiJS : `antialias: false`, `scaleMode: nearest`, `roundPixels: true`.
- `setInterval` **interdit** pour le tick → `requestAnimationFrame` + delta.
- Timestamps : **toujours** `Date.now()` serveur, jamais le client.
- Anti-cheat : **soft-flag** avec `suspicionScore`, jamais ban automatique.
- Externaliser tous les textes UI dans `locales/fr.json` dès le départ.
- Centraliser coûts/multiplicateurs dans `shared/balance/`.
- Commits atomiques en français : `feat(prestige): ajoute formule de calcul des graines`.

## Leçons spécifiques au projet

### PHASE 0

- **TypeScript composite + `tsc -b`** : si projet A référence projet B via `references`, B ne doit PAS avoir `noEmit`. Solution simple : ne pas utiliser `references` côté frontend, juste un alias `paths` qui pointe vers la source du shared.
- **Prisma `seed.ts`** : si placé sous `prisma/` (hors `rootDir = src`), exclure du `tsconfig.include` du backend, sinon `tsc` échoue avec TS6059. Le seed est exécuté via `tsx`.
- **Vitest backend + Prisma** : le client Prisma DOIT être généré (`npx prisma generate`) avant de lancer les tests qui importent le service auth — même si le test ne touche pas la DB.
- **PixiJS v8 + React** : utiliser `Application.init()` (async). Toujours `antialias: false`, `roundPixels: true`, `image-rendering: pixelated` côté CSS du canvas. L'init est asynchrone, gérer le cas du démontage avant init avec un flag `cancelled`.
- **JWT signOptions** : avec TS strict, expiresIn doit être passé via un objet `SignOptions` typé séparément, sinon TS rejette le surcharge (string | number ambigu).
- **Cookie httpOnly refresh** : path à `/api/auth` pour limiter l'envoi automatique aux seules routes auth — réduit la surface CSRF.
- **Anti-cheat HMAC** : utiliser `crypto.timingSafeEqual` après comparaison de longueur, jamais `===` direct.
- **Offline progress** : à 72h pile, le multiplier est 0.5 (fin de la pente linéaire 12-72h). Le palier 0.25 ne s'applique qu'au-delà ; mais comme on cap le temps à 72h, en pratique c'est 0.5 maximum. À reconsidérer en PHASE 1 si on veut un cap de 7 jours pleins (cf. GDD section 4.11).
