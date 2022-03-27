import { marked } from "marked";
import React from "react";

import { Post } from "~/types";
import { getLongFormattedDate } from "~/utils/date";
import Tag from "../Tag/Tag";

import * as S from "./Article.styles";

const Article = (article: Post): JSX.Element => {
  return (
    <S.Wrapper>
      {article?.coverImage ? (
        <img src={article.coverImage.url} alt="post cover" />
      ) : null}
      <S.Title>{article?.title}</S.Title>
      {article?.date ? (
        <S.Date>{getLongFormattedDate(article.date)}</S.Date>
      ) : null}
      {article?.tags && article?.tags.length ? (
        <S.Tags>
          {article.tags.map((tag) => (
            <Tag key={tag.name} {...tag} />
          ))}
        </S.Tags>
      ) : null}
      <S.Content
        dangerouslySetInnerHTML={{ __html: marked(article?.content || "") }}
      />
    </S.Wrapper>
  );
};

export default Article;
