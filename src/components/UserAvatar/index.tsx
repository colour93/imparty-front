import { Avatar, Popover } from "@mui/material";
import React, { useState } from "react";
import { UserBaseInfo } from "../../typings/user";
import { BASE_URL } from "../../config";

interface Props {
  user?: UserBaseInfo | undefined;
  size?: number | string;
  showInfo?: boolean;
}

export const UserAvatar: React.FC<Props> = ({
  user,
  size = 32,
  showInfo = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return showInfo ? (
    <>
      <Avatar
        aria-owns={open ? user?.id.concat("user-avatar-popover") : undefined}
        aria-haspopup="true"
        sx={{
          width: size,
          height: size,
        }}
        alt={user?.name || user?.id || ""}
        src={user && BASE_URL.concat("/user/avatar/").concat(user.id)}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id={user?.id.concat("user-avatar-popover")}
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className="p-3 max-w-[160px] flex items-center gap-3">
          <UserAvatar user={user} size={36} />
          <div className="flex flex-col">
            <span className="font-bold text-sm">{user?.name}</span>
            <span className="opactiy-70 text-xs">{user?.id}</span>
          </div>
        </div>
      </Popover>
    </>
  ) : (
    <Avatar
      sx={{
        width: size,
        height: size,
      }}
      alt={user?.name || user?.id || ""}
      src={user && BASE_URL.concat("/user/avatar/").concat(user.id)}
    />
  );
};
