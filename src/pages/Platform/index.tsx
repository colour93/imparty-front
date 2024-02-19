import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { usePlatform } from "../../stores/usePlatform";
import { useParams } from "react-router";
import {
  Chip,
  Skeleton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { RoomCard } from "../../components/RoomCard";
import { AddCircleOutline, Login } from "@mui/icons-material";
import { RoomCreateModal } from "../../components/modals/RoomCreateModal";
import { enqueueSnackbar } from "notistack";
import { RoomJoinModal } from "../../components/modals/RoomJoinModal";
import { VISIBLE_MAPPER } from "../../typings/platform";
import { PlatformInviteButton } from "../../components/PlatformButtons/invite";
import { PlatformMoreButton } from "../../components/PlatformButtons/more";

export const PlatformPage: React.FC = () => {
  const { pid } = useParams();

  const { platform, isLoading } = usePlatform(pid);

  const [sppedDialVisible, setSpeedDialVisible] = useState(false);
  const [roomCreateModalVisible, setRoomCreateModalVisible] = useState(false);
  const [roomJoinModalVisible, setRoomJoinModalVisible] = useState(false);

  return isLoading ? (
    <>
      <Helmet>
        <title>加载中... - Imparty</title>
      </Helmet>
      <div className="flex flex-col">
        <Skeleton animation="wave" variant="text" width="8rem" height="3rem" />
        <Skeleton animation="wave" variant="text" width="5rem" height="2rem" />
        <Skeleton
          animation="wave"
          variant="text"
          width="6rem"
          height="1.5rem"
        />
      </div>
    </>
  ) : (
    <>
      <Helmet>
        <title>{platform?.name || platform?.id || "平台"} - Imparty</title>
      </Helmet>

      <RoomCreateModal
        visible={roomCreateModalVisible}
        setVisible={setRoomCreateModalVisible}
      />
      <RoomJoinModal
        visible={roomJoinModalVisible}
        setVisible={setRoomJoinModalVisible}
      />

      <SpeedDial
        ariaLabel="room control button"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={() => {
          setSpeedDialVisible(false);
        }}
        onOpen={() => {
          setSpeedDialVisible(true);
        }}
        open={sppedDialVisible}
      >
        <SpeedDialAction
          key="create-room"
          icon={<AddCircleOutline />}
          tooltipTitle={"创建房间"}
          tooltipOpen
          onClick={() => setRoomCreateModalVisible(true)}
        />
        <SpeedDialAction
          key="join-room"
          icon={<Login />}
          tooltipTitle={"加入房间"}
          tooltipOpen
          onClick={() => setRoomJoinModalVisible(true)}
        />
      </SpeedDial>

      <div className="flex justify-between mb-4 items-center">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold">{platform?.name || platform?.id}</p>
          <div className="flex gap-2">
            <Chip
              size="small"
              label={`ID: ${platform?.id}`}
              onClick={async () => {
                if (platform) {
                  await navigator.clipboard.writeText(platform.id);
                  enqueueSnackbar("已复制", {
                    variant: "info",
                  });
                }
              }}
            />
            <Chip
              size="small"
              label={`可见范围: ${
                platform ? VISIBLE_MAPPER[platform?.visible].label : "未知"
              }`}
              color={
                platform ? VISIBLE_MAPPER[platform?.visible].color : "default"
              }
            />
          </div>
          <span className="opacity-60 text-sm">
            创建于:{" "}
            {platform &&
              platform.createdAt &&
              new Date(platform.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="flex">
          {!isLoading &&
            platform &&
            ["public", "invite-only"].includes(platform.visible) && (
              <PlatformInviteButton platform={platform} />
            )}
          <PlatformMoreButton platform={platform} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {(platform?.rooms ?? []).map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </>
  );
};
