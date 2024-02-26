import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import _ from "lodash";
import { RoomInfo, RoomStatus } from "../typings/room";
import useLocalStorageState from "use-local-storage-state";

export const useRoomsUrl = (pid: string) => {
  const [statusFilter] = useLocalStorageState<RoomStatus | undefined>(
    `platform-${pid}.config.statusFilter`
  );
  return `/room/list/${pid}${statusFilter ? "?status=" + statusFilter : ""}`;
};

export const usePlatformRooms = (pid?: string) => {
  const { data, error } = useSWR(useRoomsUrl(pid ?? ""), fetcher);

  const rooms: RoomInfo[] | undefined = _.get(data, "data", undefined);

  return {
    rooms,
    isLoading: !rooms && !error,
    isError: error,
  };
};
