import { TextField, Button } from "@mui/material";
import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { fetcher } from "../../../utils/fetcher";
import { mutate } from "swr";
import { CommonModal } from "../template";

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
    <CommonModal
      visible={visible}
      setVisible={setVisible}
      title="加入平台"
      footer={
        <>
          <Button onClick={() => setVisible(false)}>
            <span>取消</span>
          </Button>
          <LoadingButton loading={isLoading} onClick={() => handleSubmit()}>
            <span>加入</span>
          </LoadingButton>
        </>
      }
    >
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
    </CommonModal>
  );
};
