import { useLocation, useParams } from "react-router-dom";

const useQuery = () => {
  const params = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const queryParamsObj: Record<string, string | number> = {};
  for (const [key, value] of queryParams.entries()) {
    queryParamsObj[key] = value;
  }
  return Object.assign(queryParamsObj, params);
};

export default useQuery;
