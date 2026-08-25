import { useState, useEffect } from "react";
import { Poem } from "~/types";
import {
  usePageData,
  isBootConsumed,
  consumeBootData,
} from "~/context/PageData";
import { loadPoems } from "~/api/cms";
import PoemCard from "~/components/PoemCard";
import { PoemCardSkeleton } from "~/components/Skeleton";

export default function Poems() {
  const initialData = usePageData<{ poems: Poem[] }>();
  const useInitial = !isBootConsumed() && !!initialData?.poems?.length;

  const [poems, setPoems] = useState<Poem[]>(
    useInitial ? (initialData?.poems ?? []) : [],
  );
  const [loading, setLoading] = useState(!useInitial);

  useEffect(() => {
    if (!isBootConsumed() && initialData?.poems?.length) {
      consumeBootData();
      return;
    }
    consumeBootData();

    let cancelled = false;
    setLoading(true);

    loadPoems()
      .then((data) => {
        if (cancelled) return;
        setPoems(data.poems ?? []);
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

  return loading ? (
    <div className="columns-1 min-[576px]:columns-2 gap-6 mt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <PoemCardSkeleton key={i} />
      ))}
    </div>
  ) : poems.length ? (
    <div className="columns-1 min-[576px]:columns-2 gap-6 mt-4">
      {poems.map((poem) => (
        <PoemCard key={poem.name} {...poem} />
      ))}
    </div>
  ) : (
    <div className="text-center text-text-muted py-6">
      <p>No poems yet.</p>
    </div>
  );
}
