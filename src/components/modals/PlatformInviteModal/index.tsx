import React, { ChangeEvent, useMemo, useState } from "react";
import { PlatformInfo, PlatformInviteInfo } from "../../../typings/platform";
import {
  Alert,
  AlertTitle,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { CommonModal } from "../template";
import { DateTimePicker } from "@mui/x-date-pickers";
import { fetcher } from "../../../utils/fetcher";
import { enqueueSnackbar } from "notistack";
import { ContentCopy } from "@mui/icons-material";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  platform?: PlatformInfo;
}

export const PlatformInviteModal: React.FC<Props> = ({
  platform,
  visible,
  setVisible,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [code, setCode] = useState<string | undefined>();

  const [formData, setFormData] = useState<PlatformInviteInfo>({
    expiredMode: "date",
    expiredAt: undefined,
    expiredCount: undefined,
  });

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useMemo(() => {
    if (visible) setCode(undefined);
  }, [visible]);

  const handleSubmit = async () => {
    if (!platform) {
      enqueueSnackbar("请等待数据加载完毕", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    const result = await fetcher(`/platform/invite/${platform.id}/new`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsLoading(false);

    if (result.code != 200) return;

    enqueueSnackbar("创建成功", {
      variant: "success",
    });

    setCode(result.data.code);
  };

  return (
    <CommonModal
      visible={visible}
      setVisible={setVisible}
      title="邀请"
      footer={
        <>
          {code ? (
            <>
              <Button onClick={() => setVisible(false)}>
                <span>关闭</span>
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setVisible(false)}>
                <span>取消</span>
              </Button>
              <LoadingButton loading={isLoading} onClick={() => handleSubmit()}>
                <span>生成邀请</span>
              </LoadingButton>
            </>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {code ? (
          <>
            <FormControl>
              <InputLabel htmlFor="invite-code-input">邀请码</InputLabel>
              <OutlinedInput
                id="invite-code-input"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={async () => {
                        await navigator.clipboard.writeText(code);
                        enqueueSnackbar("已复制", {
                          variant: "info",
                        });
                      }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                }
                readOnly
                value={code}
                label="邀请码"
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="invite-code-url-input">邀请链接</InputLabel>
              <OutlinedInput
                id="invite-code-url-input"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          window.location.origin.concat("/join/").concat(code)
                        );
                        enqueueSnackbar("已复制", {
                          variant: "info",
                        });
                      }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                }
                readOnly
                value={window.location.origin.concat("/join/").concat(code)}
                label="邀请链接"
              />
            </FormControl>
          </>
        ) : (
          <>
            {platform?.visible === "public" && (
              <Alert security="success" icon={false} className="[&>div]:w-full">
                <div className="flex flex-col gap-2">
                  <AlertTitle>
                    本平台为公开平台，可通过以下链接直接加入
                  </AlertTitle>
                  <FormControl>
                    <InputLabel htmlFor="public-url-input">公开链接</InputLabel>
                    <OutlinedInput
                      id="public-url-input"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={async () => {
                              await navigator.clipboard.writeText(
                                window.location.origin
                                  .concat("/join/")
                                  .concat(platform.id)
                              );
                              enqueueSnackbar("已复制", {
                                variant: "info",
                              });
                            }}
                          >
                            <ContentCopy />
                          </IconButton>
                        </InputAdornment>
                      }
                      readOnly
                      value={window.location.origin
                        .concat("/join/")
                        .concat(platform.id)}
                      label="公开链接"
                    />
                  </FormControl>
                </div>
              </Alert>
            )}
            <FormControl required>
              <FormLabel id="expired-mode-radio-buttons-group-label">
                过期方式
              </FormLabel>
              <RadioGroup
                aria-labelledby="expired-mode-radio-buttons-group-label"
                defaultValue="date"
                name="expiredMode"
                row
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="date"
                  control={<Radio />}
                  label="日期"
                />
                <FormControlLabel
                  value="count"
                  control={<Radio />}
                  label="次数"
                />
              </RadioGroup>
            </FormControl>
            {formData.expiredMode === "date" && (
              <DateTimePicker
                aria-labelledby="expired-date-label"
                label="结束时间"
                name="startAt"
                onChange={(e) => {
                  if (!e) return;
                  setFormData({ ...formData, expiredAt: e.toString() });
                }}
              />
            )}
            {formData.expiredMode === "count" && (
              <TextField
                type="number"
                label="可使用次数"
                name="expiredCount"
                required
                onChange={(e) => {
                  if (!e) return;
                  setFormData({
                    ...formData,
                    expiredCount: parseInt(e.target.value),
                  });
                }}
              />
            )}
          </>
        )}
      </div>
    </CommonModal>
  );
};
