import { useAuthContext } from "../../context/AuthContext";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";

export type useSignup = {
  handlers?: FnHandlers<undefined>;
};

const useSignup = ({ handlers }: useSignup = {}) => {
  const { setSessionToken } = useAuthContext();

  const handleSuccess = () => {
    if (handlers?.onSuccess) handlers.onSuccess();
  };

  const handleError = (error: unknown) => {
    if (handlers?.onError) handlers.onError(error);
  };

  const handleSignup = async (data: {
    email: string;
    password: string;
    userName: string;
  }) => {
    try {
      if (!data.email || !data.password || !data.userName)
        throw new Error("No valid params");

      const response = await manageSalaryFetcher<{ token: string }>(
        "/auth/signup",
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

  return { handleSignup };
};

export default useSignup;
