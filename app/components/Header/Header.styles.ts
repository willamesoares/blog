import styled from "styled-components";
import { device } from "~/styles/utils/device";

export const Wrapper = styled.div`
  background-color: #f1f9f7;
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
`;

export const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
  padding-right: 1.125rem;
  padding-left: 1.125rem;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  letter-spacing: 3px;
  cursor: pointer;

  @media only screen and (${device.tablet.min}) {
    font-size: 1.8rem;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: .5rem;

  img {
    width: 1.3rem;
    height: 1.3rem;
    cursor: pointer;
  }

  @media only screen and (${device.tablet.min}) {
    gap: 1rem;
  }
`;
