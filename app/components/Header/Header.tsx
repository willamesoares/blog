import React from "react";

import { GAEventAction } from "~/types/ga-events.type";
import * as gtag from "~/utils/gtags.client";

import * as S from "./Header.styles";

const Header = () => {

  const Links = {
    github: 'https://github.com/willamesoares',
    linkedin: 'https://www.linkedin.com/in/willamesoares/',
    twitter: 'https://twitter.com/soawillb',
    spotify: 'https://open.spotify.com/user/12142416238?si=413f855243db43fd',
  };
  
  const handleSocialLinkClick = (networkName: string, link: string) => {
    gtag.event({
      action: GAEventAction.SocialClick,
      category: 'social_network',
      label: networkName,
      value: link,
    });
  }

  return (
    <S.Wrapper>
      <S.Title>Will Soares</S.Title>
      <S.SocialLinks>
        <a
          href={Links.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleSocialLinkClick('github', Links.github)}
        >
          <img src="/github-icon.svg" alt="github profile" />
        </a>
        <a
          href={Links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleSocialLinkClick('github', Links.linkedin)}
        >
          <img src="/linkedin-icon.svg" alt="linkedin profile" />
        </a>
        <a
          href={Links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleSocialLinkClick('github', Links.twitter)}
        >
          <img src="/twitter-icon.svg" alt="twitter profile" />
        </a>
        <a
          href={Links.spotify}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleSocialLinkClick('github', Links.spotify)}
        >
          <img src="/spotify-icon.svg" alt="spotify profile" />
        </a>
      </S.SocialLinks>
    </S.Wrapper>
  );
};

export default Header;
