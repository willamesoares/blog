import type { Tag } from "./tag.type";

export type Post = {
  slug: string;
  date: string;
  title: string;
  description: string;
  content: string;
  tags: Tag[];
  coverImage?: {
    url: string;
  };
};
