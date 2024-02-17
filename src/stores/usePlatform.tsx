import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import _ from "lodash";
import { PlatformInfo } from "../typings/platform";

export const usePlatform = (id?: string) => {
  const { data, error } = useSWR("/platform/detail/".concat(id ?? ""), fetcher);

  const platform: PlatformInfo | undefined = _.get(data, "data", undefined);

  return {
    platform,
    isLoading: !platform && !error,
    isError: error,
  };
};
