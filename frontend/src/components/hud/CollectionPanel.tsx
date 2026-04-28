// Panel collection : grid 2-col panel-9 cards pour pets et skins
// avec bordure rarete (couleur differente par tier).

import { useTranslation } from 'react-i18next';
import { PETS, SKINS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { NavCollectionIcon, HeartIcon } from '../icons/PixelIcon.js';

const RARITY_BORDER: Record<string, string> = {
  common: 'var(--color-wood-5)',
  uncommon: 'var(--color-grass-5)',
  rare: 'var(--color-water-3)',
  epic: 'var(--color-accent-purple)',
  legendary: 'var(--color-accent-gold)',
};
const RARITY_GLOW: Record<string, string> = {
  legendary: '0 0 12px rgba(245, 196, 67, 0.6)',
  epic: '0 0 10px rgba(155, 109, 196, 0.5)',
  rare: '0 0 8px rgba(74, 150, 168, 0.4)',
  uncommon: '',
  common: '',
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
    <aside className="flex flex-col gap-3 max-h-[80vh]">
      <header className="flex items-center justify-between gap-2 px-1">
        <h2
          className="flex items-center gap-2 text-lg leading-none"
          style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)' }}
        >
          <NavCollectionIcon size={22} />
          {t('collection.title')}
        </h2>
        <span
          className="numeric"
          style={{
            background: 'var(--color-wood-5)',
            color: 'var(--color-accent-pink)',
            padding: '3px 8px',
            border: '2px solid var(--color-wood-4)',
            borderRadius: 3,
            fontFamily: 'var(--font-button)',
            fontSize: 11,
            letterSpacing: '0.05em',
          }}
        >
          {petsEquipped.size}/3
        </span>
      </header>

      <div className="overflow-y-auto pr-1 flex flex-col gap-3" style={{ maxHeight: 'calc(80vh - 60px)' }}>
        {/* Pets */}
        <section>
          <h3
            style={{
              fontFamily: 'var(--font-button)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 6,
            }}
          >
            {t('collection.pets')}
          </h3>
          {ownedPets.length === 0 ? (
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              {t('collection.noPets')}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {ownedPets.map((pet) => {
                const equipped = petsEquipped.has(pet.key);
                return (
                  <button
                    key={pet.key}
                    type="button"
                    onClick={() => togglePetEquip(pet.key)}
                    className="panel-9"
                    style={{
                      padding: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      border: `2px solid ${RARITY_BORDER[pet.rarity] ?? 'var(--color-wood-5)'}`,
                      boxShadow: `${RARITY_GLOW[pet.rarity] ?? ''}`,
                      background: equipped ? 'var(--color-grass-4)' : undefined,
                      color: equipped ? 'var(--color-paper-1)' : undefined,
                    }}
                  >
                    <span className="nail-bl" />
                    <span className="nail-br" />
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background: 'var(--color-paper-2)',
                        border: '2px solid var(--color-wood-5)',
                        borderRadius: 4,
                        fontSize: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'inset 0 -2px 0 var(--color-wood-3)',
                      }}
                    >
                      <span style={{ filter: 'grayscale(0)' }}>{pet.emoji}</span>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: equipped ? 'var(--color-paper-1)' : 'var(--color-text-title)',
                        textAlign: 'center',
                        lineHeight: 1.1,
                      }}
                    >
                      {pet.name}
                    </span>
                    <span
                      className="numeric"
                      style={{
                        fontSize: 11,
                        color: equipped ? 'var(--color-paper-1)' : 'var(--color-grass-6)',
                        fontWeight: 700,
                      }}
                    >
                      +{(pet.productionBonus * 100).toFixed(0)}%
                    </span>
                    {equipped && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <HeartIcon size={11} />
                        <span style={{ fontFamily: 'var(--font-button)', fontSize: 9, letterSpacing: '0.1em' }}>EQUIP</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Skins */}
        <section>
          <h3
            style={{
              fontFamily: 'var(--font-button)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 6,
            }}
          >
            {t('collection.skins')}
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {ownedSkins.map((skin) => {
              const isActive = activeSkin === skin.key;
              return (
                <button
                  key={skin.key}
                  type="button"
                  onClick={() => setActiveSkin(skin.key)}
                  className="panel-9"
                  style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    border: `2px solid ${RARITY_BORDER[skin.rarity] ?? 'var(--color-wood-5)'}`,
                    boxShadow: `${RARITY_GLOW[skin.rarity] ?? ''}`,
                    background: isActive ? 'var(--color-grass-4)' : undefined,
                    color: isActive ? 'var(--color-paper-1)' : undefined,
                  }}
                >
                  <span className="nail-bl" />
                  <span className="nail-br" />
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: `#${skin.primaryColor.toString(16).padStart(6, '0')}`,
                      border: '2px solid var(--color-wood-5)',
                      borderRadius: 4,
                      boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: isActive ? 'var(--color-paper-1)' : 'var(--color-text-title)',
                      textAlign: 'center',
                      lineHeight: 1.1,
                    }}
                  >
                    {skin.name}
                  </span>
                  {isActive && (
                    <span
                      style={{
                        fontFamily: 'var(--font-button)',
                        fontSize: 9,
                        letterSpacing: '0.1em',
                      }}
                    >
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
