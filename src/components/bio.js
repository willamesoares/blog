/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"
import githubIcon from "../assets/github.svg"
import linkedinIcon from "../assets/linkedin.svg"
import twitterIcon from "../assets/twitter.svg"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author } = data.site.siteMetadata
        return (
          <div
            style={{
              alignItems: `center`,
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <Link
              style={{
                backgroundImage: `none`,
                boxShadow: `none`,
                color: `inherit`,
                height: rhythm(3),
                marginRight: rhythm(.8),
                textDecoration: `none`,
                width: rhythm(3),
              }}
              to={`/`}
            >
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  marginRight: rhythm(1 / 2),
                  marginBottom: 0,
                  width: `100%`,
                  height: `100%`,
                  borderRadius: `100%`,
                }}
                imgStyle={{
                  borderRadius: `50%`,
                }}
              />
            </Link>
            <div
              style={{
                width: `70%`,
              }}
            >
              <h3 style={{
                margin: `0 0 ${rhythm(.5)}`,
              }}>
                {author}
              </h3>
              <div
                style={{
                  display: `flex`,
                  alignItems: `center`,
                }}
              >
                <a
                  style={{...noThemeTextDecoration, ...iconStyle}}
                  href={data.site.siteMetadata.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={githubIcon} alt="github"/>
                </a>
                <a
                  style={{...noThemeTextDecoration, ...iconStyle}}
                  href={data.site.siteMetadata.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkedinIcon} alt="linkedin"/>
                </a>
                <a
                  style={{...noThemeTextDecoration, ...iconStyle}}
                  href={data.site.siteMetadata.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={twitterIcon} alt="twitter"/>
                </a>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}

const iconStyle = {
  cursor: `pointer`,
  display: `block`,
  marginBottom: `0`,
  marginRight: rhythm(.6),
  width: rhythm(.8),
  height: rhythm(.8),
}

const noThemeTextDecoration = {
  backgroundImage: `none`,
  textShadow: `none`,
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 500, height: 500) {
          ...GatsbyImageSharpFixed
        }
      }
    }
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
`

export default Bio
