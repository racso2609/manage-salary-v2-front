import useSWR from "swr";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { useAuthContext } from "../../context/AuthContext";
import { ApiKey } from "../../types/manageSalaryTypes/apiKeys";

const useApiKeys = () => {
  const { sessionToken } = useAuthContext();
  return useSWR<ApiKey[]>("/auth/api-keys", async () => {
    const data = await manageSalaryFetcher<{
      apiKeys: ApiKey[];
    }>("/auth/api-keys", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return data.apiKeys;
  });
};

export default useApiKeys;