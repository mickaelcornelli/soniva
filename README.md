# Soniva

> Découvre la musique autrement.

Application web de découverte et de streaming musical **100 % gratuite**, construite avec Next.js et l'API publique [Audius](https://audius.co).

## Stack

| Domaine             | Outil                                            |
| ------------------- | ------------------------------------------------ |
| Framework           | Next.js (App Router) · React · TypeScript strict |
| Styles              | Tailwind CSS v4                                  |
| Données musicales   | Audius API                                       |
| Données utilisateur | Supabase (plan gratuit) — à venir                |
| État du lecteur     | Zustand                                          |
| Données distantes   | TanStack Query — à venir                         |
| Validation          | Zod                                              |
| Icônes              | Lucide                                           |
| Tests               | Vitest · Testing Library · Playwright (à venir)  |
| Qualité             | ESLint · Prettier · GitHub Actions               |

Les dépendances sont ajoutées au moment où une fonctionnalité en a besoin, pas avant.

## Démarrer

Prérequis : Node.js ≥ 20.9 et pnpm.

```bash
pnpm install
cp .env.example .env.local   # puis renseigner AUDIUS_API_KEY
pnpm dev
```

La clé Audius est gratuite (plan Free : 10 req/s, 500 000 req/mois) : https://api.audius.co/plans

Ouvre http://localhost:3000.

## Scripts

| Commande         | Rôle                                        |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Serveur de développement                    |
| `pnpm build`     | Build de production                         |
| `pnpm lint`      | ESLint                                      |
| `pnpm format`    | Formate tout le code avec Prettier          |
| `pnpm typecheck` | Vérification TypeScript                     |
| `pnpm test`      | Tests unitaires (Vitest)                    |
| `pnpm check`     | Lint + format + types + tests (comme la CI) |

## Architecture

```
src/
├── app/          # Routes Next.js (pages, layouts, metadata)
├── components/   # Composants UI réutilisables, sans logique métier
├── features/     # Modules métier (player, search, library…) : composants + hooks + logique
├── services/     # Accès aux APIs externes (provider musical interchangeable, Supabase)
├── stores/       # État global (Zustand)
├── lib/          # Utilitaires purs et testés
├── types/        # Types partagés du domaine
└── config/       # Configuration du site
```

Principes : séparation UI / logique / services / état, provider musical derrière une interface pour pouvoir remplacer Audius, aucune donnée musicale stockée côté Soniva.
