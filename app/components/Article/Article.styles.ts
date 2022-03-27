import styled from "styled-components";

export const Wrapper = styled.article`
  margin: 1rem 0;
`;

export const Title = styled.h2``;

export const Meta = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
`;

export const Tags = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
`;

export const Content = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 2.5rem;
  }

  p {
    margin-top: 1.8rem;
  }

  img {
    margin: 0 auto;
    max-height: 35rem;
  }

  code:not([class]) {
    background-color: #e9e9e9;
    font-size: 80%;
    padding: 2px 4px;
  }

  pre {
    font-size: 1rem;
  }

  ul li {
    padding-bottom: 0.5rem;
  }
`;
