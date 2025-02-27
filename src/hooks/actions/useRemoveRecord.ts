import { useAuthContext } from "../../context/AuthContext";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";

export type useRemoveRecord = {
  handlers?: FnHandlers<undefined>;
};

const useRemoveRecord = ({ handlers }: useRemoveRecord = {}) => {
  const { sessionToken } = useAuthContext();

  const onSuccess = () => {
    if (handlers?.onSuccess) handlers.onSuccess();
  };
  const onError = (e: unknown) => {
    if (handlers?.onError) handlers.onError(e);
  };

  const handleRemoveRecord = async (recordId: string) => {
    try {
      if (!recordId) throw new Error("Invalid record");

      await manageSalaryFetcher(`/records/${recordId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  return { handleRemoveRecord };
};

export default useRemoveRecord;
