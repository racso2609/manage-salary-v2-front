import { useAuthContext } from "../../context/AuthContext";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";

export type useCreateTag = { handlers?: FnHandlers<undefined> };

const useCreateTag = ({ handlers }: useCreateTag = {}) => {
  const { sessionToken } = useAuthContext();
  const onSuccess = () => {
    if (handlers?.onSuccess) handlers.onSuccess();
  };

  const onError = (error: unknown) => {
    if (handlers?.onError) handlers.onError(error);
  };

  const handleCreateTag = async (data: { name: string }) => {
    try {
      const response = await manageSalaryFetcher("/tags", {
        body: data,
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      console.log("=== response", response);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };
  return { handleCreateTag };
};

export default useCreateTag;
