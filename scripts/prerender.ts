/**
 * SSG prerender script.
 *
 * Runs after `vite build` and `vite build --ssr`. For each route:
 *   1. Fetches data from Hygraph (server-side, API token never exposed)
 *   2. Renders the React component tree to an HTML string
 *   3. Injects the HTML + initial data into the index.html template
 *   4. Writes one HTML file per route to dist/client/
 *
 * Also writes /data/*.json files so client-side navigation can fetch
 * static data without calling Hygraph at runtime.
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { gql, GraphQLClient } from "graphql-request";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distClient = path.join(root, "dist/client");
const distServer = path.join(root, "dist/server");

// ---------------------------------------------------------------------------
// GraphQL queries
// ---------------------------------------------------------------------------

const GetAllTechPosts = gql`
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCmsClient() {
  const url = process.env.GRAPH_CMS_URL;
  const pat = process.env.GRAPH_CMS_PAT;
  if (!url) throw new Error("GRAPH_CMS_URL environment variable is not set");
  return new GraphQLClient(url, {
    headers: pat ? { Authorization: `Bearer ${pat}` } : {},
  });
}

function writeHtml(filePath: string, html: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, "utf-8");
}

function writeJson(filePath: string, data: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data), "utf-8");
}

function buildHtml(
  template: string,
  appHtml: string,
  initialData: unknown,
): string {
  return template
    .replace("<!--app-html-->", appHtml)
    .replace(
      "<!--app-head-->",
      `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`,
    );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function prerender() {
  const client = getCmsClient();
  const template = fs.readFileSync(
    path.join(distClient, "index.html"),
    "utf-8",
  );

  // Dynamically import the server bundle built by `vite build --ssr`
  const { render } = await import(path.join(distServer, "entry-server.js"));

  console.log("Fetching posts from Hygraph...");

  // Fetch tech and non-tech posts
  const [techData, nonTechData] = await Promise.all([
    client.request<{ posts: unknown[] }>(GetAllTechPosts, { isTech: true }),
    client.request<{ posts: unknown[] }>(GetAllTechPosts, { isTech: false }),
  ]);

  // Write static JSON data files
  const dataDir = path.join(distClient, "data");
  writeJson(path.join(dataDir, "posts-tech.json"), techData);
  writeJson(path.join(dataDir, "posts-non-tech.json"), nonTechData);
  console.log("  Written: /data/posts-tech.json, /data/posts-non-tech.json");

  // Render /posts (defaults to tech tab)
  const postsHtml = render("/posts", techData);
  writeHtml(
    path.join(distClient, "posts/index.html"),
    buildHtml(template, postsHtml, techData),
  );
  console.log("  Written: /posts/index.html");

  // Fetch and render each individual post
  const allSlugs = [
    ...techData.posts.map((p: any) => p.slug),
    ...nonTechData.posts.map((p: any) => p.slug),
  ];

  await Promise.all(
    allSlugs.map(async (slug: string) => {
      const postData = await client.request<{ post: unknown }>(GetPostBySlug, {
        slug,
      });
      writeJson(path.join(dataDir, `posts-${slug}.json`), postData);
      const postHtml = render(`/posts/${slug}`, postData);
      writeHtml(
        path.join(distClient, `posts/${slug}/index.html`),
        buildHtml(template, postHtml, postData),
      );
      console.log(`  Written: /posts/${slug}/index.html`);
    }),
  );

  console.log(`\nPrerender complete. ${allSlugs.length + 1} pages generated.`);
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
