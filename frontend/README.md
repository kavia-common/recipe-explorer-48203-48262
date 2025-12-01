# Recipe Explorer Frontend (React)

This frontend is a lightweight React app for browsing, searching, and viewing recipes. It uses an **Ocean Professional** visual theme and is designed to be backend-ready while working fully with local placeholder data.

## Tech Stack

- React 18 + `react-scripts`
- Vanilla CSS (no UI framework)
- Hash-based client-side routing (no extra router dependency)

## Getting Started

From the `frontend` directory:

```bash
npm install
npm start
```

This runs the app in development mode.

- App URL: http://localhost:3000
- The app uses hash-based routes:
  - `#/` – recipe list
  - `#/recipe/:id` – recipe detail (e.g. `#/recipe/1`)

## Features

- Top navigation with app title and search
- Sidebar categories (Breakfast, Lunch, Dinner, Dessert, Vegan, Quick & Easy, All)
- Recipe list with:
  - Responsive grid
  - Client-side **search** (by title and tags)
  - Category **filters**
- Recipe detail view with:
  - Hero image
  - Metadata (category, cook time)
  - Ingredients list
  - Step-by-step instructions
- Ocean Professional theme:
  - Primary `#2563EB`
  - Secondary `#F59E0B`
  - Error `#EF4444`
  - Background `#f9fafb`
  - Surface `#ffffff`
  - Text `#111827`

## Data & Routing

All recipes are stored locally in:

- `src/data/recipes.js`

The app uses **hash routing** to avoid adding new dependencies:

- `#/` shows the recipe list
- `#/recipe/:id` shows the recipe detail for the given `id`

This keeps the preview working without a backend.

## Environment Variables

Environment variables are accessed via `process.env` for future backend integration. Currently, the UI uses **only placeholder data**, but the following variables are wired for future use:

- `REACT_APP_API_BASE`
- `REACT_APP_BACKEND_URL`
- `REACT_APP_FRONTEND_URL`
- `REACT_APP_WS_URL`
- `REACT_APP_NODE_ENV`
- `REACT_APP_NEXT_TELEMETRY_DISABLED`
- `REACT_APP_ENABLE_SOURCE_MAPS`
- `REACT_APP_PORT`
- `REACT_APP_TRUST_PROXY`
- `REACT_APP_LOG_LEVEL`
- `REACT_APP_HEALTHCHECK_PATH`
- `REACT_APP_FEATURE_FLAGS`
- `REACT_APP_EXPERIMENTS_ENABLED`

The helper `getApiBase` in `src/App.js` exposes `REACT_APP_API_BASE`:

```js
import { getApiBase } from './App';

const apiBase = getApiBase(); // null if not configured
```

If `REACT_APP_API_BASE` is not set, the footer explicitly shows that the app is using local placeholder data.

> **Note:** Environment variables should be set in an `.env` file at the project root and must be prefixed with `REACT_APP_` to be visible in the browser environment.

## Theming

Theme tokens are defined in:

- `src/App.css` — CSS variables and component styling
- `src/theme.js` — small helper with theme colors for JS

You can import and use the theme object:

```js
import { getTheme } from './theme';

const theme = getTheme();
console.log(theme.primary); // "#2563EB"
```

## Testing Hooks

The app provides `data-testid` attributes for easier testing:

- Search input: `data-testid="search-input"`
- Category filters: `data-testid="category-<Name>"` (e.g. `category-Breakfast`)
- Recipe cards: `data-testid="recipe-card-<id>"`
- Recipe detail title: `data-testid="recipe-detail-title"`

Standard CRA testing setup is available via:

```bash
npm test
```

## Notes

- The app runs on **port 3000** via `react-scripts start`.
- All data is currently in-memory; wiring to a real backend should use the configured `REACT_APP_*` variables.
- Routing is intentionally implemented using the URL hash to keep the dependency footprint small.
