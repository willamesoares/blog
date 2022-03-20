import { useLoaderData, json, LoaderFunction, MetaFunction } from "remix";
import { gql } from "graphql-request";

import { fetchCms } from "~/api";
import { Post } from "~/types";
import PostItem from "~/components/PostItem/PostItem";
import styled from "styled-components";
import Header from "~/components/Header/Header";

export const meta: MetaFunction = () => {
  return { title: "All posts | @soawillb" };
};

const GetPostsQuery = gql`
  {
    posts {
      title
      date
      description
      slug
      tags {
        ... on Tag {
          name
        }
      }
    }
  }
`;

export let loader: LoaderFunction = async () => {
  const data = await fetchCms<{ posts: Post[] }>(GetPostsQuery);

  return json(data);
};

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default function HomePage() {
  let { posts } = useLoaderData<{ posts: Post[] }>();

  return (
    <>
      <Header />
      <PostsList>
        {posts.map((post: Post) => (
          <PostItem key={post.slug} {...post} />
        ))}
      </PostsList>
    </>
  );
}
