import { useAuthContext } from "../../context/AuthContext";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { DeleteApiKeyResponse } from "../../types/manageSalaryTypes/apiKeys";

export type useDeleteApiKey = {
  handlers?: FnHandlers<DeleteApiKeyResponse>;
};

const useDeleteApiKey = ({ handlers }: useDeleteApiKey = {}) => {
  const { sessionToken } = useAuthContext();

  const onSuccess = (data: DeleteApiKeyResponse) => {
    if (handlers?.onSuccess) handlers.onSuccess(data);
  };

  const onError = (error: unknown) => {
    if (handlers?.onError) handlers.onError(error);
  };

  const handleDeleteApiKey = async (keyId: string): Promise<DeleteApiKeyResponse> => {
    try {
      if (!keyId) throw new Error("Invalid key ID");

      const response = await manageSalaryFetcher<DeleteApiKeyResponse>(`/auth/api-keys/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      onSuccess(response);
      return response;
    } catch (error) {
      onError(error);
      throw error;
    }
  };

  return { handleDeleteApiKey };
};

export default useDeleteApiKey;