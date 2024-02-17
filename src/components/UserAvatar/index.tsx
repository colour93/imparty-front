import { Avatar } from "@mui/material";
import React from "react";
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
  return showInfo ? (
    <>
      <Avatar
        sx={{
          width: size,
          height: size,
        }}
        alt={user?.name || user?.id || ""}
        src={user && BASE_URL.concat("/user/avatar/").concat(user.id)}
      />
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
