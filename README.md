# Will Soares' Blog

A personal blog built with [Remix](https://remix.run/) and deployed on [Netlify](https://www.netlify.com/). Posts are managed through [Hygraph](https://hygraph.com/), a GraphQL-based headless CMS.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 14
- [Netlify CLI](https://www.netlify.com/products/dev/)
- A [Hygraph](https://hygraph.com/) account with a configured project

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Install the Netlify CLI

```sh
npm i -g netlify-cli
```

If you have previously installed it, update to the latest version:

```sh
npm i -g netlify-cli@latest
```

### 3. Log in to Netlify and initialize the site

```sh
netlify login
netlify init
```

### 4. Set up environment variables

Copy the `.env.dist` template to `.env` and fill in the values:

```sh
cp .env.dist .env
```

| Variable | Required | Description |
|---|---|---|
| `GRAPH_CMS_URL` | Yes | Hygraph GraphQL API endpoint |
| `GRAPH_CMS_PAT` | Yes | Hygraph Personal Access Token |
| `GA_TRACKING_ID` | No | Google Analytics tracking ID |

### 5. Run the development server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server with hot reloading |
| `npm run build` | Build the app for production |
| `npm start` | Run the production build locally |

## Deployment

You can link your app to a git repo for automatic deploys, or deploy manually:

```sh
npm run build

# Preview deployment
netlify deploy

# Production deployment
netlify deploy --prod
```

## Documentation

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a detailed overview of the project architecture, components, dependencies, and Remix features used.
