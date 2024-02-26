import React, { useState } from "react";
import { RoomInfo } from "../../typings/room";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import {
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { UserAvatar } from "../UserAvatar";
import { Delete, Settings } from "@mui/icons-material";
import { fetcher } from "../../utils/fetcher";
import { enqueueSnackbar } from "notistack";
import { mutate } from "swr";
import { useRoomsUrl } from "../../hooks/usePlatformRooms";
import { useParams } from "react-router";

interface Props {
  room: RoomInfo;
}

const renderRow = (props: ListChildComponentProps) => {
  const { index, style, data } = props;

  return (
    <ListItem key={index} disablePadding dense style={style}>
      <ListItemButton>
        <ListItemAvatar>
          <UserAvatar user={data[index]} size={36} />
        </ListItemAvatar>
        <ListItemText
          primary={data[index].name ?? data[index].id}
          secondary={data[index].id}
        />
      </ListItemButton>
    </ListItem>
  );
};

export const RoomInfoContent: React.FC<Props> = ({ room }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { pid } = useParams();
  const roomUrl = useRoomsUrl(pid ?? "");

  const handleDeleteRoom = async () => {
    setIsLoading(true);

    const result = await fetcher("/room/delete/".concat(room.id), {
      method: "delete",
    });

    setIsLoading(false);

    if (result.code != 200) return;

    enqueueSnackbar("操作成功", {
      variant: "success",
    });

    if (pid) mutate(roomUrl);
    mutate("/user");
  };

  return (
    <div className="flex flex-col">
      <div className="p-3 flex justify-between">
        <span className="cursor-default">房间信息</span>
        <div>
          <Tooltip title="设置信息">
            <IconButton size="small" disabled>
              <Settings fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除房间">
            <IconButton
              size="small"
              onClick={() => handleDeleteRoom()}
              disabled={isLoading}
            >
              <Delete fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <Divider />
      {room.users.length > 0 ? (
        <FixedSizeList
          height={room.users.length * 64 > 300 ? 300 : room.users.length * 64}
          width={200}
          itemSize={64}
          itemCount={room.users.length}
          overscanCount={4}
          itemData={room.users}
          className="no-scrollbar"
        >
          {renderRow}
        </FixedSizeList>
      ) : (
        <span className="p-4 w-full text-center text-xs opacity-70 cursor-default">
          还没有人加入哦
        </span>
      )}
    </div>
  );
};
