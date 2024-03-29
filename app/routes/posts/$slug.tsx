import { gql } from "graphql-request";
import { useEffect } from "react";
import { useLoaderData, json, LoaderFunction, MetaFunction, Link } from "remix";
import highlight from "highlight.js";

import { fetchCms } from "~/api";

import { Post } from "~/types";

import Article from "~/components/Article/Article";
import CommentSection from "~/components/CommentSection/CommentSection";
import Header from "~/components/Header/Header";

export const meta: MetaFunction = ({ data }: { data: { post: Post } }) => {
  return { title: `${data?.post?.title} | @soawillb` };
};

const GetPostBySlug = gql`
  query MyQuery($slug: String!) {
    post(where: { slug: $slug }) {
      title
      content
      date
      description
      id
      slug
      tags {
        ... on Tag {
          id
          name
        }
      }
      coverImage {
        url
      }
      coverImageCredits
    }
  }
`;

export let loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;

  const data = await fetchCms<{ post: Post }>(GetPostBySlug, { slug });

  if (!data?.post) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json(data);
};

export default function PostPage() {
  let { post } = useLoaderData<{ post: Post }>();

  useEffect(() => {
    highlight.highlightAll();
  }, []);

  return (
    <>
      <Header />
      <Article {...post} />
      <Link to="/"> &lt; Home</Link>
      <CommentSection />
    </>
  );
}
