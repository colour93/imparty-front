import { Drawer } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const PlatformPcDrawer: React.FC<Props> = ({ children, className }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
        },
      }}
      className={className}
    >
      {children}
    </Drawer>
  );
};
