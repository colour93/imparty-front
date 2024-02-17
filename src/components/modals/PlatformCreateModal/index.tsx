import {
  Modal,
  Backdrop,
  Fade,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { ChangeEvent, useMemo, useState } from "react";
import { MODAL_BOX_STYLE, ModalFooter, ModalTitle } from "../frame";
import { idRegex } from "../../../utils/regex";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlatformCreateModal: React.FC<Props> = ({
  visible,
  setVisible,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    visible: "public",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const idError = useMemo(() => !idRegex.test(formData.id), [formData]);

  const handleSubmit = async () => {
    if (idError) {
      enqueueSnackbar("请检查表单", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    const result = await fetcher("/platform/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsLoading(false);

    if (result.code != 200) return;

    mutate("/user");
    enqueueSnackbar("创建成功", {
      variant: "success",
    });
    setVisible(false);
  };

  return (
    <Modal
      aria-labelledby="platform create modal title"
      aria-describedby="platform create modal description"
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
            <ModalTitle>新建平台</ModalTitle>
            <div className="flex flex-col gap-4">
              <TextField
                label="ID"
                name="id"
                error={idError}
                helperText={idError && "ID 应为 3-16 位英文字母、数字与下划线"}
                required
                value={formData.id}
                onChange={handleInputChange}
              />
              <TextField
                label="名称"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <FormControl fullWidth required>
                <InputLabel id="platform-create-modal-visible-select-label">
                  可见范围
                </InputLabel>
                <Select
                  labelId="platform-create-modal-visible-select-label"
                  name="visible"
                  label="可见范围"
                  value={formData.visible}
                  onChange={handleInputChange}
                >
                  <MenuItem value="public">公开</MenuItem>
                  <MenuItem value="invite-only">仅邀请</MenuItem>
                  <MenuItem value="private">私人</MenuItem>
                </Select>
              </FormControl>
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
