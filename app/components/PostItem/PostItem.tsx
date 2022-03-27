import React from "react";
import { Link } from "remix";

import { Post, Tag as TagProps } from "~/types";
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
      <S.Meta>
        <S.Date>{getLongFormattedDate(props.date)}</S.Date>
        {props.tags && props.tags.length ? (
          <S.Tags>
            {props.tags.map((tag: TagProps) => (
              <Tag key={tag.name} {...tag} />
            ))}
          </S.Tags>
        ) : null}
      </S.Meta>
      <S.Description>{props.description}</S.Description>
    </S.Wrapper>
  );
};

export default PostItem;