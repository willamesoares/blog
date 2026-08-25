import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Post } from "~/types";
import {
  usePageData,
  isBootConsumed,
  consumeBootData,
} from "~/context/PageData";
import { loadPosts } from "~/api/cms";
import PostItem from "~/components/PostItem";
import TagFilter from "~/components/TagFilter";
import { PostItemSkeleton } from "~/components/Skeleton";

export default function Posts() {
  const initialData = usePageData<{ posts: Post[] }>();
  const useInitial = !isBootConsumed() && !!initialData?.posts?.length;

  const [posts, setPosts] = useState<Post[]>(
    useInitial ? (initialData?.posts ?? []) : [],
  );
  const [loading, setLoading] = useState(!useInitial);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTags = useMemo(
    () =>
      (searchParams.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [searchParams],
  );

  useEffect(() => {
    if (!isBootConsumed() && initialData?.posts?.length) {
      consumeBootData();
      return;
    }
    consumeBootData();

    let cancelled = false;
    setLoading(true);

    loadPosts()
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts ?? []);
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

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const allTags = useMemo(() => {
    const names = new Set<string>();
    sortedPosts.forEach((post) => post.tags?.forEach((tag) => names.add(tag.name)));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [sortedPosts]);

  const filteredPosts = selectedTags.length
    ? sortedPosts.filter((post) =>
        post.tags?.some((tag) => selectedTags.includes(tag.name)),
      )
    : sortedPosts;

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSearchParams(next.length ? { tags: next.join(",") } : {});
  };

  return (
    <>
      {!loading && (
        <TagFilter tags={allTags} selectedTags={selectedTags} onToggle={toggleTag} />
      )}
      {loading ? (
        <div className="flex flex-col gap-10 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostItemSkeleton key={i} />
          ))}
        </div>
      ) : filteredPosts.length ? (
        <div className="flex flex-col gap-10 mt-4">
          {filteredPosts.map((post) => (
            <PostItem key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center text-text-muted">
          <p>
            {sortedPosts.length
              ? "No posts match the selected tags."
              : "No posts yet."}
          </p>
          {selectedTags.length ? (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="mt-2 text-brand hover:text-brand-hover transition-colors underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      )}
    </>
  );
}
