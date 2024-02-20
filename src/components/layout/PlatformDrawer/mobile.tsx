import { Drawer } from "@mui/material";
import React, { useContext } from "react";
import { PlatformDrawerContext } from "../../../main";
import classNames from "classnames";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const PlatformMobileDrawer: React.FC<Props> = ({
  children,
  className,
}) => {
  const { drawerVisible, setDrawerVisible } = useContext(PlatformDrawerContext);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerVisible(open);
    };
  return (
    <Drawer
      anchor="left"
      open={drawerVisible}
      onClose={toggleDrawer(false)}
      className={classNames('!w-[480px]', className)}
    >
      {children}
    </Drawer>
  );
};
