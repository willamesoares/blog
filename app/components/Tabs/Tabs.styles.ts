import { Link } from "remix";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  letter-spacing: 1.2px;
  align-items: center;
  border-bottom: 1px solid #d3d3d361;
`;

export const Tab = styled.h5<{ active: boolean }>`
  padding-top: .6rem;
  padding-bottom: .6rem;
  margin: 0;
  flex: 1;
  cursor: pointer;

  ${({ active }) => active && `
    box-shadow: 0px 2px 0px 0px #2ea086;
    border-bottom: 1px solid #2ea086;
  `}
`;

export const Label = styled(Link)`
  text-decoration: none;
  color: black;

  :visited {
    color: black;
  }
`;
