import { To, useNavigate } from 'react-router-dom';
import useQuery from './useQuery';

type ToFunction = (to: To, state?: any, replace?: boolean) => void | (() => void);

const useRouter = () => {
  const navigate = useNavigate();

  const to: ToFunction = (to, state, replace) => {
    navigate(to, { state, replace });
  };

  const replace = (toParam: To, state?: unknown) => {
    to(toParam, state, true);
  };

  const query = useQuery();

  return {
    to,
    replace,
    query,
    push: to,
  };
};

export default useRouter;
