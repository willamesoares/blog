import { gql } from "graphql-request";
import { useLoaderData, json, LoaderFunction, MetaFunction } from "remix";

import { fetchCms } from "~/api";
import Article from "~/components/Article/Article";
import { Post } from "~/types";

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

  return <Article {...post} />;
}
