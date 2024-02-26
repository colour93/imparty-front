import { Chip, Tooltip } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React from "react";

interface Props {
  id: string;
}

export const IDChip: React.FC<Props> = ({ id }) => (
  <Tooltip title="点击复制">
    <Chip
      size="small"
      label={`ID: ${id}`}
      onClick={async () => {
        await navigator.clipboard.writeText(id);
        enqueueSnackbar("已复制", {
          variant: "info",
        });
      }}
    />
  </Tooltip>
);
