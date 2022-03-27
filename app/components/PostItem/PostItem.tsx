import React from "react";
import { Link } from "remix";

import { Post, Tag as TagProps } from "~/types";
import calculateReadTime from "~/utils/calculateReadTime";
import { getLongFormattedDate } from "~/utils/date";

import Tag from "../Tag/Tag";

import * as S from "./PostItem.styles";

const PostItem = (props: Post) => {
  return (
    <S.Wrapper>
      <S.Title>
        <Link to={`/posts/${props.slug}`} prefetch="intent">
          {props.title}
        </Link>
      </S.Title>
      <S.Subtitle>
        <S.Meta>
          {getLongFormattedDate(props.date)} &bull;{" "}
          {calculateReadTime(props.content)} min read
        </S.Meta>
        {props.tags && props.tags.length ? (
          <S.Tags>
            {props.tags.map((tag: TagProps) => (
              <Tag key={tag.name} {...tag} />
            ))}
          </S.Tags>
        ) : null}
      </S.Subtitle>
      <S.Description>{props.description}</S.Description>
    </S.Wrapper>
  );
};

export default PostItem;
