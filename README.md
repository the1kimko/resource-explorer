# Resource Explorer Explorer (React + TypeScript)

A fast, single-page React app for exploring characters from the public **[Rick & Morty API](https://rickandmortyapi.com)**. It supports search, filtering, sorting, pagination, favorites with persistence, a rich detail view, dark/light theme, and resilient UX (loading/error/empty states). URL parameters are the source of truth, so the app is shareable and reload-safe.

---

## ✨ Features

- **List + Detail**
  - Characters list with **pagination** (server) and **client-side sorting** (per page).
  - Character **detail view** at `/characters/:id` (lazy-loaded / code-split).

- **Search, Filter, Sort**
  - **Debounced** search (`?q=`).
  - Filters: **status**, **gender**, **species**, **type**.
  - Sort: **name**, **id**, **status**, **species**, **gender**, **“most episodes”**.
  - UI state is encoded in the **URL** (shareable & reload-safe).

- **Favorites**
  - ⭐ Toggle on list & detail.
  - Persisted in **localStorage**; “Favorites only” **filter** (`?fav=1`).
  - **Optimistic UI** updates via a tiny external store hook.

- **Data fetching & UX**
  - **TanStack Query** cache + background refetch.
  - **Abort** in-flight requests (via `AbortController`) as inputs change.
  - **Skeleton** loaders, **error with retry**, and **useful empty states**.
  - **Scroll restoration** on back/forward (per-URL snapshot).

- **Polish / Nice-to-have**
  - **Dark/Light theme** toggle (persisted, system-aware).
  - **Tooltips**, **Accordion** (collapsible filters), **Tabs** (All/Favorites), **Pagination UI**, **Button** variants using shadcn-style + Radix primitives.
  - **Code splitting** for the detail route.

---

## 🧱 Tech Stack

- **Vite** + **React** + **TypeScript**
- **React Router** for SPA routing
- **@tanstack/react-query** for data fetching, cache, abort handling
- **Tailwind CSS** (+ `tailwind-merge`, `clsx`) for styling
- **Radix UI primitives** (`@radix-ui/react-…`) + **lucide-react** icons
- **class-variance-authority (CVA)** for button variants
- **LocalStorage** + `useSyncExternalStore` for favorites store

---

## 🚀 Getting Started

### 1) Requirements

- **Node**
  - If using **Vite 7**: Node **≥ 20.19** (or **≥ 22.12**).
  - If you’re on Node 18, either upgrade Node (`nvm install 22`), **or** use Vite 5.
- **Package manager**: npm, pnpm, or yarn (examples use npm).

### 2) Install

```bash
npm install
```
If you see EBADENGINE about Node version, upgrade Node (recommended), then reinstall:

```bash
# with nvm
nvm install 20.19.0
nvm use 20.19.0
rm -rf node_modules package-lock.json
npm install
```

### 3) Run in dev
```bash
npm run dev
# open http://localhost:5173
```

### 4) Build & Preview
```bash
npm run build
npm run preview
```

🗂️ Project Structure (key files)
```pgsql
src/
  App.tsx                     # app shell, header, routes
  main.tsx                    # React root, React Query client, BrowserRouter
  index.css                   # Tailwind entry (and global css)
  components/
    CharacterCard.tsx         # card + ⭐ favorite toggle
    SearchBar.tsx             # debounced and URL-bound
    FilterBar.tsx             # status/gender/species/type + favorites toggle
    SortSelect.tsx            # sort dropdown (URL-bound)
    ThemeToggle.tsx           # theme button
    ui/
      button.tsx              # Button component (CVA variants)
      button-variants.ts      # cva() config for Button variants
      pagination.tsx          # Pagination UI
      accordion.tsx           # Accordion wrapper
      tabs.tsx                # Tabs wrapper
      tooltip.tsx             # Tooltip wrapper (+ Provider)
  hooks/
    use-favorites.ts          # localStorage store with useSyncExternalStore
    use-debounce.ts           # small debounce hook
  lib/
    rickmorty.ts              # API client (character list/detail)
    utils.ts                  # cn() helper (clsx + tailwind-merge)
  pages/
    Home.tsx                  # styled landing page
    CharactersList.tsx        # main list page (URL source of truth)
    CharacterDetail.tsx       # character detail (lazy-loaded)
  providers/
    ThemeContext.ts           # Theme context + types
    ThemeProvider.tsx         # Theme provider component (default export)
    useTheme.ts               # Theme hook

```

🔌 Configuration Snippets
### Tailwind CSS
If using Tailwind v3:

`tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```
`postcss.config.js`
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

If using Tailwind v4: Install the new PostCSS plugin and update config
```bash
npm i -D @tailwindcss/postcss autoprefixer
```

`postcss.config.js`
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### CSS Entry (`src/index.css`)

Either style works:

```css
/* v3 style */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* globals */
:root { color-scheme: light dark; }
html, body, #root { height: 100%; }
```

```css
/* v4 style (also OK) */
@import "tailwindcss";
:root { color-scheme: light dark; }
html, body, #root { height: 100%; }

## 🔎 How Things Work

### URL is the Source of Truth

The list UI state is round-tripped through search params:

- `?q=` search (debounced ~400ms)
- `?status=`, `?gender=`, `?species=`, `?type=`
- `?sort=name-asc|name-desc|id-asc|id-desc|status-asc|...|episodes-desc`
- `?fav=1` favorites-only
- `?page=1..N` pagination

Directly visiting a URL reconstructs the UI (shareable & reload-safe). Back/forward navigation is natural. The code uses `useSearchParams()` to read/write state.

### Data Fetching (TanStack Query)

Query keys include the parameters above:
`['characters', { page, q, status, gender, species, type }]`, and `['character', id]`

- **Abort on change**: `useQuery` injects an `AbortSignal`, forwarded to fetch → in-flight requests are canceled when inputs change (no race conditions).
- **Cache / background refetch**: `staleTime` and defaults are tuned for a responsive UI without flicker; previous page results are kept via `placeholderData` during pagination.
- **Status flags**: `isLoading`, `isError`, `isFetching` drive skeletons, retry button, and subtle disabled states.

### Favorites Store

A tiny local store over `localStorage` using `useSyncExternalStore` for React 18/19 correctness.

- Snapshot is kept referentially stable (no infinite loops).
- Optimistic UI: toggling updates immediately, no server call.

### Theme Toggle

Persisted in `localStorage` (`theme:v1`), with system preference fallback and support for an existing `<html class="dark">`.

- Implementation toggles only the `dark` class on `<html>`.
- Debugging logs (opt-in) help verify state transitions.

### Scroll Restoration

On page POP (back/forward), we scroll to the previous Y position saved to `sessionStorage`, keyed by pathname + search. This preserves list position when navigating between list and detail or when using history.

## 🧭 Key Routes

- `/` – Home (hero, links to characters & favorites)
- `/characters` – List (search/filter/sort/pagination/favorites)
- `/characters/:id` – Detail (badges, metadata, episodes count, ⭐)

## 📦 Dependencies

Install these if they aren't already in `package.json`:

```bash
# app core
npm i react react-dom react-router-dom @tanstack/react-query

# ui
npm i tailwind-merge clsx lucide-react
npm i @radix-ui/react-accordion @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-slot
npm i class-variance-authority

# tailwind + postcss
npm i -D tailwindcss postcss autoprefixer
# or for v4:
npm i -D @tailwindcss/postcss autoprefixer
```

## 🧪 Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # serve built app locally
```

(If you add tests later, e.g. Playwright/Cypress, place scripts here.)

## 🔧 Troubleshooting

### "Tooltip must be used within TooltipProvider"
Wrap your app once with `<TooltipProvider>` (in App.tsx).

### "Cannot find module '@radix-ui/react-…'"
Install needed Radix packages:
```bash
npm i @radix-ui/react-accordion @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-slot
```

### Button types ("variant/size" not found)
Ensure `class-variance-authority` is installed, and `ButtonProps` extends the CVA variant types.

### tailwind-merge / clsx / cn helper missing
```bash
npm i tailwind-merge clsx
```
and check `src/lib/utils.ts`.

### Tailwind v4 PostCSS error
Install `@tailwindcss/postcss` and update `postcss.config.js` (see above).

### React types warning: React.ElementRef is deprecated
Use `React.ComponentRef` in UI wrappers (accordion/tabs/tooltip).

### Node engine error (EBADENGINE)
Vite 7 requires Node ≥ 20.19 or ≥ 22.12. Upgrade via `nvm install 22; nvm use 22` or use Vite 5.

## 🧩 Architecture & Trade-offs

- **Client-side sort on current page**: simple and fast. If you need cross-page global sort, do server-side sort or aggregate results (with perf caveats).
- **URL-first state** minimizes component state drift and makes shareable views trivial.
- **TanStack Query** over homegrown fetch logic to get robust cache, retries, abort handling, and status flags out of the box.
- **Local favorites** rather than remote persistence: perfectly fine for a demo; can be swapped for an API later.
- **Virtualization omitted** to keep deps lean; recommended once pages exceed ~100 items (react-window).

## ♿ Accessibility

- Semantic HTML for lists, buttons, nav.
- Focus outlines via Tailwind & button variants.
- Labels for inputs and controls.
- ARIA attributes (e.g., `aria-current` in pagination, `aria-pressed` in favorites).

## 🗺️ API Notes

**Base**: `https://rickandmortyapi.com/api/character`

**Supported query params used here**:
- `page`, `name` (search), `status`, `gender`, `species`, `type`

The API returns 404 when no results match; we normalize to an empty list to show a "No results" UI instead of a hard error.

