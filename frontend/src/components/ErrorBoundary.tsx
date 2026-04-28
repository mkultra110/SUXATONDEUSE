// ErrorBoundary React generique : intercepte les erreurs des composants
// enfants et affiche un fallback au lieu de crasher toute l'app.

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log en console pour le debugging (visible dans devtools).
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] caught:', error, info);
    this.props.onError?.(error, info);
  }

  override render(): ReactNode {
    if (this.state.error) {
      const { fallback } = this.props;
      return typeof fallback === 'function' ? fallback(this.state.error) : fallback;
    }
    return this.props.children;
  }
}
