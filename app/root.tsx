import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";

import globalStyles from "~/styles/global.css";
import normalizeStyles from "~/styles/normalize.css";
import resetStyles from "~/styles/reset.css";
import typographyStyles from "~/styles/typography.css";
import AppLayout from "./components/AppLayout/AppLayout";

import highlightAtomDarkTheme from "highlight.js/styles/atom-one-dark.css";

export const meta: MetaFunction = () => {
  return {
    charset: "utf-8",
    description: "Posts about web development and a whatever comes to mind.",
    keywords: "web,development,javascript,react,html,css",
    title: "@soawillb",
    viewport: "width=device-width,initial-scale=1",
    "og:image": "/favicon.ico",
    "twitter:creator": "Will Soares",
    "twitter:description":
      "Posts about web development and a whatever comes to mind.",
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: resetStyles,
    },
    {
      rel: "stylesheet",
      href: normalizeStyles,
    },
    {
      rel: "stylesheet",
      href: typographyStyles,
    },
    {
      rel: "stylesheet",
      href: globalStyles,
    },
    {
      rel: "stylesheet",
      href: highlightAtomDarkTheme,
    },
  ];
};

function setStylesPlaceholder() {
  return typeof document === "undefined" ? "__STYLES__" : null;
}

export function CatchBoundary() {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
        {setStylesPlaceholder()}
      </head>
      <body>
        <AppLayout>
          <h3 style={{ textAlign: "center" }}>It seems like we got lost.</h3>
          <p style={{ textAlign: "center" }}>
            Take us back{" "}
            <Link to="/" reloadDocument>
              home
            </Link>
            .
          </p>
        </AppLayout>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {setStylesPlaceholder()}
      </head>
      <body>
        <AppLayout>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </AppLayout>
      </body>
    </html>
  );
}
