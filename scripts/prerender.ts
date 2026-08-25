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

const GetAllPosts = gql`
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

const GetAllPoems = gql`
  query Poems {
    poems {
      name
      content
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

  const postsData = await client.request<{ posts: unknown[] }>(GetAllPosts);

  // Write static JSON data file
  const dataDir = path.join(distClient, "data");
  writeJson(path.join(dataDir, "posts.json"), postsData);
  console.log("  Written: /data/posts.json");

  // Render / (home) — overwrites the SPA template, but the template was
  // already read into memory above.
  const homeHtml = render("/", postsData);
  writeHtml(
    path.join(distClient, "index.html"),
    buildHtml(template, homeHtml, postsData),
  );
  console.log("  Written: /index.html");

  console.log("Fetching poems from Hygraph...");

  const poemsData = await client.request<{ poems: unknown[] }>(GetAllPoems);

  writeJson(path.join(dataDir, "poems.json"), poemsData);
  console.log("  Written: /data/poems.json");

  const poemsHtml = render("/poems", poemsData);
  writeHtml(
    path.join(distClient, "poems/index.html"),
    buildHtml(template, poemsHtml, poemsData),
  );
  console.log("  Written: /poems/index.html");

  // Fetch and render each individual post under /post/:slug
  const allSlugs = postsData.posts.map((p: any) => p.slug);

  await Promise.all(
    allSlugs.map(async (slug: string) => {
      const postData = await client.request<{ post: unknown }>(GetPostBySlug, {
        slug,
      });
      writeJson(path.join(dataDir, `posts-${slug}.json`), postData);
      const postHtml = render(`/post/${slug}`, postData);
      writeHtml(
        path.join(distClient, `post/${slug}/index.html`),
        buildHtml(template, postHtml, postData),
      );
      console.log(`  Written: /post/${slug}/index.html`);
    }),
  );

  console.log(`\nPrerender complete. ${allSlugs.length + 2} pages generated.`);
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
