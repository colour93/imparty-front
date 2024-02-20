import {
  TextField,
  SelectChangeEvent,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import _ from "lodash";
import { useState, ChangeEvent, useMemo } from "react";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";
import {
  PlatformInfo,
  PlatformVisible,
  VISIBLE_MAPPER,
} from "../../../typings/platform";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  platform?: PlatformInfo;
}

export const PlatformSettingModal: React.FC<Props> = ({
  visible,
  setVisible,
  platform,
}) => {
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const [formData, setFormData] = useState(
    _.pick(platform, ["name", "visible"])
  );

  useMemo(() => {
    if (visible) setFormData(_.pick(platform, ["name", "visible"]));
  }, [platform, visible]);

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isRequestLoading || !platform) {
      enqueueSnackbar("请等待加载完毕", {
        variant: "warning",
      });
      return;
    }

    setIsRequestLoading(true);

    const result = await fetcher("/platform/update/".concat(platform.id), {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsRequestLoading(false);

    if (result.code != 200) return;

    enqueueSnackbar("更新完毕", {
      variant: "success",
    });

    setVisible(false);

    mutate("/platform/detail/".concat(platform.id));
  };

  return (
    <Dialog open={visible} onClose={() => setVisible(false)}>
      <DialogTitle>设置</DialogTitle>
      <DialogContent>
        {!platform ? (
          <div className="h-[400px] flex justify-center items-center">
            加载中
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label="ID"
              helperText="创建后不允许更改"
              disabled
              value={platform.id}
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
                value={formData.visible}
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVisible(false)}>
          <span>取消</span>
        </Button>
        <LoadingButton
          loading={isRequestLoading}
          onClick={() => handleSubmit()}
        >
          <span>保存</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
