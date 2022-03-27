import styled from "styled-components";
import { device } from "~/styles/utils/device";

export const Wrapper = styled.div``;

export const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.8rem;

  a {
    color: #457be6;

    &:visited {
      color: purple;
    }
  }

  @media only screen and (${device.tablet.min}) {
    font-size: 1.7rem;
  }
`;

export const Subtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 1.1rem;
`;

export const Meta = styled.small`
  font-weight: bold;
`;

export const Tags = styled.div`
  display: inline-flex;
  gap: 0.5rem;
`;

export const Description = styled.p`
  margin-top: 0.5rem;
  font-size: 1.1rem;
`;
