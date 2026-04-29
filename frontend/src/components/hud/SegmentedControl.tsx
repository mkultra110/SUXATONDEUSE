// SegmentedControl Stardew-style : N onglets bois cote-a-cote, l'actif
// est 'enfonce' (inset shadow), l'inactif 'sorti' (outset shadow).
// Utilise comme sub-tabs dans Boutique (Robots/Ameliorations) et
// dans ProgresPanel (Prestige/Succes/Stats).

interface SegmentOption<T extends string> {
  key: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{
        display: 'flex',
        gap: 4,
        padding: 3,
        background: 'var(--color-wood-4)',
        border: '2px solid var(--color-wood-5)',
        boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.25)',
      }}
    >
      {options.map((option) => {
        const isActive = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.key)}
            style={{
              flex: 1,
              minHeight: size === 'sm' ? 32 : 40,
              padding: size === 'sm' ? '4px 8px' : '6px 12px',
              border: 'none',
              borderRadius: 0,
              cursor: 'pointer',
              fontFamily: 'var(--font-title)',
              fontSize: size === 'sm' ? 11 : 13,
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: isActive ? 'var(--color-text-title)' : 'var(--color-paper-2)',
              background: isActive ? 'var(--color-paper-1)' : 'transparent',
              boxShadow: isActive
                ? 'inset 0 -2px 0 var(--color-wood-3), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                : 'inset 0 1px 0 var(--color-wood-3), 0 1px 0 rgba(0, 0, 0, 0.3)',
              transition: 'all 100ms ease-out',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
