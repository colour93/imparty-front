import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import { UserInfo } from "../typings/user";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

export const useUser = () => {
  const { data, error } = useSWR("/user", fetcher);

  const user: UserInfo | undefined = _.get(data, "data", undefined);

  const navigate = useNavigate();

  if (!user) navigate("/auth");

  return {
    user: user,
    isLoading: !user && !error,
    isError: error,
  };
};
