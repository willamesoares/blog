import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import highlight from "highlight.js";
import { Post as PostType } from "~/types";
import {
  usePageData,
  isBootConsumed,
  consumeBootData,
} from "~/context/PageData";
import { loadPost } from "~/api/cms";
import Article from "~/components/Article";
import CommentSection from "~/components/CommentSection";

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const initialData = usePageData<{ post: PostType }>();
  const useInitial =
    !isBootConsumed() && !!initialData?.post && initialData.post.slug === slug;
  const [post, setPost] = useState<PostType | null>(
    useInitial ? (initialData?.post ?? null) : null,
  );
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    if (!isBootConsumed() && initialData?.post?.slug === slug) {
      consumeBootData();
      return;
    }
    consumeBootData();

    let cancelled = false;
    setPost(null);
    setNotFound(false);

    loadPost(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data.post) setNotFound(true);
        else setPost(data.post);
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, initialData]);

  useEffect(() => {
    if (post) {
      highlight.highlightAll();
      document.title = `${post.title} | @soawillb`;
    }
  }, [post]);

  if (notFound) {
    return (
      <div className="text-center mt-10">
        <h3>Post not found.</h3>
        <Link to="/">&lt; Back to posts</Link>
      </div>
    );
  }

  if (!post) {
    return <p className="mt-10 text-center">Loading...</p>;
  }

  return (
    <>
      <Article {...post} />
      <Link to="/" className="text-brand no-underline">
        &lt; Back to posts
      </Link>
      <CommentSection />
    </>
  );
}
