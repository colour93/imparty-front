import { Share } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { PlatformInfo } from "../../typings/platform";
import React, { useState } from "react";
import { PlatformInviteModal } from "../modals/PlatformInviteModal";

interface Props {
  platform: PlatformInfo;
}

export const PlatformInviteButton: React.FC<Props> = ({ platform }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Tooltip title="邀请加入平台">
        <IconButton
          aria-label="invite"
          onClick={() => {
            setVisible(true);
          }}
        >
          <Share />
        </IconButton>
      </Tooltip>
      <PlatformInviteModal
        platform={platform}
        visible={visible}
        setVisible={setVisible}
      />
    </>
  );
};
