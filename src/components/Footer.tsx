import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-border text-sm text-text/60 text-center">
      <p>Built with an LLM. Words are still 100% human-made.</p>
      <nav
        aria-label="Footer"
        className="flex justify-center items-center gap-2 mt-3 text-text-muted"
      >
        <Link to="/poems" className="hover:text-brand transition-colors">
          Poems
        </Link>
        <span aria-hidden="true">&bull;</span>
        <Link to="/playlists" className="hover:text-brand transition-colors">
          Playlists
        </Link>
      </nav>
    </footer>
  );
}
