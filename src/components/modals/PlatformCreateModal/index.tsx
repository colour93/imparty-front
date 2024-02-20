import {
  TextField,
  Button,
  FormControl,
  SelectChangeEvent,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { ChangeEvent, useMemo, useState } from "react";
import { idRegex } from "../../../utils/regex";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";
import { PlatformVisible, VISIBLE_MAPPER } from "../../../typings/platform";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlatformCreateModal: React.FC<Props> = ({
  visible,
  setVisible,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    visible: "public",
  });

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
    <Dialog open={visible} onClose={() => setVisible(false)}>
      <DialogTitle>创建平台</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 mt-2">
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
            <FormLabel id="platform-visible-radio-buttons-group-label">
              可见范围
            </FormLabel>
            <RadioGroup
              aria-labelledby="platform-visible-radio-buttons-group-label"
              defaultValue="public"
              name="visible"
              row
              onChange={handleInputChange}
            >
              {Object.keys(VISIBLE_MAPPER).map((key) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={VISIBLE_MAPPER[key as PlatformVisible].label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVisible(false)}>
          <span>取消</span>
        </Button>
        <LoadingButton loading={isLoading} onClick={() => handleSubmit()}>
          <span>新建</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
