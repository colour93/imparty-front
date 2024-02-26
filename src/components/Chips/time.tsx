import { Chip, Tooltip } from "@mui/material";
import React from "react";
import { momentZh } from "../../utils/moment";

interface Props {
  time: moment.MomentInput;
  type: "start" | "end";
}

export const TimeChip: React.FC<Props> = ({ time, type }) => {
  const m = momentZh(time);
  return (
    <Tooltip
      title={(
        (type === "start" && "开始") ||
        (type === "end" && "结束") ||
        ""
      ).concat(` ${m.format("YYYY/MM/DD HH:mm")}`)}
    >
      <Chip
        size="small"
        variant="outlined"
        color={
          (type === "start" && "primary") ||
          (type === "end" && "warning") ||
          "default"
        }
        label={m.calendar()}
      />
    </Tooltip>
  );
};
