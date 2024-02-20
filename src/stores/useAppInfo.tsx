import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import _ from "lodash";
import { AppInfo } from "../typings/appInfo";

export const useAppInfo = () => {
  const { data, error } = useSWR("/", fetcher);

  const appInfo: AppInfo = _.get(data, "data", undefined);

  return {
    appInfo,
    isLoading: !appInfo && !error,
    isError: error,
  };
};
