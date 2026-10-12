import { FormEvent, useMemo, useState } from "react";

type Rating = { average: number | null };
type ShowImage = { medium: string; original: string } | null;

type Show = {
  id: number;
  name: string;
  premiered: string | null;
  ended: string | null;
  genres: string[];
  rating: Rating;
  image: ShowImage;
  summary: string | null;
};

type SearchResult = { score: number; show: Show };

const API_URL = "https://api.tvmaze.com/search/shows?q=";

function yearOf(show: Show): string {
  const date = show.premiered ?? show.ended;
  return date ? date.slice(0, 4) : "Year unknown";
}

function summaryText(summary: string | null): string {
  return summary?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    || "No summary available.";
}

function ShowCard({ show, saved, onToggle }: {
  show: Show;
  saved: boolean;
  onToggle: (show: Show) => void;
}) {
  return (
    <article className="show-card">
      {show.image?.medium
        ? <img className="poster" src={show.image.medium} alt={`Poster for ${show.name}`} loading="lazy" />
        : <div className="poster placeholder">✦</div>}
      <div className="card-content">
        <h3>{show.name}</h3>
        <p className="meta">{yearOf(show)} · {show.genres.length ? show.genres.join(" · ") : "Genre unavailable"}</p>
        <p className="meta">{show.rating.average == null ? "No rating" : `★ ${show.rating.average}/10`}</p>
        <p className="summary">{summaryText(show.summary).slice(0, 210)}{summaryText(show.summary).length > 210 ? "…" : ""}</p>
        <button type="button" onClick={() => onToggle(show)}>
          {saved ? "Remove from watchlist" : "＋ Add to watchlist"}
        </button>
      </div>
    </article>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Show[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Show[]>([]);
  const [status, setStatus] = useState("Search for a title to get started.");
  const [loading, setLoading] = useState(false);

  // reduce() counts saved items; this is derived from typed array data.
  const selectedCount = useMemo(
    () => selectedMovies.reduce((count) => count + 1, 0),
    [selectedMovies]
  );

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setStatus("Enter a title before searching.");
      return;
    }
    setLoading(true);
    setStatus("Searching TVMaze…");
    try {
      const response = await fetch(`${API_URL}${encodeURIComponent(trimmedQuery)}`);
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data: SearchResult[] = await response.json();
      // map() extracts typed Show objects from the API response.
      const shows = data.map((item) => item.show).filter(Boolean);
      setResults(shows);
      setStatus(`Found ${shows.length} result${shows.length === 1 ? "" : "s"} for “${trimmedQuery}”.`);
    } catch {
      setResults([]);
      setStatus("Could not load results. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelected(show: Show) {
    // filter() removes an existing selection; otherwise append a typed object.
    setSelectedMovies((previous) =>
      previous.some((item) => item.id === show.id)
        ? previous.filter((item) => item.id !== show.id)
        : [...previous, show]
    );
  }

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">DISCOVER SOMETHING TO WATCH</p>
        <h1>Movie &amp; Show Search</h1>
        <p>Search TVMaze's free catalogue and build your watchlist.</p>
      </header>
      <section className="content">
        <form className="search-form" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="query">Search for a movie or show</label>
          <input id="query" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “Friends” or “The Office”" />
          <button type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</button>
        </form>
        <p className="status" role="status" aria-live="polite">{status}</p>
        <section className="section">
          <div className="section-heading"><h2>Search results</h2><span>{results.length} results</span></div>
          <div className="show-grid">
            {results.length
              ? results.map((show) => <ShowCard key={show.id} show={show}
                  saved={selectedMovies.some((item) => item.id === show.id)} onToggle={toggleSelected} />)
              : <p className="empty">Search for a title to see results here.</p>}
          </div>
        </section>
        <section className="section">
          <div className="section-heading"><h2>Your watchlist</h2><span>{selectedCount} saved</span></div>
          <div className="show-grid">
            {selectedMovies.length
              ? selectedMovies.map((show) => <ShowCard key={show.id} show={show} saved onToggle={toggleSelected} />)
              : <p className="empty">Your watchlist is empty. Add something from the search results.</p>}
          </div>
        </section>
      </section>
      <footer>Data provided by <a href="https://www.tvmaze.com/api" target="_blank" rel="noreferrer">TVMaze API</a>.</footer>
    </main>
  );
}
