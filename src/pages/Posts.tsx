import { useState, useEffect } from "react";
import { Post } from "~/types";
import { POST_TYPE } from "~/constants";
import {
  usePageData,
  isBootConsumed,
  consumeBootData,
} from "~/context/PageData";
import { loadPosts } from "~/api/cms";
import PostItem from "~/components/PostItem";
import Tabs from "~/components/Tabs";

type PostsProps = {
  type: string;
};

export default function Posts({ type }: PostsProps) {
  const isNonTech = type === POST_TYPE.NON_TECH;
  const activeTab = isNonTech ? 1 : 0;

  const initialData = usePageData<{ posts: Post[]; type?: string }>();
  // Only trust the prerendered payload when its `type` matches this route's
  // tab. Otherwise the host served the wrong HTML for the URL (e.g. an SPA
  // fallback hitting /index.html for /non-tech) and we must refetch.
  const useInitial =
    !isBootConsumed() &&
    initialData?.type === type &&
    !!initialData?.posts?.length;

  const [posts, setPosts] = useState<Post[]>(
    useInitial ? (initialData?.posts ?? []) : [],
  );
  const [loading, setLoading] = useState(!useInitial);

  useEffect(() => {
    if (
      !isBootConsumed() &&
      initialData?.type === type &&
      initialData?.posts?.length
    ) {
      consumeBootData();
      return;
    }
    consumeBootData();

    let cancelled = false;
    setLoading(true);

    loadPosts(!isNonTech)
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
  }, [type, isNonTech, initialData]);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <>
      <Tabs activeTab={activeTab} />
      {loading ? (
        <p className="mt-10 text-center">Loading...</p>
      ) : (
        <div className="flex flex-col gap-10 mt-6">
          {sortedPosts.map((post) => (
            <PostItem key={post.slug} {...post} />
          ))}
        </div>
      )}
    </>
  );
}
