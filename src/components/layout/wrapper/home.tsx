import React from "react";
import { HeaderBar } from "../HeaderBar";

interface Props {
  children: React.ReactNode;
}

export const HomeWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      <HeaderBar />
      {children}
    </>
  );
};
