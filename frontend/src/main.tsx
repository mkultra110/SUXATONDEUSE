// Point d'entree React.
// Initialise i18next avant tout rendu pour eviter le flash de cles non traduites.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './i18n.js';
import { App } from './App.js';
import './styles/index.css';
import './styles/kawaii-skin.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

// Eruda mobile console : active si ?debug=1 dans l'URL.
// Ajoute un bouton flottant qui ouvre une console + log + network panel
// directement dans la page (utile sur iOS Safari ou la console est inaccessible).
const debugParam = new URLSearchParams(window.location.search).get('debug');
if (debugParam === '1' && !document.getElementById('eruda-script')) {
  const script = document.createElement('script');
  script.id = 'eruda-script';
  script.src = 'https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js';
  script.onload = () => {
    const w = window as unknown as { eruda?: { init: () => void } };
    w.eruda?.init();
  };
  document.head.appendChild(script);
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Element #root introuvable');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </I18nextProvider>
  </React.StrictMode>,
);

// Enregistrement du service worker pour la PWA (uniquement en prod)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // Pas critique : le jeu fonctionne sans SW.
    });
  });
}
