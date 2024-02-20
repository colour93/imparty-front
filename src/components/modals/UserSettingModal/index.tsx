import {
  TextField,
  SelectChangeEvent,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import { useUser } from "../../../stores/useUser";
import _ from "lodash";
import { useState, ChangeEvent, useMemo } from "react";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserSettingModal: React.FC<Props> = ({ visible, setVisible }) => {
  const { user, isLoading } = useUser();
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const [formData, setFormData] = useState(_.pick(user, ["name"]));

  useMemo(() => {
    if (visible) setFormData(_.pick(user, ["name"]));
  }, [user, visible]);

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isLoading || isRequestLoading) {
      enqueueSnackbar("请等待加载完毕", {
        variant: "warning",
      });
      return;
    }

    setIsRequestLoading(true);

    const result = await fetcher("/user/update", {
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

    mutate("/user");
  };

  return (
    <Dialog open={visible} onClose={() => setVisible(false)}>
      <DialogTitle>设置</DialogTitle>
      <DialogContent>
        {isLoading || !user ? (
          <div className="h-[400px] flex justify-center items-center">
            加载中
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label="ID"
              helperText="注册后不允许更改"
              disabled
              value={user.id}
            />
            <TextField
              label="昵称"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
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
