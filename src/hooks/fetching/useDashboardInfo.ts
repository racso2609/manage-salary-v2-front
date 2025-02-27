// export type useDashboardInfo = {};

import useSWR from "swr";
import { useAuthContext } from "../../context/AuthContext";
import { manageSalaryFetcher } from "../../utils/fetchers";

const useDashboardInfo = () => {
  const { sessionToken } = useAuthContext();

  return useSWR<{ total: number; subTotal: Record<string, number> }>(
    "/dashboard-info",
    async () => {
      const data = await manageSalaryFetcher<{
        total: string;
        records: { _id: string; total: string }[];
      }>("/records/dashboard", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      const total = Number(data.total) / 100;
      const subTotal = data.records.reduce(
        (acc, data) => {
          acc[data._id] = Number(data.total) / 100;
          return acc;
        },
        {} as Record<string, number>,
      );

      return { total, subTotal };
    },
  );
};

export default useDashboardInfo;
