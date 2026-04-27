# Intégration bot Discord

Ce dossier contient le snippet à insérer dans le bot Discord existant (`suxabot.py`) pour ajouter la commande `/suxa_tondeuse`.

## Installation

1. Ouvrir `suxabot.py` (le bot principal sur le VPS).
2. S'assurer que `import os` est présent dans les imports du haut.
3. Copier-coller le bloc `@tree.command(name="suxa_tondeuse"...)` de [`suxa_tondeuse_command.py`](suxa_tondeuse_command.py) à côté des autres commandes slash (par exemple après `/suxa_casino`).
4. Relancer le bot.

## Configuration

La commande lit l'URL du tunnel Cloudflare partagé depuis `/tmp/cloudflare_url.txt` (même mécanisme que `/suxa_claude_hq` et `/suxa_casino`). Le frontend ROBOMOW TYCOON doit être servi sur la route `/tondeuse/` derrière le tunnel.

### Routing nginx / Traefik

Côté reverse proxy (nginx ou Traefik dans Coolify), router :

- `<tunnel>/tondeuse/` → frontend (nginx port 80 du conteneur `frontend`)
- `<tunnel>/tondeuse/api/` → backend Express (port 3000 du conteneur `backend`)

Ou, plus simple en local : exposer directement les ports 5173 (frontend dev) et 3000 (backend) et utiliser la variable d'environnement `ROBOMOW_GAME_URL` pour surcharger.

### Variable d'environnement (option dev)

```bash
export ROBOMOW_GAME_URL=http://localhost:5173
```

Si définie, la commande l'utilise au lieu du tunnel Cloudflare.

## Test

Dans Discord, taper `/suxa_tondeuse`. La commande répond en éphémère avec un lien cliquable vers le jeu.
