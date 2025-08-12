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


