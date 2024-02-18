import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../config";

export interface BaseResponse {
  code: number;
  msg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === "string") input = BASE_URL.concat(input);
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  });
  if (!response.ok) {
    enqueueSnackbar("网络请求错误，", {
      variant: "error",
    });
    throw new Error("Network response was not ok");
  }
  const data: BaseResponse = await response.json();
  if (data.code >= 300 && data.code < 400) {
    enqueueSnackbar(data.msg, {
      variant: "info",
    });
  }
  if (data.code >= 400 && data.code < 600) {
    enqueueSnackbar(data.msg, {
      variant: "error",
    });
  }
  return data;
};
