import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

import { rhythm } from '../utils/typography';
import githubIcon from '../assets/github.svg';
import linkedinIcon from '../assets/linkedin.svg';
import twitterIcon from '../assets/twitter.svg';

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author } = data.site.siteMetadata;
        return (
          <div
            style={{
              flexDirection: `column`,
              display: `flex`
            }}
          >
            <h3
              style={{
                margin: `0 0 .8em`
              }}
            >
              <Link
                style={{
                  color: `black`,
                  backgroundImage: `none`
                }}
                to={`/`}
              >
                { author }
              </Link>
            </h3>
            <div
              style={{
                display: `flex`,
                alignItems: `center`
              }}
            >
              <a
                style={{ ...noThemeTextDecoration, ...iconStyle }}
                href={data.site.siteMetadata.social.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={githubIcon} alt="github" />
              </a>
              <a
                style={{ ...noThemeTextDecoration, ...iconStyle }}
                href={data.site.siteMetadata.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={linkedinIcon} alt="linkedin" />
              </a>
              <a
                style={{ ...noThemeTextDecoration, ...iconStyle }}
                href={data.site.siteMetadata.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={twitterIcon} alt="twitter" />
              </a>
            </div>
          </div>
        );
      }}
    />
  );
}

const iconStyle = {
  cursor: `pointer`,
  display: `block`,
  marginBottom: `0`,
  marginRight: rhythm(0.6),
  width: rhythm(0.8),
  height: rhythm(0.8)
};

const noThemeTextDecoration = {
  backgroundImage: `none`,
  textShadow: `none`
};

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        author
        social {
          github
          linkedin
          twitter
        }
      }
    }
  }
`;

export default Bio;
