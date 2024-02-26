import {
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";
import { useParams } from "react-router";
import { useRoomsUrl } from "../../../hooks/usePlatformRooms";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RoomJoinModal: React.FC<Props> = ({ visible, setVisible }) => {
  const { pid } = useParams();
  const roomsUrl = useRoomsUrl(pid ?? "");
  const [rid, setRid] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pid) {
      enqueueSnackbar("无法获取平台 ID", {
        variant: "error",
      });
      return;
    }

    if (rid === "") {
      enqueueSnackbar("请检查表单", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    const result = await fetcher("/room/join/".concat(rid), {
      method: "post",
    });

    setIsLoading(false);

    if (result.code != 200) return;

    mutate(roomsUrl);
    enqueueSnackbar("加入成功", {
      variant: "success",
    });
    setVisible(false);
  };

  return (
    <Dialog open={visible} onClose={() => setVisible(false)}>
      <DialogTitle>加入房间</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 mt-2">
          <TextField
            label="ID"
            name="id"
            value={rid}
            onChange={(e) => setRid(e.target.value)}
            required
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVisible(false)}>
          <span>取消</span>
        </Button>
        <LoadingButton loading={isLoading} onClick={() => handleSubmit()}>
          <span>加入</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
