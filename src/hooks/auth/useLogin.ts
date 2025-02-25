import { useAuthContext } from "../../context/AuthContext";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";

export type useLogin = {
  handlers?: FnHandlers<undefined>;
};

const useLogin = ({ handlers }: useLogin = {}) => {
  const { setSessionToken } = useAuthContext();

  const handleSuccess = () => {
    if (handlers?.onSuccess) handlers.onSuccess();
  };

  const handleError = (error: unknown) => {
    if (handlers?.onError) handlers.onError(error);
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await manageSalaryFetcher<{ token: string }>(
        "/auth/login",
        {
          body: data,
        },
      );

      const token = response.token;
      setSessionToken(token);
      handleSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  return { handleLogin };
};

export default useLogin;
