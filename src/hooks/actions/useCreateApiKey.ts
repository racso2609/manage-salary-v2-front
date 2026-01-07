import { useAuthContext } from "../../context/AuthContext";
import { FnHandlers } from "../../types/handlers";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { CreateApiKeyRequest, CreateApiKeyResponse } from "../../types/manageSalaryTypes/apiKeys";

export type useCreateApiKey = { handlers?: FnHandlers<CreateApiKeyResponse> };

const useCreateApiKey = ({ handlers }: useCreateApiKey = {}) => {
  const { sessionToken } = useAuthContext();

  const onSuccess = (data: CreateApiKeyResponse) => {
    if (handlers?.onSuccess) handlers.onSuccess(data);
  };

  const onError = (error: unknown) => {
    if (handlers?.onError) handlers.onError(error);
  };

  const handleCreateApiKey = async (data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> => {
    try {
      const response = await manageSalaryFetcher<CreateApiKeyResponse>("/auth/api-keys", {
        method: "POST",
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

  return { handleCreateApiKey };
};

export default useCreateApiKey;