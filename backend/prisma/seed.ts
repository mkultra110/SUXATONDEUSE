// Seed Prisma : remplit la DB avec les definitions statiques
// (upgrades, achievements, quests). Re-executable en idempotent (upsert).
//
// Lance via : npm run prisma:seed (apres prisma migrate).

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.warn('[seed] Demarrage du seed...');

  // ─── Upgrades de base (PHASE 0 : seul "Lames" pour le MVP) ───
  await prisma.upgrade.upsert({
    where: { key: 'blades' },
    create: {
      key: 'blades',
      name: 'Lames',
      description: '+5 % production par niveau',
      category: 'global',
      baseCost: 50n,
      costScaling: 1.15,
      maxLevel: 50,
    },
    update: {},
  });

  // ─── Achievement de bienvenue ───
  await prisma.achievement.upsert({
    where: { key: 'welcome' },
    create: {
      key: 'welcome',
      name: 'Bonjour jardinier !',
      description: 'Premiere connexion au jeu.',
      icon: 'welcome.png',
      rewardCash: 50n,
      rewardGems: 0,
      hidden: false,
    },
    update: {},
  });

  console.warn('[seed] Termine.');
}

main()
  .catch((e) => {
    console.error('[seed] Erreur :', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
