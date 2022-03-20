import React from "react";

import { Tag as TagProps } from "~/types";

import * as S from "./Tag.styles";

const Tag = (tag: TagProps) => {
  return <S.Wrapper>{tag.name}</S.Wrapper>;
};

export default Tag;
