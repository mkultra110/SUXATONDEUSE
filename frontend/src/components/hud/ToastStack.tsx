// ToastStack : systeme de notifications non-bloquantes (research idee #22).
// Stack de toasts en bas qui auto-dismiss 2.5s. API : useToast().push().

import { create } from 'zustand';
import { useEffect } from 'react';

type ToastKind = 'info' | 'success' | 'gold' | 'warning';

interface Toast {
  id: number;
  text: string;
  kind: ToastKind;
  expiresAt: number;
}

interface ToastState {
  toasts: ReadonlyArray<Toast>;
  push: (text: string, kind?: ToastKind, durationMs?: number) => void;
  remove: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (text, kind = 'info', durationMs = 2500) => {
    const id = nextId++;
    const expiresAt = Date.now() + durationMs;
    set((s) => ({ toasts: [...s.toasts, { id, text, kind, expiresAt }] }));
  },
  remove: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

const KIND_COLOR: Record<ToastKind, string> = {
  info: 'var(--color-water-3)',
  success: 'var(--color-grass-5)',
  gold: 'var(--color-accent-gold)',
  warning: 'var(--color-accent-red)',
};

export function ToastStack() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    if (toasts.length === 0) return;
    const t = setInterval(() => {
      const now = Date.now();
      for (const toast of toasts) {
        if (toast.expiresAt < now) remove(toast.id);
      }
    }, 250);
    return () => clearInterval(t);
  }, [toasts, remove]);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1550,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'center',
        maxWidth: '90vw',
      }}
    >
      {toasts.slice(-3).map((t) => (
        <div
          key={t.id}
          style={{
            background: 'var(--k-cream, #FFF8DC)',
            border: `3px solid var(--k-ink, #1A1A2E)`,
            borderLeftColor: KIND_COLOR[t.kind],
            borderLeftWidth: 6,
            color: 'var(--k-ink, #1A1A2E)',
            padding: '8px 14px',
            fontFamily: 'Patrick Hand, cursive',
            fontSize: 16,
            letterSpacing: '0.02em',
            boxShadow: `4px 4px 0 var(--k-ink, #1A1A2E)`,
            animation: 'toast-slide-up 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
