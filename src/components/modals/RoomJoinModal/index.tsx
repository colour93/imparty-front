import { Modal, Backdrop, Fade, Box, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import { MODAL_BOX_STYLE, ModalFooter, ModalTitle } from "../frame";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";
import { useParams } from "react-router";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RoomJoinModal: React.FC<Props> = ({ visible, setVisible }) => {
  const { pid } = useParams();
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

    mutate("/platform/detail/".concat(pid));
    enqueueSnackbar("加入成功", {
      variant: "success",
    });
    setVisible(false);
  };

  return (
    <Modal
      aria-labelledby="room join modal title"
      aria-describedby="room join modal description"
      open={visible}
      onClose={() => setVisible(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={visible}>
        <Box sx={MODAL_BOX_STYLE}>
          <div className="flex flex-col gap-6">
            <ModalTitle>加入房间</ModalTitle>
            <div className="flex flex-col gap-4">
              <TextField
                label="ID"
                name="id"
                value={rid}
                onChange={(e) => setRid(e.target.value)}
                required
              />
            </div>
            <ModalFooter>
              <Button onClick={() => setVisible(false)}>
                <span>取消</span>
              </Button>
              <LoadingButton loading={isLoading} onClick={() => handleSubmit()}>
                <span>加入</span>
              </LoadingButton>
            </ModalFooter>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
