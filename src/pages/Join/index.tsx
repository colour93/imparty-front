import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { useInviteCodeInfo } from "../../hooks/useInviteCodeInfo";
import { Chip, CircularProgress, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { fetcher } from "../../utils/fetcher";
import { mutate } from "swr";

export const JoinPage: React.FC = () => {
  const { code } = useParams();

  const navigate = useNavigate();

  const { platformBaseinfo, isLoading: isPlatformBaseInfoLoading } =
    useInviteCodeInfo(code);

  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setIsLoading(true);

    const result = await fetcher("/platform/join/".concat(code ?? ""), {
      method: "post",
    });

    setIsLoading(false);

    if (result.code != 200) return;

    enqueueSnackbar("加入成功", {
      variant: "success",
    });

    mutate("/user");

    navigate(platformBaseinfo ? "/p/".concat(platformBaseinfo?.id) : "/");
  };

  return code && platformBaseinfo ? (
    isPlatformBaseInfoLoading ? (
      <div className="h-[calc(100vh-160px)] w-full flex flex-col gap-4 justify-center items-center">
        <CircularProgress />
      </div>
    ) : (
      <>
        <Helmet>
          <title>
            加入 {platformBaseinfo.name || platformBaseinfo.id} - Imparty
          </title>
        </Helmet>

        <div className="h-[calc(100vh-160px)] w-full flex flex-col gap-4 justify-center items-center">
          <div className="flex flex-col gap-2 items-center">
            <Typography variant="h5">
              {platformBaseinfo.name ?? "未命名 - ".concat(platformBaseinfo.id)}
            </Typography>
            <div>
              <Chip
                size="small"
                label={`ID: ${platformBaseinfo.id}`}
                onClick={async () => {
                  await navigator.clipboard.writeText(platformBaseinfo.id);
                  enqueueSnackbar("已复制", {
                    variant: "info",
                  });
                }}
              />
            </div>
            <span className="opacity-60 text-sm">
              创建于: {new Date(platformBaseinfo.createdAt).toLocaleString()}
            </span>
          </div>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={() => handleJoin()}
            loading={isLoading}
          >
            加入
          </LoadingButton>
        </div>
      </>
    )
  ) : (
    <div className="h-[calc(100vh-160px)] w-full flex flex-col gap-4 justify-center items-center">
      <Typography variant="h4">未找到该邀请码</Typography>
    </div>
  );
};
