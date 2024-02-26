import {
  AvatarGroup,
  Card,
  Chip,
  IconButton,
  Popover,
  Skeleton,
  Tooltip,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { UserAvatar } from "../UserAvatar";
import { momentZh } from "../../utils/moment";
import { LoadingButton } from "@mui/lab";
import { RoomInfo } from "../../typings/room";
import { useUser } from "../../hooks/useUser";
import { enqueueSnackbar } from "notistack";
import { fetcher } from "../../utils/fetcher";
import { mutate } from "swr";
import { useParams } from "react-router";
import { Info } from "@mui/icons-material";
import { RoomInfoContent } from "../RoomInfoContent";
import { useRoomsUrl } from "../../hooks/usePlatformRooms";
import { IDChip } from "../Chips/id";
import { TimeChip } from "../Chips/time";

interface Props {
  room: RoomInfo;
}

export const RoomCard: React.FC<Props> = ({ room }) => {
  const { user } = useUser();
  const { pid } = useParams();
  const roomsUrl = useRoomsUrl(pid ?? "");

  const isIn = useMemo(
    () => room.users.find((u) => u.id === user?.id),
    [room.users, user]
  );

  const isFull = useMemo(
    () =>
      Boolean(room.total && room.total > 0 && room.users.length >= room.total),
    [room.total, room.users]
  );

  const isExpired = useMemo(
    () => Date.now() > new Date(room.endAt).getTime(),
    [room.endAt]
  );

  const isPlaying = useMemo(
    () =>
      new Date(room.startAt).getTime() < Date.now() &&
      new Date(room.endAt).getTime() > Date.now(),
    [room.startAt, room.endAt]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "room-info-popover" : undefined;

  const handleSubmit = async () => {
    if (!isIn && isFull) {
      enqueueSnackbar("房间人已满", {
        variant: "error",
      });
      return;
    }

    if (!isIn && isExpired) {
      enqueueSnackbar("房间已过期", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    const result = await fetcher(
      isIn ? "/room/quit/".concat(room.id) : "/room/join/".concat(room.id),
      {
        method: "post",
      }
    );

    setIsLoading(false);

    if (result.code != 200) return;

    enqueueSnackbar("操作成功", {
      variant: "success",
    });

    if (pid) mutate(roomsUrl);
    else mutate("/user");
  };

  return (
    <>
      <Card variant="outlined" className="py-3 px-4 flex flex-col gap-3 w-72">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{room.name ?? room.id}</span>
          <div className="flex gap-1 items-center">
            {isExpired && <Chip size="small" color="error" label="已过期" />}
            {isFull && <Chip size="small" color="warning" label="已满员" />}
            {isPlaying && <Chip size="small" color="success" label="进行中" />}
            <Tooltip title="更多信息">
              <IconButton
                size="small"
                aria-label="room-info"
                onClick={handleClick}
              >
                <Info fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <IDChip id={room.id} />
          </div>
          <div>
            <Chip size="small" variant="outlined" label={room.game} />
          </div>
          <div className="flex justify-between items-center">
            <TimeChip time={room.startAt} type="start" />
            <span className="opacity-80 text-xs">
              {momentZh(room.endAt).diff(momentZh(room.startAt), "hours")} 小时
            </span>
            <TimeChip time={room.endAt} type="end" />
          </div>
        </div>
        <AvatarGroup
          max={8}
          className="h-[32px]"
          componentsProps={{
            additionalAvatar: {
              sx: { width: 32, height: 32, fontSize: "0.9rem" },
            },
          }}
        >
          {(room.users ?? []).map((user) => (
            <UserAvatar key={user.id} user={user} showInfo />
          ))}
        </AvatarGroup>
        <div className="flex justify-between items-center gap-2">
          <span className="opacity-80 text-sm">
            {`${room.users.length} / ${room.total > 0 ? room.total : "♾️"}`}
          </span>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            size="small"
            color={isIn ? "error" : "primary"}
            disabled={(isFull && !isIn) || isExpired}
            onClick={() => {
              handleSubmit();
            }}
          >
            <span>{isIn ? "退出" : "加入"}</span>
          </LoadingButton>
        </div>
      </Card>
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className="w-[200px]">
          <RoomInfoContent room={room} />
        </div>
      </Popover>
    </>
  );
};

export const RoomCardSkeleton: React.FC = () => {
  return (
    <Card variant="outlined">
      <Skeleton animation="wave" variant="text" width="3rem" height="3rem" />
      <Skeleton animation="wave" variant="text" width="2rem" height="2.5rem" />
      <Skeleton animation="wave" variant="text" width="6rem" height="2.5rem" />
    </Card>
  );
};
