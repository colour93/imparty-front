import {
  Modal,
  Backdrop,
  Fade,
  Box,
  TextField,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { MODAL_BOX_STYLE, ModalFooter, ModalTitle } from "../frame";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { DateTimePicker } from "@mui/x-date-pickers";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";
import { useParams } from "react-router";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RoomCreateModal: React.FC<Props> = ({ visible, setVisible }) => {
  const { pid } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    game: "",
    startAt: "",
    endAt: "",
    total: 0,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!pid) {
      enqueueSnackbar("无法获取平台 ID", {
        variant: "error",
      });
      return;
    }

    if (formData.name === "" || formData.game === "") {
      enqueueSnackbar("请检查表单", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    const result = await fetcher("/room/new/".concat(pid), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsLoading(false);

    if (result.code != 200) return;

    mutate("/platform/detail/".concat(pid));
    enqueueSnackbar("创建成功", {
      variant: "success",
    });
    setVisible(false);
  };

  return (
    <Modal
      aria-labelledby="room create modal title"
      aria-describedby="room create modal description"
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
            <ModalTitle>新建房间</ModalTitle>
            <div className="flex flex-col gap-4">
              <TextField
                label="名称"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="游戏"
                name="game"
                value={formData.game}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="详情"
                name="description"
                multiline
                value={formData.description}
                onChange={handleInputChange}
              />
              <TextField
                type="number"
                label="人数限制"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
                helperText="为 0 则为不限人数"
              />
              <div className="flex justify-between">
                <DateTimePicker
                  label="开始时间"
                  name="startAt"
                  onChange={(e) => {
                    if (!e) return;
                    setFormData({ ...formData, startAt: e.toString() });
                  }}
                />
                <DateTimePicker
                  label="结束时间"
                  name="endAt"
                  onChange={(e) => {
                    if (!e) return;
                    setFormData({ ...formData, endAt: e.toString() });
                  }}
                />
              </div>
            </div>
            <ModalFooter>
              <Button onClick={() => setVisible(false)}>
                <span>取消</span>
              </Button>
              <LoadingButton loading={isLoading} onClick={() => handleSubmit()}>
                <span>新建</span>
              </LoadingButton>
            </ModalFooter>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
