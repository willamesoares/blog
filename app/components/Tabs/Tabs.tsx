import React from "react";

import { POST_TYPE } from "~/constants";

import * as S from "./Tabs.styles";

type TabsProps = {
  activeTab?: number;
};

const Tabs = ({ activeTab = 0 }: TabsProps) => {
  const tabs = [
    {
      label: "tech posts",
      path: `/posts?type=${POST_TYPE.TECH}`,
    },
    {
      label: "everything else",
      path: `/posts?type=${POST_TYPE.NON_TECH}`,
    },
  ];

  return (
    <S.Wrapper>
      {tabs.map(({ label, path }, index) => {
        return (
          <S.Tab key={label} active={index === activeTab}>
            <S.Label to={path}>{label}</S.Label>
          </S.Tab>
        );
      })}
    </S.Wrapper>
  );
};

export default Tabs;
