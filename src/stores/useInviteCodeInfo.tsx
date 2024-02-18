import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import _ from "lodash";
import { PlatformBaseInfo } from "../typings/platform";

export const useInviteCodeInfo = (code?: string) => {
  const { data, error } = useSWR("/platform/join/".concat(code ?? ""), fetcher);

  const platformBaseinfo: PlatformBaseInfo | undefined = _.get(
    data,
    "data",
    undefined
  );

  return {
    platformBaseinfo,
    isLoading: !platformBaseinfo && !error,
    isError: error,
  };
};
