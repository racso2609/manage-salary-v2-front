import useSWR from "swr";
import { useAuthContext } from "../../context/AuthContext";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { DashboardDataResponse } from "../../types/manageSalaryTypes/dashboardData";

interface UseDashboardDataParams {
  tag?: string;
}

const useDashboardData = ({ tag }: UseDashboardDataParams = {}) => {
  const { sessionToken } = useAuthContext();

  return useSWR<DashboardDataResponse>(
    [`/api/records/dashboard-data`, tag],
    async () => {
      if (!sessionToken) throw new Error("No session token");
      const params = new URLSearchParams();
      if (tag) params.set("tag", tag);
      return await manageSalaryFetcher<DashboardDataResponse>(
        `/records/dashboard-data?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
    }
  );
};

export default useDashboardData;