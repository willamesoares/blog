import { GraphQLClient, RequestDocument, gql } from "graphql-request";
import { Post } from "~/types";

// In dev mode, requests go through Vite's proxy (/graphql) which adds the auth header server-side.
// In the prerender script (build time), this function is called directly with process.env.
const getClient = () => {
  const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;

  if (isDev) {
    return new GraphQLClient(`${window.location.origin}/graphql`);
  }

  return new GraphQLClient(process.env.GRAPH_CMS_URL as string, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_CMS_PAT}`,
    },
  });
};

export const fetchCms = async <T>(
  query: RequestDocument,
  variables?: Record<string, unknown>,
  requestHeaders?: HeadersInit,
): Promise<T> => {
  const client = getClient();

  return client.request(query, variables, requestHeaders);
};

const GetPostsQuery = gql`
  query Posts {
    posts {
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

const GetPostBySlugQuery = gql`
  query PostBySlug($slug: String!) {
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

// In dev: skip the static-JSON detour entirely and hit the CMS through the
// Vite proxy. In prod: prefer the prerendered JSON for fast client-side nav,
// fall back to the CMS if it's missing. The DEV branch is dead-code-eliminated
// from prod bundles by Vite's static replacement of `import.meta.env.DEV`.

export const loadPosts = async (): Promise<{ posts: Post[] }> => {
  if (import.meta.env.DEV) {
    return fetchCms<{ posts: Post[] }>(GetPostsQuery);
  }

  try {
    const res = await fetch(`/data/posts.json`);
    if (!res.ok) throw new Error("not found");
    return await res.json();
  } catch {
    return fetchCms<{ posts: Post[] }>(GetPostsQuery);
  }
};

export const loadPost = async (
  slug: string,
): Promise<{ post: Post | null }> => {
  if (import.meta.env.DEV) {
    return fetchCms<{ post: Post | null }>(GetPostBySlugQuery, { slug });
  }

  try {
    const res = await fetch(`/data/posts-${slug}.json`);
    if (!res.ok) throw new Error("not found");
    return await res.json();
  } catch {
    return fetchCms<{ post: Post | null }>(GetPostBySlugQuery, { slug });
  }
};
