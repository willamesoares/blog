import styled from "styled-components";
import { device } from "~/styles/utils/device";

export const Wrapper = styled.div`
  padding: 5.313rem 1.125rem 5rem;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;

  @media only screen and (${device.tablet.min}) {
    padding: 7.313rem 1.125rem 5rem;
  }
`;
