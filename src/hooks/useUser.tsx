import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import { UserInfo } from "../typings/user";
import _ from "lodash";
import { useLocation, useNavigate } from "react-router-dom";

export const useUser = () => {
  const { data, error } = useSWR("/user", fetcher);

  const user: UserInfo | undefined = _.get(data, "data", undefined);

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = encodeURI(location.pathname + location.search);

  if (!user && location.pathname != "/auth")
    navigate("/auth".concat(`?redirect=`).concat(redirect));

  return {
    user,
    isLoading: !user && !error,
    isError: error,
  };
};
