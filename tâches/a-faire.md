# ROBOMOW TYCOON — Plan de développement

## Contexte

Projet : jeu web 2D idle/tycoon avec robots tondeuses.
Stack : React 19 + PixiJS v8 + Node 22 + Express + Prisma 6 + PostgreSQL 16 + Docker.
Branche de dev : `claude/greeting-setup-T7UTD`.
Intégration finale : commande slash `/suxa_robomow` (ou équivalent) sur le bot Discord existant, qui retourne un lien vers le jeu via le tunnel Cloudflare déjà en place (`/tmp/cloudflare_url.txt`).

## Stratégie de phasage

Le GDD est massif (plusieurs semaines de dev pour la v3). On suit la roadmap section 14 du GDD à la lettre, **une phase à la fois**, avec validation utilisateur à chaque jalon.

### PHASE 0 — Bootstrap (livrable immédiat)

But : monorepo fonctionnel, jeu lançable en local via `docker compose up`.

- [ ] Structure monorepo npm workspaces (frontend, backend, shared)
- [ ] TypeScript strict, ESLint, Prettier, .gitignore, .dockerignore
- [ ] `docker-compose.yml` dev local (postgres + adminer + backend + frontend)
- [ ] Dockerfile prod backend + frontend (multi-stage)
- [ ] `docker-compose.prod.yml` pour Coolify
- [ ] Schéma Prisma minimal (User, GameSave, RefreshToken)
- [ ] Auth backend (register/login/refresh JWT + cookie httpOnly)
- [ ] Endpoint `/api/health`, `/api/version`
- [ ] Frontend : page login + dashboard placeholder + canvas Pixi vide
- [ ] Tests unitaires des helpers critiques (HMAC, JWT)
- [ ] Pipeline GitHub Actions : lint + test + build
- [ ] README de démarrage avec `make dev` / `make test` / `make build`
- [ ] **Intégration Discord** : commande `/suxa_robomow` ajoutée à `suxabot.py` qui sert le frontend via le tunnel Cloudflare

Critère de validation : `docker compose up` démarre tout sans erreur, login flow fonctionne, `/api/health` retourne 200, la commande Discord ouvre une page jouable.

### PHASE 1 — MVP jouable (après validation PHASE 0)

But : core loop addictive (tondre → gagner → upgrader) sans méta-systèmes.

- [ ] Scène PixiJS principale : 1 parcelle, 1 robot animé, herbe 4 stages
- [ ] Currencies 🪙 / 🌿 avec break_infinity.js
- [ ] 3 tiers de robots (Cisaille, Pousser, Thermique)
- [ ] 1 catégorie d'upgrade (Lames)
- [ ] Boucle tick 10 Hz fixed-step + rAF rendering
- [ ] Auto-save local (IndexedDB) + sync server 30 s
- [ ] HMAC anti-cheat baseline + service de validation
- [ ] Offline progress simple (cap 12h, 100 %)
- [ ] HUD minimal : top bar currency, side panel shop, tap manuel
- [ ] Pixel art Kenney.nl placeholder
- [ ] Modal "Bon retour" avec gains offline
- [ ] Tests Vitest sur formules économiques (coverage 100 %)

### PHASE 2 — v1 méta-systèmes

10 tiers robots, 5 parcelles, 6 catégories upgrades, prestige + arbre talents,
30 achievements, daily quests/login, leaderboard, animations complètes,
i18n FR/EN, sons.

### PHASE 3 — v2 features avancées

10 parcelles, 50 achievements, météo, saisons, weekly events, pets, skins,
méta-prestige, PWA, push notifications.

## Principes de travail (issus du workflow)

- **Plan d'abord** : ce fichier doit être à jour AVANT toute implémentation.
- **Aucune paresse** : pas de patchs temporaires, on traite les causes racines.
- **Impact minimal** : on touche uniquement ce qui est nécessaire.
- **Vérification** : aucune tâche cochée sans preuve (test, log, démo).
- **Sous-agents** : déléguer recherche, exploration, analyses parallèles.
- **Élégance équilibrée** : simple > sur-ingénieré.
- **Auto-amélioration** : capturer les leçons dans `leçons.md` après chaque correction utilisateur.

## Décisions architecturales en suspens

- **Hébergement actuel du jeu vs VPS définitif** : pour le MVP, on lance via le tunnel Cloudflare existant du bot (port à définir, ex: 5173 dev / 80 prod via nginx), partage le même tunnel que `claude_web` et `casino`. À confirmer avec l'utilisateur.
- **Nom de la commande Discord** : `/suxa_robomow` proposé, à confirmer.
- **Auth jeu = compte Discord OAuth ou email/password classique** : MVP propose les deux (login email + bouton "Se connecter avec Discord" en v1).

## Section revue (remplie en fin de chaque phase)

À remplir après chaque jalon validé.
