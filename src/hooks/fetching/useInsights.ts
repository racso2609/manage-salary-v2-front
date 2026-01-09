import useSWR from "swr";
import { useAuthContext } from "../../context/AuthContext";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { InsightsResponse } from "../../types/manageSalaryTypes/insights";

interface UseInsightsParams {
  from?: string;
  to?: string;
  tag?: string;
}

const useInsights = ({ from, to, tag }: UseInsightsParams = {}) => {
  const { sessionToken } = useAuthContext();

  return useSWR<InsightsResponse>(
    [`/api/records/insights`, from, to, tag],
    async () => {
      if (!sessionToken) throw new Error("No session token");
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (tag) params.set("tag", tag);
      return await manageSalaryFetcher<InsightsResponse>(`/records/insights`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
        params: {
          from,
          to,
          tag,
        },
      });
    },
  );
};

export default useInsights;

