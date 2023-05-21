# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

This blog was bootstrapped with the template for [Remix + Netlify](https://github.com/netlify/remix-template/tree/main), so the following instructions assume you have a Netlify account and are familiar with the process of setting up and deploying on Netlify.

On top of that, this project adds a GraphQL CMS as a dependency (in this case [hygraph](https://hygraph.com/) is used). If you want to use another CMS, changes to env var and graphql libraries might be necessary.

## Netlify Setup

1. Install the [Netlify CLI](https://www.netlify.com/products/dev/):

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
netlify login
```

3. Create a new site:

```sh
netlify init
```

## Development

The Netlify CLI starts your app in development mode, rebuilding assets on file changes.

After copying and renaming `.env.dist` to `.env` and setting up env variables for accessing content in your GraphQL CMS (`GRAPH_CMS_URL` and  `GRAPH_CMS_PAT`), you can run the following command to start up the server in development mode:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

## Deployment

There are two ways to deploy your app to Netlify, you can either link your app to your git repo and have it auto deploy changes to Netlify, or you can deploy your app manually. If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run build
# preview deployment
netlify deploy

# production deployment
netlify deploy --prod
```
