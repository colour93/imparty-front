import { IconButton, Tooltip } from "@mui/material";
import { PlatformInfo } from "../../typings/platform";
import React from "react";
import useLocalStorageState from "use-local-storage-state";
import { RoomStatus } from "../../typings/room";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  platform: PlatformInfo;
}

export const PlatformStatusFilterButton: React.FC<Props> = ({ platform }) => {
  const [statusFilter, setStatusFilter] = useLocalStorageState<
    RoomStatus | undefined
  >(`platform-${platform.id}.config.statusFilter`);

  return (
    <Tooltip
      title={
        !statusFilter || statusFilter === "active"
          ? "显示已过期房间"
          : "隐藏已过期房间"
      }
    >
      <IconButton
        aria-label="status filter"
        onClick={() => {
          setStatusFilter(
            !statusFilter || statusFilter === "active" ? "all" : "active"
          );
        }}
      >
        {!statusFilter || statusFilter === "active" ? (
          <Visibility />
        ) : (
          <VisibilityOff />
        )}
      </IconButton>
    </Tooltip>
  );
};
