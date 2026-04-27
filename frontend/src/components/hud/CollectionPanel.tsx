// Panel "Collection" : pets possedes et skins debloques.
// Permet d'equiper / desequiper jusqu'a 3 pets et de changer de skin.

import { useTranslation } from 'react-i18next';
import { PETS, SKINS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';

const RARITY_COLORS: Record<string, string> = {
  common: 'border-robot-shadow',
  uncommon: 'border-grass-base',
  rare: 'border-sky-blue',
  epic: 'border-accent-premium',
  legendary: 'border-accent-gold',
};

export function CollectionPanel() {
  const { t } = useTranslation();
  const petsOwned = useGameStore((s) => s.petsOwned);
  const petsEquipped = useGameStore((s) => s.petsEquipped);
  const togglePetEquip = useGameStore((s) => s.togglePetEquip);
  const skinsOwned = useGameStore((s) => s.skinsOwned);
  const activeSkin = useGameStore((s) => s.activeSkin);
  const setActiveSkin = useGameStore((s) => s.setActiveSkin);

  const ownedPets = PETS.filter((p) => petsOwned.has(p.key));
  const ownedSkins = SKINS.filter((s) => skinsOwned.has(s.key));

  return (
    <aside className="flex w-full max-w-sm flex-col gap-3 panel p-3 max-h-[80vh] overflow-y-auto">
      <h2 className="text-sm font-bold text-ink-base">{t('collection.title')}</h2>

      {/* Pets */}
      <section className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase text-ink-dark">{t('collection.pets')}</h3>
          <span className="text-xs text-ink-dark">
            {petsEquipped.size}/3 {t('collection.equipped')}
          </span>
        </div>
        {ownedPets.length === 0 ? (
          <p className="text-xs text-ink-dark italic">{t('collection.noPets')}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-1">
            {ownedPets.map((pet) => {
              const equipped = petsEquipped.has(pet.key);
              return (
                <li key={pet.key}>
                  <button
                    onClick={() => togglePetEquip(pet.key)}
                    className={`flex flex-col items-center w-full p-2 rounded border-2 transition ${
                      RARITY_COLORS[pet.rarity] ?? 'border-robot-shadow'
                    } ${equipped ? 'bg-grass-shadow text-panel-base' : 'bg-panel-paper'}`}
                  >
                    <span className="text-2xl">{pet.emoji}</span>
                    <span className="text-xs font-bold">{pet.name}</span>
                    <span className="text-xs">
                      +{(pet.productionBonus * 100).toFixed(0)}%
                    </span>
                    {equipped && <span className="text-xs text-grass-base">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Skins */}
      <section className="flex flex-col gap-1">
        <h3 className="text-xs font-bold uppercase text-ink-dark">{t('collection.skins')}</h3>
        <ul className="grid grid-cols-2 gap-1">
          {ownedSkins.map((skin) => {
            const isActive = activeSkin === skin.key;
            return (
              <li key={skin.key}>
                <button
                  onClick={() => setActiveSkin(skin.key)}
                  className={`flex flex-col items-center w-full p-2 rounded border-2 transition ${
                    RARITY_COLORS[skin.rarity] ?? 'border-robot-shadow'
                  } ${isActive ? 'bg-grass-shadow text-panel-base' : 'bg-panel-paper'}`}
                >
                  <div
                    className="w-8 h-8 rounded border border-ink-base"
                    style={{ backgroundColor: `#${skin.primaryColor.toString(16).padStart(6, '0')}` }}
                  />
                  <span className="text-xs font-bold">{skin.name}</span>
                  {isActive && <span className="text-xs text-grass-base">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
