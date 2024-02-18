import { Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
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
      <IconButton
        aria-label="invite"
        onClick={() => {
          setVisible(true);
        }}
      >
        <Share />
      </IconButton>
      <PlatformInviteModal
        platform={platform}
        visible={visible}
        setVisible={setVisible}
      />
    </>
  );
};
