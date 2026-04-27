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

### PHASE 1

- **`exactOptionalPropertyTypes: true`** + Zod : Zod produit `field?: string | undefined` (avec union explicite), donc le type partagé doit aussi être `field?: string | undefined`. Sans ça, on a TS2379 sur les passages de schemas vers SavePayload.
- **`noUncheckedIndexedAccess: true`** : trop strict pour le frontend qui manipule beaucoup de matrices (tiles 6×6, palettes par index). Désactivé spécifiquement dans `frontend/tsconfig.app.json`. Reste actif côté shared et backend.
- **TypeScript composite + `tsc.tsbuildinfo`** : si on supprime manuellement `dist/`, il faut aussi supprimer `tsconfig.tsbuildinfo` sinon `tsc` ne réémet pas (croit à un cache valide).
- **Zustand + immer** : pour les types Decimal (break_infinity), immer fait des problèmes avec `Object.freeze` sur les classes. Solution : ne pas freezer manuellement, laisser le draft muter normalement.
- **PixiJS `Application.init()`** est asynchrone : toujours gérer le démontage avant init avec un flag `cancelled` pour éviter les leaks de canvas.
- **`navigator.sendBeacon`** : ne supporte pas les headers custom, donc l'authentification par `Bearer` ne marche pas. On envoie le payload + un HMAC en clair, le serveur authentifie via le cookie httpOnly s'il est présent.
- **Auto-save** : éviter `setInterval` côté composant React (re-démarrage au remount). Centraliser dans un orchestrator qui s'enregistre à `beforeunload` + `visibilitychange` + intervalles.

### PHASE 2

- **Immer + `Set` / `Map`** : par défaut immer ne supporte pas les structures `Set`/`Map` ; il faut appeler `enableMapSet()` au boot du store. Sans ça, les drafts contenant un `Set` lèvent une erreur cryptique de plugin.
- **Achievements claimables** : on stocke un suffixe `:claimed` dans le même `Set` plutôt que d'avoir un second `Set`. Plus simple à sérialiser, mais filtrer à la sérialisation pour ne pas exposer le suffixe au backend.
- **Prestige + recompute production** : après un reset prestige, il faut recalculer `cashPerSecond` car les multiplicateurs de parcelles et upgrades changent. Centraliser dans une fonction `computeProduction(state)` appelée à chaque mutation pertinente.
- **Leaderboard sur save** : `Promise.all` les upserts par catégorie, mais wrapper dans un `try/catch` qui swallow les erreurs pour ne pas faire échouer la save principale.
- **Onglets dans GamePage** : pour ne pas démonter/remonter les panels lourds, on peut utiliser CSS `display: none` au lieu d'un rendu conditionnel. PHASE 2 est OK avec rendu conditionnel mais à reconsidérer si lag.

### PHASE 3

- **Météo aléatoire dans `computeProduction`** : le multiplier change avec l'heure → tests deviennent flaky (un orage = production 0). Solution : `IS_TEST = process.env.NODE_ENV === 'test'` dans le store, neutralise weather/season en test.
- **`exactOptionalPropertyTypes`** + champs optionnels stringifiés via JSON : Zod produit `field?: T | undefined`, le type partagé doit être explicite avec `| undefined` pour ne pas avoir TS2379. Pattern récurrent : tout nouveau champ optionnel dans le SavePayload doit avoir `field?: X | undefined` côté shared.
- **PWA Service Worker** : enregistrer uniquement en `import.meta.env.PROD` pour éviter de polluer le HMR Vite en dev. Le SW vit dans `public/` (servi tel quel par Vite, pas processé).
- **Pets par rareté** : pondération cumulative simple (60/25/10/4/1) suffit en PHASE 3. PHASE 4 : ajouter pity timer pour les drops legendaires (anti-frustration).
- **Skins par couleur hex (number)** : plus facile à manipuler en JS qu'une string `#xxx`, et compatible direct avec PixiJS (`fill(0xff0000)`).

### PHASE 4 (déploiement VPS + invites Discord)

- **Auto-formatage URL chez les clients de chat** : certains clients ajoutent automatiquement des `<...>` autour des URLs même dans les blocs de code, ce qui casse `sed` et `bash`. Solutions : décomposer l'URL en variables (`PROTO=http`, `HOST=...`), ou utiliser des patterns sans `://` (ex: `:3000/api` au lieu de `http://localhost:3000/api`).
- **Conflits de ports sur VPS multi-services** : avant de mapper un port Docker vers l'hôte, vérifier `ss -tlnp | grep :PORT`. Si occupé, remapper (ex: `3100:3000`) plutôt que tuer le service existant. Mettre à jour `VITE_API_URL` en parallèle pour que le client appelle le nouveau port public.
- **`VITE_API_URL` relatif (`/api`)** > absolu (`http://localhost:3100/api`) quand le frontend est servi via tunnel/proxy : le navigateur résout `/api` contre l'origine courante (Cloudflare), Vite proxy en interne vers le backend. Plus robuste qu'une URL absolue qui ne fonctionne que depuis la machine du serveur.
- **Vite 6 `allowedHosts`** : par défaut bloque les hosts inconnus en mode dev. Pour exposer via un tunnel à URL changeante, mettre `allowedHosts: true` dans `server` du `vite.config.ts`. Penser à mounter le fichier dans Docker (sinon il est dans l'image, pas en volume → modifs ignorées).
- **Prisma migrate vs db push** : sans fichiers de migrations générés (`prisma migrate dev`), `migrate deploy` ne fait rien (silent fail). Utiliser `prisma db push --accept-data-loss` pour synchroniser le schéma directement sur la DB en dev/déploiement simple. Cron de migration au boot du conteneur.
- **PixiJS v8 dans certains environnements** (mobile, Cloudflare tunnel, etc.) peut crasher silencieusement sans message dans les logs serveur. Sans accès à la console navigateur, dur à debug. Mitigation : Error Boundary + fallback CSS, et préférer `preference: 'webgl'` plutôt que le default WebGPU.
- **Cookie `httpOnly` + `sameSite`** : pour qu'un cookie posé par `/api/redeem` soit envoyé sur les requêtes suivantes du front, `sameSite: 'lax'` est nécessaire (pas `strict`) car le redirect depuis le tunnel Cloudflare est cross-origin du point de vue du navigateur. `secure: true` en prod uniquement.
- **JWT avec `scope`** : pour distinguer plusieurs types de tokens (access, refresh, invite) qui partagent le même `JWT_SECRET`, ajouter un champ `scope` dans le payload et le vérifier après `jwt.verify`. Évite qu'un access token soit utilisé comme invite ou inversement.
- **Auto-update VPS en pull** : `git fetch` + `git rev-parse HEAD` vs `origin/branch` permet de détecter un nouveau commit sans modifier le repo. Si différent : `git reset --hard` (pas de merge possible si modifs locales) + rebuild Docker. `flock` sur un fichier lock évite les exécutions concurrentes du cron.
- **Snippet Python à coller vs nouveau bot** : quand l'utilisateur a déjà un bot, créer un snippet Python autonome (avec ses propres imports, sa propre fonction async) plutôt qu'un bot complet. Le snippet doit vivre dans `suxabot/` du repo avec un README clair pour l'intégration.
