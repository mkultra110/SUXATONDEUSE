# ROBOMOW TYCOON — Plan de développement

## Contexte

Projet : jeu web 2D idle/tycoon avec robots tondeuses.
Stack : React 19 + PixiJS v8 + Node 22 + Express + Prisma 6 + PostgreSQL 16 + Docker.
Branche de dev : `claude/greeting-setup-T7UTD`.
Intégration finale : commande slash `/suxa_robomow` (ou équivalent) sur le bot Discord existant, qui retourne un lien vers le jeu via le tunnel Cloudflare déjà en place (`/tmp/cloudflare_url.txt`).

## Stratégie de phasage

Le GDD est massif (plusieurs semaines de dev pour la v3). On suit la roadmap section 14 du GDD à la lettre, **une phase à la fois**, avec validation utilisateur à chaque jalon.

### PHASE 0 — Bootstrap (LIVRÉ ✅)

But : monorepo fonctionnel, jeu lançable en local via `docker compose up`.

- [x] Structure monorepo npm workspaces (frontend, backend, shared)
- [x] TypeScript strict, ESLint, Prettier, .gitignore, .dockerignore
- [x] `docker-compose.yml` dev local (postgres + adminer + backend + frontend)
- [x] Dockerfile prod backend + frontend (multi-stage)
- [x] `docker-compose.prod.yml` pour Coolify
- [x] Schéma Prisma complet (User, GameSave, Robot, Plot, Upgrade, Achievement, Quest, Prestige, Statistics, Leaderboard, RefreshToken, SaveAuditLog, DailyRewardClaim)
- [x] Auth backend (register/login/refresh/logout/me JWT + cookie httpOnly rotatif + bcrypt)
- [x] Endpoint `/api/health`, `/api/version`
- [x] Frontend : page login/register + dashboard placeholder + canvas Pixi vide (antialias=false)
- [x] Tests unitaires des helpers critiques (HMAC, JWT, schemas, bigint, api, store) + intégration health
- [x] Tests Vitest des formules d'équilibrage shared (generators, milestones, prestige, offline, migrations)
- [x] Pipeline GitHub Actions : lint + test + build
- [x] README de démarrage avec `make dev` / `make test` / `make build`
- [x] **Intégration Discord** : snippet `/suxa_tondeuse` à coller dans `suxabot.py` (lit le tunnel Cloudflare)

**Métriques PHASE 0** :
- 91 tests passent (55 shared + 32 backend + 4 frontend)
- Bundle frontend gzipped : ~256 KB (cible < 600 KB ✓)
- 75+ fichiers TS/TSX, commentaires en français, variables en anglais
- Build clean : shared + backend + frontend (Vite + tsc -b)

### PHASE 1 — MVP jouable (LIVRÉE ✅)

But : core loop addictive (tondre → gagner → upgrader) sans méta-systèmes.

- [x] Scène PixiJS principale : 1 parcelle 6×6 tiles, herbe 4 stages, robots animés
- [x] Currencies 🪙 / 🌿 avec break_infinity.js + format short scale
- [x] 3 tiers de robots (Cisaille, Pousser, Thermique)
- [x] 1 catégorie d'upgrade (Lames, +5 % / niveau)
- [x] Boucle tick 10 Hz fixed-step + rAF rendering
- [x] Auto-save local (IndexedDB + LZ-string) + sync server 30 s + beacon unload
- [x] HMAC SHA-256 anti-cheat + service de validation soft-flag
- [x] Offline progress (cap 12h)
- [x] HUD : TopBar currency + ShopPanel + tap manuel sur canvas
- [x] Pixel art programmatique (Graphics) — assets externes en PHASE 2
- [x] Modal "Bon retour" avec count-up animé
- [x] Tests Vitest : 117 verts (55 shared + 44 backend + 18 frontend)
- [x] Endpoints `/api/save` (GET, POST, beacon) avec validation Zod

**Métriques PHASE 1** :
- 117 tests passent (gain de +26 vs PHASE 0)
- Bundle frontend gzipped : ~272 KB (+16 KB pour Pixi scene + game logic)
- Coverage anti-cheat backend : 12 tests dédiés (cible 95 %+ atteinte)

### PHASE 2 — v1 méta-systèmes (LIVRÉE base ✅, daily quests à suivre)

- [x] 10 tiers de robots avec déblocage progressif (visible dès qu'on a une unité du précédent)
- [x] 10 parcelles débloquables avec multipliers globaux (stockés en `plotsUnlocked`)
- [x] 6 catégories d'upgrades (Lames, Moteur, Batterie, Solaire, Navigation, Météo)
- [x] Système prestige "Tonte de Printemps" : preview seeds, confirmation double, reset partiel
- [x] 25 achievements automatiques (distance/cash/robots/plots/prestige/login)
- [x] Claim d'achievements avec récompenses (cash/gems)
- [x] Login streak avec détection jour précédent
- [x] Backend leaderboard service + routes + upsert auto à chaque save
- [x] UI : ShopPanel étendu, PlotsPanel, PrestigePanel, AchievementsPanel
- [x] Système d'onglets dans GamePage
- [x] i18n FR/EN pour tous les nouveaux textes
- [x] Daily quests (3 par jour, deterministe sur la date) + daily login rewards (cycle 7 jours avec jackpot)
- [x] DailyPanel UI avec progress bars, claim button, streak display

**Métriques PHASE 2 finale** :
- 154 tests passent (+37 vs PHASE 1)
- Bundle frontend gzipped : ~280 KB (sous les 600 KB GDD)

### PHASE 4 — Invites Discord + auto-update VPS (LIVRÉE ✅)

But : portail d'accès via Discord avec liens 1h + déploiement continu sur VPS.

- [x] Backend `invite.service` : JWT signé scope=`game-invite`, TTL 1h
- [x] Routes `/api/auth/invite/issue` (X-Bot-Key), `/redeem` (cookie httpOnly), `/status`
- [x] Middlewares `requireBotKey` et `requireInvite` (gate sur register/login)
- [x] Frontend hook `useInviteBootstrap` : lit `?invite=xxx`, redeem, nettoie URL
- [x] Page `InviteGatePage` qui dirige vers Discord si pas d'accès
- [x] Snippet `suxa_tondeuse_command.py` qui appelle l'API et renvoie le lien éphémère
- [x] Vars env `DISCORD_BOT_API_KEY` + `PUBLIC_GAME_URL` dans .env.example et docker-compose
- [x] Script `scripts/auto-update.sh` : git fetch + reset + docker compose build si nouveau commit
- [x] Script `scripts/install-auto-update.sh` : configure le crontab (2 min par défaut)
- [x] Documentation `scripts/README.md` et `suxabot/README.md` à jour

**Décisions** :
- Pas de création auto de compte Discord : le lien donne juste l'accès, l'utilisateur s'inscrit/login normalement avec son propre pseudo+password.
- Le cookie `gameInvite` est httpOnly + sameSite lax pour autoriser le redirect Cloudflare.
- L'auto-update est en pull (cron) plutôt que push (webhook GitHub) : pas de port à ouvrir, pas de webhook secret à gérer.
- Refresh tokens existants restent valides après expiration de l'invite (sinon les sessions actives expireraient à 1h).

### PHASE 3 — v2 features avancées (LIVRÉE ✅)

- [x] Système météo dynamique : 6 types (soleil, nuages, pluie, orage, vent, neige) avec multipliers de production
- [x] 4 saisons sur calendrier réel (printemps, été, automne, hiver) avec probabilités météo et boost de production
- [x] Météo + saison déterministes par heure (seedés sur la date) — synchronise client/serveur
- [x] Badge météo dans la TopBar (auto-refresh toutes les minutes)
- [x] 30 pets répartis en 5 raretés (commun, peu commun, rare, épique, légendaire) avec bonus de production cumulés
- [x] Action `rollPet` (drop aléatoire pondéré par rareté) + `togglePetEquip` (max 3 équipés)
- [x] 30 skins cosmétiques avec couleurs primaire/accent
- [x] CollectionPanel UI : équiper pets + activer skins
- [x] StatsPanel UI : 12 stats clés + breakdown par tier
- [x] PWA installable : `manifest.webmanifest` étoffé + service worker (cache-first assets, network-first API)
- [x] SavePayload étendu (rétro-compatible) : pets/skins/login state

**Métriques PHASE 3** :
- 172 tests passent (+18 vs PHASE 2 avec tests weather/pets)
- Bundle frontend gzipped : ~285 KB (toujours < 600 KB)
- Service worker actif uniquement en prod (`import.meta.env.PROD`)

## Principes de travail (issus du workflow)

- **Plan d'abord** : ce fichier doit être à jour AVANT toute implémentation.
- **Aucune paresse** : pas de patchs temporaires, on traite les causes racines.
- **Impact minimal** : on touche uniquement ce qui est nécessaire.
- **Vérification** : aucune tâche cochée sans preuve (test, log, démo).
- **Sous-agents** : déléguer recherche, exploration, analyses parallèles.
- **Élégance équilibrée** : simple > sur-ingénieré.
- **Auto-amélioration** : capturer les leçons dans `leçons.md` après chaque correction utilisateur.

## Décisions architecturales (validées)

- **Commande Discord** : `/suxa_tondeuse` — ouvre une URL via le tunnel Cloudflare partagé du bot (`/tmp/cloudflare_url.txt`).
- **Hébergement** : le frontend nginx + backend Node sont exposés via le tunnel Cloudflare existant. Routes : `/tondeuse/` pour le frontend, `/tondeuse/api/` pour le backend. Le reverse proxy est géré côté Coolify/nginx.
- **Auth** : username + password classique (pas de Discord OAuth). Bcrypt + JWT access (15 min) + refresh token rotatif en cookie httpOnly.
- **Périmètre** : roadmap COMPLÈTE (PHASE 0 → 3) demandée par l'utilisateur, livrée séquentiellement avec commits à chaque jalon.

## Section revue (remplie en fin de chaque phase)

### PHASE 0 — revue

**Livré** : monorepo prêt à l'emploi, `docker compose up` opérationnel, auth fonctionnelle, canvas Pixi placeholder, intégration Discord prête.

**Tests** : 91 passent. Coverage des formules d'équilibrage à 100 % (cible GDD).

**Décisions techniques notables** :
- ESM pur partout (`"type": "module"`, imports `.js` même pour les sources `.ts`)
- Tests Prisma en intégration laissés en mode "tolérant à DB absente" pour la PHASE 0 — en CI on remontera une vraie DB Postgres.
- Le `seed.ts` est sous `prisma/` et exécuté via `tsx` (pas inclus dans le build TS).
- Frontend : pas de référence TS composite vers `shared`, on utilise un alias path uniquement (évite `tsc -b` strict mode incompatible).

**Reste à faire** : avant la PHASE 1, valider sur le VPS que `docker compose up` démarre proprement et que la commande Discord fonctionne avec le tunnel.
