# Movie & Show Search

A beginner-friendly project demonstrating JavaScript DOM events, array methods, `fetch()`, React, TypeScript, and Git/GitHub workflows.

> **API note:** TVMaze is a free public API for TV shows, not a comprehensive movie database. This app is therefore labelled “Movie & Show Search” and searches TVMaze data. No API key is required.

## Features
- Search TVMaze using `fetch()`
- Display title, premiere year, genres, rating, poster, and summary when available
- Add and remove saved shows from a watchlist
- `map()` to render result cards, `filter()` to remove selections, and `reduce()` to count saved items
- Plain JavaScript DOM implementation (`index.html`, `style.css`, `script.js`)
- React + TypeScript implementation (`src/`)
- Responsive layout and loading/error states

## Run the plain JavaScript version
You can open `index.html` directly in a browser. For best results, serve the folder using a local static server, for example VS Code Live Server.

## Run the React + TypeScript version
Install Node.js (LTS), then run:

```bash
npm install
```

The React entry point is `src/main.tsx`. To use it with Vite, rename `react-index.html` to `index.html` (or copy its contents into `index.html`), then run:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## API
- Endpoint: `https://api.tvmaze.com/search/shows?q=QUERY`
- Docs: https://www.tvmaze.com/api
- Search endpoint returns an array of objects containing a `show` object.

## Git and GitHub demonstration

Create a repository on GitHub named `movie-search-app`, then from this folder run:

```bash
git init
git add .
git commit -m "Initial movie search app structure"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/movie-search-app.git
git push -u origin main
```

Create a feature branch and make a small improvement:

```bash
git switch -c feature/watchlist-feedback
# Edit the app, e.g. improve the empty-watchlist message
git add .
git commit -m "Improve watchlist empty state"
git push -u origin feature/watchlist-feedback
```

Open a Pull Request on GitHub from `feature/watchlist-feedback` into `main`, review it, and merge it. Then sync your local main branch:

```bash
git switch main
git pull origin main
```

### Suggested commits for an assignment demo
1. `Initial project structure`
2. `Add TVMaze search with fetch`
3. `Render result cards with map`
4. `Add and remove watchlist selections`
5. `Add React TypeScript component`
6. `Polish responsive styling and documentation`

Do not claim that commits or a GitHub upload have been completed until you actually run the commands and push the repository.
