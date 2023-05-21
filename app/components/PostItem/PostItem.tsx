import React from "react";
import { Link } from "remix";

import { GAEventAction, GAEventCategory } from "~/types/ga-events.type";
import { Post, Tag as TagProps } from "~/types";
import calculateReadTime from "~/utils/calculateReadTime";
import { getLongFormattedDate } from "~/utils/date";
import * as gtag from "~/utils/gtags.client";

import Tag from "../Tag/Tag";

import * as S from "./PostItem.styles";

const PostItem = (props: Post) => {

  const isNonTechPost = () => {
    return props.tags.some(tag => tag.name.toLocaleLowerCase() === 'off-topic');
  }
  
  const handlePostLinkClick = () => {
    gtag.event({
      action: GAEventAction.PostClick,
      category: isNonTechPost() ? GAEventCategory.NonTech : GAEventCategory.Tech,
      label: props.slug,
      value: props.tags.map(tag => tag.name).join(','),
    });
  }

  return (
    <S.Wrapper>
      <S.Title>
        <Link to={`/posts/${props.slug}`} onClick={handlePostLinkClick} prefetch="intent">
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
