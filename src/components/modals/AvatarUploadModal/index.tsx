import React, { ChangeEvent, useMemo, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../../config";
import { LoadingButton } from "@mui/lab";
import { CloudUpload } from "@mui/icons-material";
import { fetcher } from "../../../utils/fetcher";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userId?: string;
}

export const AvatarUploadModal: React.FC<Props> = ({
  visible,
  setVisible,
  userId,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const rawImage = useMemo(
    () => (userId ? BASE_URL.concat("/user/avatar/").concat(userId) : ""),
    [userId]
  );

  const selectImageRef = useRef<File | undefined>();
  const [selectImageUrl, setSelectImageUrl] = useState<string | undefined>();

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setIsLoading(true);

      cropperRef.current?.cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (!blob) {
          setIsLoading(false);
          enqueueSnackbar("裁切时出现错误", {
            variant: "error",
          });
          return;
        }

        const formData = new FormData();

        formData.append("avatar", blob);

        const reuslt = await fetcher("/user/upload_avatar", {
          method: "post",
          body: formData,
        });

        setIsLoading(false);

        if (reuslt.code != 200) return;

        enqueueSnackbar("上传成功，刷新后生效", {
          variant: "success",
        });

        setVisible(false);
      });
    } else {
      enqueueSnackbar("出现错误", {
        variant: "error",
      });
      return;
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    selectImageRef.current = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e?.target?.result;
      setSelectImageUrl((url as string | null | undefined) ?? undefined);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={visible} onClose={() => setVisible(false)}>
      <DialogTitle>修改头像</DialogTitle>
      <DialogContent>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex flex-row md:flex-col items-center justify-center gap-5">
            <div className="img-preview md:mb-4 size-20 md:36 overflow-hidden rounded-full"></div>

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUpload />}
            >
              选择本地文件
              <input
                aria-label="upload avatar"
                className="h-1 w-1 overflow-hidden absolute bottom-0 left-0 whitespace-nowrap"
                style={{ clip: "rect(0 0 0 0)", clipPath: "inset(50%)" }}
                type="file"
                name="avatar"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileSelect}
              />
            </Button>
          </div>
          <Cropper
            width={400}
            ref={cropperRef}
            src={selectImageUrl ?? rawImage}
            guides={true}
            className="h-80 overflow-clip rounded"
            aspectRatio={1}
            viewMode={1}
            preview={".img-preview"}
            minCropBoxHeight={64}
            minCropBoxWidth={64}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVisible(false)}>
          <span>取消</span>
        </Button>
        <LoadingButton loading={isLoading} onClick={() => handleConfirm()}>
          <span>确定</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
