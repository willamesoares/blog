import {
  useLoaderData,
  json,
  LoaderFunction,
  MetaFunction,
  useSearchParams,
} from "remix";
import { gql } from "graphql-request";
import styled from "styled-components";

import { fetchCms } from "~/api";
import { Post } from "~/types";
import PostItem from "~/components/PostItem/PostItem";
import Header from "~/components/Header/Header";
import Tabs from "~/components/Tabs/Tabs";
import { POST_TYPE } from "~/constants";

export const meta: MetaFunction = () => {
  return { title: "@soawillb" };
};

const GetPostsQuery = gql`
  query Posts($isTech: Boolean) {
    posts(where: { isTech: $isTech }) {
      title
      content
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

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const postType = url.searchParams.get("type");
  const isNonTech = postType === POST_TYPE.NON_TECH;

  const data = await fetchCms<{ posts: Post[] }>(GetPostsQuery, {
    isTech: !isNonTech,
  });

  return json(data);
};

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export default function AllPostsPage() {
  const [searchParams] = useSearchParams();

  let { posts } = useLoaderData<{ posts: Post[] }>();

  const postsSortedByDate = [...posts].sort((postA, postB) => {
    return new Date(postB.date).getTime() - new Date(postA.date).getTime();
  });

  return (
    <>
      <Header />
      <Tabs
        activeTab={searchParams.get("type") === POST_TYPE.NON_TECH ? 1 : 0}
      />
      <PostsList>
        {postsSortedByDate.map((post: Post) => (
          <PostItem key={post.slug} {...post} />
        ))}
      </PostsList>
    </>
  );
}
