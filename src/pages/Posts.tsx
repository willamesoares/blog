import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Post } from "~/types";
import { POST_TYPE } from "~/constants";
import { usePageData } from "~/context/PageData";
import { loadPosts } from "~/api/cms";
import PostItem from "~/components/PostItem";
import Tabs from "~/components/Tabs";

export default function Posts() {
  const [searchParams] = useSearchParams();
  const postType = searchParams.get("type");
  const isNonTech = postType === POST_TYPE.NON_TECH;
  const activeTab = isNonTech ? 1 : 0;

  const initialData = usePageData<{ posts: Post[] }>();
  const [posts, setPosts] = useState<Post[]>(initialData?.posts ?? []);
  const [loading, setLoading] = useState(!initialData?.posts?.length);
  // initialData comes from a single global context set at app boot. It only
  // matches the first page rendered; on every subsequent navigation we must
  // fetch fresh data instead of trusting the stale value.
  const consumedInitialData = useRef(false);

  useEffect(() => {
    if (!consumedInitialData.current && initialData?.posts?.length) {
      consumedInitialData.current = true;
      return;
    }
    consumedInitialData.current = true;

    let cancelled = false;
    setLoading(true);

    loadPosts(!isNonTech)
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [postType, isNonTech, initialData]);

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
