// Plain JavaScript version: DOM events, fetch(), map(), filter(), and reduce().
const API_URL = "https://api.tvmaze.com/search/shows?q=";
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const statusEl = document.querySelector("#status");
const resultsEl = document.querySelector("#results");
const watchlistEl = document.querySelector("#watchlist");
const resultCountEl = document.querySelector("#result-count");
const watchlistCountEl = document.querySelector("#watchlist-count");

// Selected items are stored as an array of objects.
let selectedMovies = [];
let currentResults = [];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function getYear(show) {
  const date = show.premiered || show.ended;
  return date ? date.slice(0, 4) : "Year unknown";
}

function cleanSummary(summary = "") {
  const text = summary.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text || "No summary available.";
}

function movieCard(show, isSaved = false) {
  const image = show.image?.medium
    ? `<img class="poster" src="${escapeHtml(show.image.medium)}" alt="Poster for ${escapeHtml(show.name)}" loading="lazy">`
    : `<div class="poster-placeholder" aria-label="No poster available">✦</div>`;
  const genres = show.genres?.length ? show.genres.join(" · ") : "Genre unavailable";
  const rating = show.rating?.average ? `★ ${show.rating.average}/10` : "No rating";
  const buttonText = isSaved ? "Remove from watchlist" : "＋ Add to watchlist";
  return `
    <article class="movie-card">
      ${image}
      <div class="card-body">
        <h3>${escapeHtml(show.name)}</h3>
        <div class="meta">${escapeHtml(getYear(show))} · ${escapeHtml(genres)}</div>
        <div class="meta">${escapeHtml(rating)}</div>
        <p class="summary">${escapeHtml(cleanSummary(show.summary)).slice(0, 210)}${cleanSummary(show.summary).length > 210 ? "…" : ""}</p>
        <button type="button" data-show-id="${Number(show.id)}" data-action="${isSaved ? "remove" : "add"}">${buttonText}</button>
      </div>
    </article>`;
}

function renderResults(shows) {
  currentResults = shows;
  resultCountEl.textContent = `${shows.length} result${shows.length === 1 ? "" : "s"}`;
  resultsEl.innerHTML = shows.length
    ? shows.map((show) => movieCard(show, selectedMovies.some((item) => item.id === show.id))).join("")
    : '<p class="empty">No results found. Try another title.</p>';
}

function renderWatchlist() {
  // reduce() counts selected movies as required by the assignment.
  const selectedCount = selectedMovies.reduce((count) => count + 1, 0);
  watchlistCountEl.textContent = `${selectedCount} saved`;
  watchlistEl.innerHTML = selectedMovies.length
    ? selectedMovies.map((show) => movieCard(show, true)).join("")
    : '<p class="empty">Your watchlist is empty. Add something from the search results.</p>';
}

async function searchShows(query) {
  statusEl.textContent = "Searching TVMaze…";
  const searchButton = searchForm.querySelector("button");
  searchButton.disabled = true;
  try {
    const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const data = await response.json();
    // map() transforms TVMaze search wrappers into show objects.
    const shows = data.map((item) => item.show).filter(Boolean);
    renderResults(shows);
    statusEl.textContent = `Found ${shows.length} result${shows.length === 1 ? "" : "s"} for “${query}”.`;
  } catch (error) {
    resultsEl.innerHTML = '<p class="empty">Could not load results. Check your connection and try again.</p>';
    resultCountEl.textContent = "0 results";
    statusEl.textContent = error.message || "Something went wrong.";
  } finally {
    searchButton.disabled = false;
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) searchShows(query);
});

// Event delegation: one click handler supports dynamically rendered cards.
document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const showId = Number(button.dataset.showId);
  if (button.dataset.action === "add") {
    const show = currentResults.find((item) => item.id === showId);
    if (show && !selectedMovies.some((item) => item.id === showId)) {
      selectedMovies = [...selectedMovies, {
        id: show.id, name: show.name, premiered: show.premiered,
        ended: show.ended, genres: show.genres, rating: show.rating,
        image: show.image, summary: show.summary
      }];
    }
  } else {
    // filter() removes the selected item by ID.
    selectedMovies = selectedMovies.filter((item) => item.id !== showId);
  }
  renderResults(currentResults);
  renderWatchlist();
});

renderWatchlist();
