#!/bin/bash
# install-auto-update.sh — configure le cron pour faire tourner auto-update.sh
# toutes les 2 minutes. A executer une fois sur le VPS apres le clone initial.
#
# Usage : bash scripts/install-auto-update.sh

set -euo pipefail

REPO_DIR="${ROBOMOW_REPO_DIR:-/root/robomow}"
SCRIPT_PATH="$REPO_DIR/scripts/auto-update.sh"
LOG_FILE="/var/log/robomow-update.log"
INTERVAL="${ROBOMOW_INTERVAL_MIN:-2}"

if [ ! -f "$SCRIPT_PATH" ]; then
  echo "ERREUR : $SCRIPT_PATH introuvable. Verifie ROBOMOW_REPO_DIR."
  exit 1
fi

# Rend le script executable.
chmod +x "$SCRIPT_PATH"

# Cree le fichier de log avec les bonnes permissions.
touch "$LOG_FILE"
chmod 644 "$LOG_FILE"

# Ecrit la ligne cron (idempotent : on cherche si elle existe deja).
CRON_LINE="*/$INTERVAL * * * * /bin/bash $SCRIPT_PATH"
TMP_CRON=$(mktemp)
crontab -l 2>/dev/null | grep -v "auto-update.sh" > "$TMP_CRON" || true
echo "$CRON_LINE" >> "$TMP_CRON"
crontab "$TMP_CRON"
rm "$TMP_CRON"

echo "Cron configure : auto-update toutes les $INTERVAL minutes."
echo "Logs : $LOG_FILE"
echo "Voir le crontab : crontab -l"
echo "Run manuel : bash $SCRIPT_PATH"
