import { Toolbar } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const MainContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="p-6 flex-1">
      <Toolbar />
      {children}
    </div>
  );
};
