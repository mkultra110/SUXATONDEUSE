# Leçons apprises — ROBOMOW TYCOON

> Ce fichier capture les corrections utilisateur et les règles auto-imposées pour ne pas refaire les mêmes erreurs.
> À relire au début de chaque session.

## Règles globales (issues du GDD et du workflow)

- Tous les commentaires de code en **français**.
- Variables et fonctions en **anglais** (convention internationale).
- TypeScript **strict** partout (frontend + backend + shared).
- Currencies en **BigInt** côté serveur, `break_infinity.js` côté client.
- Validation **Zod** systématique avant toute écriture DB.
- PixiJS : `antialias: false`, `scaleMode: nearest`, `roundPixels: true`.
- `setInterval` **interdit** pour le tick → `requestAnimationFrame` + delta.
- Timestamps : **toujours** `Date.now()` serveur, jamais le client.
- Anti-cheat : **soft-flag** avec `suspicionScore`, jamais ban automatique.
- Externaliser tous les textes UI dans `locales/fr.json` dès le départ.
- Centraliser coûts/multiplicateurs dans `shared/balance/`.
- Commits atomiques en français : `feat(prestige): ajoute formule de calcul des graines`.

## Leçons spécifiques au projet

(à remplir au fur et à mesure)
