import { LoaderFunction, MetaFunction } from "remix";

import AllPostsPage, { loader as postsLoader } from "./posts";

export const meta: MetaFunction = () => {
  return { title: "@soawillb" };
};

export let loader: LoaderFunction = postsLoader;

export default AllPostsPage;
