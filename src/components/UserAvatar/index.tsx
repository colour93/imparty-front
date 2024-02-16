import { Avatar } from "@mui/material";
import React from "react";
import { UserBaseInfo } from "../../typings/user";
import { BASE_URL } from "../../config";

interface Props {
  user?: UserBaseInfo | undefined;
}

export const UserAvatar: React.FC<Props> = ({ user }) => {
  return (
    <Avatar
      alt={user?.name || user?.id || ""}
      src={user && BASE_URL.concat("/user/avatar/").concat(user.id)}
    />
  );
};
