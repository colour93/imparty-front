import { Modal, Backdrop, Fade, Box, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import { MODAL_BOX_STYLE, ModalFooter, ModalTitle } from "../frame";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlatformJoinModal: React.FC<Props> = ({ visible, setVisible }) => {
  const [code, setCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (code === "") {
      enqueueSnackbar("请检查表单", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    const result = await fetcher("/platform/join/".concat(code), {
      method: "post",
    });

    setIsLoading(false);

    if (result.code != 200) return;

    mutate("/user");
    enqueueSnackbar("加入成功", {
      variant: "success",
    });
    setVisible(false);
  };

  return (
    <Modal
      aria-labelledby="platform join modal title"
      aria-describedby="platform join modal description"
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
            <ModalTitle>加入平台</ModalTitle>
            <div className="flex flex-col gap-4">
              <TextField
                label="ID"
                name="id"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                helperText="一般为邀请码或者公开平台 ID"
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
