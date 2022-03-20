import React from "react";

import * as S from "./Header.styles";

const Header = () => {
  return (
    <S.Wrapper>
      <S.Title>Will Soares</S.Title>
      <S.SocialLinks>
        <a
          href="https://github.com/willamesoares"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/github-icon.svg" alt="github profile" />
        </a>
        <a
          href="https://www.linkedin.com/in/willamesoares/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/linkedin-icon.svg" alt="linkedin profile" />
        </a>
        <a
          href="https://twitter.com/soawillb"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/twitter-icon.svg" alt="twitter profile" />
        </a>
      </S.SocialLinks>
    </S.Wrapper>
  );
};

export default Header;
