import { useState, useEffect } from "react";
import { Playlist } from "~/types";
import {
  usePageData,
  isBootConsumed,
  consumeBootData,
} from "~/context/PageData";
import { loadPlaylists } from "~/api/spotify";
import PlaylistCard from "~/components/PlaylistCard";
import PlaylistPreviewModal from "~/components/PlaylistPreviewModal";
import { PlaylistCardSkeleton } from "~/components/Skeleton";

export default function Playlists() {
  const initialData = usePageData<{ playlists: Playlist[] }>();
  const useInitial = !isBootConsumed() && !!initialData?.playlists?.length;

  const [playlists, setPlaylists] = useState<Playlist[]>(
    useInitial ? (initialData?.playlists ?? []) : [],
  );
  const [loading, setLoading] = useState(!useInitial);
  const [selected, setSelected] = useState<Playlist | null>(null);

  useEffect(() => {
    if (!isBootConsumed() && initialData?.playlists?.length) {
      consumeBootData();
      return;
    }
    consumeBootData();

    let cancelled = false;
    setLoading(true);

    loadPlaylists()
      .then((data) => {
        if (cancelled) return;
        setPlaylists(data.playlists ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialData]);

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-2 tablet:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaylistCardSkeleton key={i} />
          ))}
        </div>
      ) : playlists.length ? (
        <div className="grid grid-cols-2 tablet:grid-cols-3 gap-4 mt-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} {...playlist} onSelect={setSelected} />
          ))}
        </div>
      ) : (
        <div className="text-center text-text-muted py-6">
          <p>No public playlists yet.</p>
        </div>
      )}
      {selected ? (
        <PlaylistPreviewModal
          playlist={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </>
  );
}
