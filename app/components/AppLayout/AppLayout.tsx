import React, { PropsWithChildren } from "react";

import * as S from "./AppLayout.styles";

const AppLayout = ({ children }: PropsWithChildren<{}>) => {
  return <S.Wrapper>{children}</S.Wrapper>;
};

export default AppLayout;
