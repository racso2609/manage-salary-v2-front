import { useAuthContext } from "../../context/AuthContext";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";

export type useRemoveTag = {
  handlers?: FnHandlers<undefined>;
};

const useRemoveTag = ({ handlers }: useRemoveTag = {}) => {
  const { sessionToken } = useAuthContext();

  const onSuccess = () => {
    if (handlers?.onSuccess) handlers.onSuccess();
  };
  const onError = (e: unknown) => {
    if (handlers?.onError) handlers.onError(e);
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      if (!tagId) throw new Error("Invalid tag");

      await manageSalaryFetcher(`/tags/${tagId}`, {
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

  return { handleRemoveTag };
};

export default useRemoveTag;
