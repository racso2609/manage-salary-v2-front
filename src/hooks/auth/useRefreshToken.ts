import { useAtom } from "jotai";
import { sessionTokenAtom } from "../../stores/auth";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";

export type useRefreshToken = {
  handlers?: FnHandlers<undefined>;
};

const useRefreshToken = ({ handlers }: useRefreshToken = {}) => {
  const [sessionToken, setSessionToken] = useAtom(sessionTokenAtom);

  const handleSuccess = () => {
    if (handlers?.onSuccess) handlers?.onSuccess();
  };

  const handleError = (error: unknown) => {
    if (handlers?.onError) handlers?.onError(error);
  };

  const handleRefreshToken = async () => {
    try {
      const response = await manageSalaryFetcher<{ token: string }>(
        "/auth/refresh",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      const token = response.token;
      setSessionToken(token);
      handleSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  return { handleRefreshToken };
};

export default useRefreshToken;
