// Prepare le monorepo apres `npm install` : build le package `shared` (dont
// dependent backend et frontend via ./dist) et genere le client Prisma.
//
// Ce script est volontairement defensif : dans les etages Docker `deps`, seul
// les package.json sont copies (pas les sources ni le schema Prisma). On
// no-op alors silencieusement pour ne pas casser les builds d'images.
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const has = (p) => existsSync(join(root, p));

function run(label, cmd) {
  process.stdout.write(`[postinstall] ${label}…\n`);
  execSync(cmd, { cwd: root, stdio: 'inherit' });
}

try {
  // Le build de shared a besoin des sources ET de tsc (devDep).
  if (has('shared/src/index.ts') && has('node_modules/typescript')) {
    run('build @robomow/shared', 'npm run build --workspace=@robomow/shared');
  }
  // La generation Prisma a besoin du schema ET du CLI prisma (devDep backend).
  if (has('backend/prisma/schema.prisma') && has('node_modules/prisma')) {
    run('prisma generate', 'npm run prisma:generate --workspace=@robomow/backend');
  }
} catch (err) {
  // On n'echoue jamais l'install : un setup partiel reste rattrapable via
  // `npm run setup`. On signale simplement le souci.
  process.stderr.write(
    `[postinstall] preparation incomplete: ${err.message}\n` +
      '[postinstall] lance `npm run setup` manuellement si besoin.\n',
  );
}
