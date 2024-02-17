import React from "react";
import { HeaderBar } from "../HeaderBar";
import { MainContainer } from "../MainContainer";

interface Props {
  children: React.ReactNode;
}

export const HomeWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      <MainContainer>
        <HeaderBar />
        {children}
      </MainContainer>
    </>
  );
};
