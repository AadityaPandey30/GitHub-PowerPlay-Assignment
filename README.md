# GitHub Bookmarker (Micro-app)

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Lint (must pass with zero warnings/errors):

```bash
npm run lint
```

4. Build:

```bash
npm run build
```

## Key decisions & trade-offs

- **State management**: Built-in React `useState` + `useEffect` and a tiny `useLocalStorage` hook are used. This keeps the app simple and avoids introducing external libraries for a micro-app. If the app grows, migrating to `useReducer` with Context for cross-cutting concerns would be the next step.

- **Debouncing**: `useDebouncedValue` hook (timing: 350ms) to reduce API calls and improve UX. Implemented at input → debounced value boundary so UI remains responsive.

- **Bookmarks**: Stored only the bookmarked repo IDs in `localStorage` (`bookmarked_repo_ids`) to keep storage small and allow refreshing repo list without duplicating repo objects. When showing bookmarked-only results, the app filters the currently loaded results by saved IDs. (Alternative: persist whole repo objects — trade-off: larger storage, but offline availability.)

- **Performance**: Components memoized with `React.memo`, event handlers created with `useCallback`, derived structures (`Set`) with `useMemo` to keep lookups cheap.

## Next improvements

- Persist full repo objects to allow browsing bookmarks without a prior search.
- Add pagination and sorting options (stars, recently updated).
- Add authentication with GitHub to raise API rate limits.
- Add tests (Jest + React Testing Library) and CI linting.

## Deployment

Deploy to Netlify by connecting the GitHub repo and using the standard `npm run build` step. The app is static and requires no server-side code.

## How debouncing, bookmarking & state management are handled (short)

- Debouncing: `useDebouncedValue` hook delays the query used to call the GitHub API by 350ms after the user stops typing.
- Bookmarking: `useLocalStorage` hook reads/writes an array of bookmarked repo IDs; toggling updates this array and persists to `localStorage`.
- State management: Local component state (useState/useEffect) plus the `useLocalStorage` hook. This keeps boundaries clear and the code minimal for a micro-app.
