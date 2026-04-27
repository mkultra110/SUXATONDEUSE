#!/bin/bash
# auto-update.sh — verifie si la branche du jeu a ete mise a jour sur GitHub
# et rebuild la stack Docker si oui. Conçu pour etre run par cron toutes
# les X minutes (recommande : 2-5 min).
#
# Usage : bash auto-update.sh
# Logs : /var/log/robomow-update.log

set -euo pipefail

REPO_DIR="${ROBOMOW_REPO_DIR:-/root/robomow}"
BRANCH="${ROBOMOW_BRANCH:-claude/greeting-setup-T7UTD}"
LOG_FILE="${ROBOMOW_LOG:-/var/log/robomow-update.log}"
LOCK_FILE="/tmp/robomow-update.lock"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

# Empeche les executions concurrentes (cron qui se chevauche).
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  log "Lock pris, sortie."
  exit 0
fi

if [ ! -d "$REPO_DIR/.git" ]; then
  log "ERREUR: $REPO_DIR n'est pas un repo git."
  exit 1
fi

cd "$REPO_DIR"

# Recupere les dernieres refs sans merger.
git fetch origin "$BRANCH" --quiet 2>>"$LOG_FILE"

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
  # Rien a faire, sortie silencieuse.
  exit 0
fi

log "Nouvelle version detectee : $LOCAL -> $REMOTE"

# Reset hard sur la version distante (on ne garde aucun changement local).
git reset --hard "origin/$BRANCH" 2>>"$LOG_FILE"
log "Reset sur $REMOTE termine."

# Rebuild + redemarre les services.
log "Rebuild Docker en cours..."
if docker compose up -d --build 2>>"$LOG_FILE"; then
  log "Stack mise a jour avec succes."
else
  log "ERREUR pendant le rebuild Docker."
  exit 1
fi

# Petit healthcheck pour confirmer que le backend repond.
sleep 8
if curl -fsS "http://localhost:${ROBOMOW_BACKEND_PORT:-3100}/api/health" >/dev/null 2>&1; then
  log "Backend healthy apres rebuild."
else
  log "AVERTISSEMENT : le backend ne repond pas apres rebuild."
fi
