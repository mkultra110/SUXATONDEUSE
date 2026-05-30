# ROBOMOW TYCOON

> Jeu web 2D idle/tycoon où le joueur bâtit un empire de robots tondeuses,
> du jardin résidentiel jusqu'à la tonte de continents entiers.

**Stack** : React 19 + PixiJS v8 + Node.js 22 + Express + Prisma 6 + PostgreSQL 16 + Docker.

## État du projet

PHASE 0 — Bootstrap. Voir [`tâches/a-faire.md`](tâches/a-faire.md) pour la roadmap complète.

## Démarrage rapide (dev local)

Prérequis : Docker + Docker Compose v2, Node 22 et npm 10+ pour les opérations hors container.

```bash
# 1. Cloner le repo
git clone https://github.com/mkultra110/suxatondeuse.git
cd suxatondeuse

# 2. Copier l'exemple d'env (optionnel : docker-compose.yml a déjà des défauts dev)
cp .env.example .env

# 3. Lancer la stack complète
make dev
# Equivalent : docker compose up
```

Une fois démarré :

- Frontend : <http://localhost:5173>
- Backend API : <http://localhost:3000/api/health>
- Adminer (DB) : <http://localhost:8080> (système : PostgreSQL, serveur : `postgres`, user/pass : `game`/`gamepass`, base : `robomow`)

## Développement hors Docker (npm)

Pour lancer les vérifications (types, lint, tests) sans la stack Docker :

```bash
npm install        # Installe + prépare automatiquement (build shared + génère le client Prisma)
npm run setup      # (au besoin) refait manuellement la préparation : build shared + prisma generate
npm run typecheck  # Vérifie les types des 3 workspaces
npm run lint       # ESLint (config racine + règles React pour le frontend)
npm run test       # Tous les tests (shared + backend + frontend)
npm run build      # Build des 3 workspaces
```

> `npm install` déclenche un `postinstall` qui build le package `shared` (dont
> dépendent backend et frontend via `./dist`) et génère le client Prisma. Ce
> hook est sans effet dans les étages Docker `deps` (sources absentes).

## Commandes utiles

```bash
make help          # Liste toutes les commandes
make dev           # Démarre la stack (postgres + backend + frontend + adminer)
make dev-down      # Arrête
make dev-clean     # Arrête + supprime volumes (reset DB)
make build         # Build tous les workspaces
make test          # Lance tous les tests
make lint          # Lint
make typecheck     # Vérifie les types
make format        # Formate avec Prettier
make db-reset      # Reset migrations + reseed
make db-studio     # Ouvre Prisma Studio
make logs          # Suit les logs backend
```

## Structure

```
suxatondeuse/
├── shared/         # Types + constantes + formules d'équilibrage (TS)
├── backend/        # API REST Express + Prisma + auth JWT
├── frontend/       # SPA React 19 + PixiJS v8 + Tailwind
├── tâches/         # Plan et leçons (workflow)
├── suxabot/        # Bot Discord existant (commande /suxa_tondeuse y est ajoutée)
├── docker-compose.yml          # Dev local
├── docker-compose.prod.yml     # Coolify
└── .github/workflows/ci.yml    # CI lint + test + build
```

## Tests

```bash
npm run test                          # Tous les workspaces
npm run test --workspace=@robomow/shared
npm run test --workspace=@robomow/backend
npm run test --workspace=@robomow/frontend

# Coverage backend
cd backend && npm run test:coverage
```

Cibles de coverage (cf. GDD section 13.1) :

- Services backend : 80 %+
- Anti-cheat : 95 %+
- Formules économiques : 100 %

## Déploiement (Coolify)

Voir GDD section 12.8. Résumé :

1. Provisioner un VPS (Hetzner CX22 ~5 €/mois recommandé).
2. Installer Coolify : `curl -fsSL https://cdn.coolify.io/coolify/install.sh | sudo bash`.
3. Créer une ressource PostgreSQL 16 dans Coolify.
4. Créer un projet pointant `docker-compose.prod.yml`.
5. Définir les variables d'environnement listées dans `.env.example`.
6. Configurer les domaines `api.tondeuse.app` et `play.tondeuse.app`.

## Intégration Discord

La commande `/suxa_tondeuse` du bot existant ouvre le jeu via le tunnel Cloudflare partagé du bot. Voir [`suxabot/suxa_tondeuse_command.py`](suxabot/suxa_tondeuse_command.py) pour le snippet à coller dans le bot principal.

## Conventions

- Commentaires en **français**.
- Variables et fonctions en **anglais**.
- TypeScript **strict** partout.
- Currencies : `BigInt` côté serveur, `break_infinity.js` côté client.
- Validation **Zod** systématique avant écriture DB.
- Commits atomiques en français : `feat(prestige): ajoute formule de calcul des graines`.

## Licence

Propriétaire. Voir mkultra110.
