import React, { useEffect, useState } from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm, scale } from '../utils/typography';
import { firestore } from '../../firebase';
import Comments from '../components/comments';
import CommentForm from '../components/commentForm';

const BlogPostTemplate = (props) => {
  const {
    data: {
      markdownRemark: post = {},
      site: {
        siteMetadata: {
          title: siteTitle
        } = {}
      } = {}
    } = {},
    location,
    pageContext: {
      next,
      previous
    } = {}
  } = props;
  const hasPreviousPost = !!Object.keys(previous || {}).length;
  const hasNextPost = !!Object.keys(next || {}).length;
  const postSlug = post.fields.slug;
  const docId = postSlug.substring(1, postSlug.length - 1);

  const [comments, setComments] = useState([]);

  useEffect(() => {
      const unsubscribe = firestore
        .doc(`posts/${docId}`)
        .collection('comments')
        .orderBy('time', 'desc')
        .onSnapshot(snapshot => {
          if (!snapshot.docs.length) return;
          const comments = snapshot.docs.map(s => ({id: s.id, ...s.data() }));
          setComments(comments);
        });

    return unsubscribe;
  }, [docId]);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <h1 style={{ marginTop: 0 }}>{post.frontmatter.title}</h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1)
        }}
      >
        {post.frontmatter.date}
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr
        style={{
          marginBottom: rhythm(1)
        }}
      />
      <Bio />

      <ul
        style={{
          ...(hasPreviousPost && hasNextPost
            ? {
                display: `flex`
              }
            : {}),
          fontSize: `.8em`,
          listStyle: `none`,
          padding: `1em 0`,
          margin: `1em 0 0`
        }}
      >
        {hasPreviousPost && (
          <li
            style={{
              ...(hasNextPost
                ? {
                    borderRight: `solid .01em #cccccc`
                  }
                : {}),
              flexBasis: 0,
              flexGrow: 1,
              paddingRight: `.5em`
            }}
          >
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          </li>
        )}
        {hasNextPost && (
          <li
            style={{
              ...(hasPreviousPost
                ? {
                    borderLeft: `solid .01em #cccccc`
                  }
                : {}),
              flexBasis: 0,
              flexGrow: 1,
              paddingLeft: `.5em`,
              textAlign: `right`
            }}
          >
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </Link>
          </li>
        )}
      </ul>
      <CommentForm docId={docId} />
      { comments.length ? (
        <Comments comments={comments} docId={docId} />
      ) : null }
    </Layout>
  );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
      fields {
        slug
      }
    }
  }
`;
