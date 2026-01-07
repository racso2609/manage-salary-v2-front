import { useAuthContext } from "../../context/AuthContext";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { UpdateApiKeyRequest, UpdateApiKeyResponse } from "../../types/manageSalaryTypes/apiKeys";

export type useUpdateApiKey = { handlers?: FnHandlers<UpdateApiKeyResponse> };

const useUpdateApiKey = ({ handlers }: useUpdateApiKey = {}) => {
  const { sessionToken } = useAuthContext();

  const onSuccess = (data: UpdateApiKeyResponse) => {
    if (handlers?.onSuccess) handlers.onSuccess(data);
  };

  const onError = (error: unknown) => {
    if (handlers?.onError) handlers.onError(error);
  };

  const handleUpdateApiKey = async (keyId: string, data: UpdateApiKeyRequest): Promise<UpdateApiKeyResponse> => {
    try {
      if (!keyId) throw new Error("Invalid key ID");

      const response = await manageSalaryFetcher<UpdateApiKeyResponse>(`/auth/api-keys/${keyId}`, {
        method: "PATCH",
        body: { ...data } as Record<string, unknown>,
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      onSuccess(response);
      return response;
    } catch (error) {
      onError(error);
      throw error;
    }
  };

  return { handleUpdateApiKey };
};

export default useUpdateApiKey;