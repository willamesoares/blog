import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-border text-sm text-text/60 text-center">
      <nav
        aria-label="Footer"
        className="flex justify-center items-center gap-2 text-text-muted"
      >
        <Link to="/poems" className="hover:text-brand transition-colors">
          Poems
        </Link>
        <span aria-hidden="true">&bull;</span>
        <Link to="/playlists" className="hover:text-brand transition-colors">
          Playlists
        </Link>
      </nav>
      <p className="mt-3">Built with an LLM. Words are still 100% from a human.</p>
      <p className="mt-3">
        &copy; {new Date().getFullYear()} TheMindHopper. All rights reserved.
      </p>
    </footer>
  );
}
