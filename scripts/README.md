# Scripts d'administration ROBOMOW TYCOON

## auto-update.sh

Script de polling qui :
1. Fait `git fetch` sur le repo
2. Compare le commit local et remote
3. Si différents : `git reset --hard` + `docker compose up -d --build`
4. Healthcheck du backend après rebuild

Pas de webhook GitHub à configurer, pas de port à ouvrir : tout est en pull.

## install-auto-update.sh

Configure le cron pour exécuter `auto-update.sh` toutes les 2 minutes.

### Installation sur le VPS

```bash
cd /root/robomow
bash scripts/install-auto-update.sh
```

Vérifier :

```bash
crontab -l
# Doit afficher : */2 * * * * /bin/bash /root/robomow/scripts/auto-update.sh

tail -f /var/log/robomow-update.log
# Vide au début, se remplira lors du prochain push
```

### Variables d'environnement (optionnelles)

- `ROBOMOW_REPO_DIR` (défaut : `/root/robomow`)
- `ROBOMOW_BRANCH` (défaut : `claude/greeting-setup-T7UTD`)
- `ROBOMOW_LOG` (défaut : `/var/log/robomow-update.log`)
- `ROBOMOW_INTERVAL_MIN` (défaut : `2` minutes pour le cron)
- `ROBOMOW_BACKEND_PORT` (défaut : `3100` pour le healthcheck)

Pour changer la branche surveillée :

```bash
ROBOMOW_BRANCH=main bash scripts/install-auto-update.sh
```

### Désactiver

```bash
crontab -l | grep -v auto-update.sh | crontab -
```

### Test manuel

```bash
bash /root/robomow/scripts/auto-update.sh
cat /var/log/robomow-update.log
```

## Workflow complet

1. Tu push sur GitHub (depuis ton PC ou via Claude Code)
2. Dans les 2 minutes, le cron du VPS détecte le nouveau commit
3. `auto-update.sh` reset le repo, rebuild Docker, redémarre la stack
4. Healthcheck pour confirmer que le backend repond
5. Le frontend est automatiquement à jour à la prochaine ouverture du navigateur
