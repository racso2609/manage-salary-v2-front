import useSWR from "swr";
import { useAuthContext } from "../../context/AuthContext";
import { manageSalaryFetcher } from "../../utils/fetchers";

type AnalyticsResponse = {
  totalSpending: number;
  dailyAverage: number;
  spendingTrend: {
    recentAvg: number;
    olderAvg: number;
    changePercent: number;
    trendDirection: "up" | "down" | "neutral";
  };
  peakSpendingDay: {
    date: string;
    amount: number;
  };
  topCategory: {
    name: string;
    amount: number;
  };
  busiestDay: {
    dayOfWeek: number;
    avg: number;
  };
};

type PropsType = {
  from: string;
  to: string;
};

const useAnalytics = ({ from, to }: PropsType) => {
  const { sessionToken } = useAuthContext();

  return useSWR<AnalyticsResponse>(
    [`/api/records/analytics`, from, to],
    async () => {
      if (!sessionToken) throw new Error("No session token");
      const data = await manageSalaryFetcher<AnalyticsResponse>(
        `/records/analytics`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
          params: { from, to },
        },
      );

      return {
        totalSpending: data.totalSpending ?? 0,
        dailyAverage: data.dailyAverage ?? 0,
        spendingTrend: {
          recentAvg: data.spendingTrend?.recentAvg ?? 0,
          olderAvg: data.spendingTrend?.olderAvg ?? 0,
          changePercent: data.spendingTrend?.changePercent ?? 0,
          trendDirection: data.spendingTrend?.trendDirection ?? "neutral",
        },
        peakSpendingDay: {
          date:
            data.peakSpendingDay?.date ??
            new Date().toISOString().split("T")[0],
          amount: data.peakSpendingDay?.amount ?? 0,
        },
        topCategory: {
          name: data.topCategory?.name ?? "None",
          amount: data.topCategory?.amount ?? 0,
        },
        busiestDay: {
          dayOfWeek: data.busiestDay?.dayOfWeek ?? 0,
          avg: data.busiestDay?.avg ?? 0,
        },
      };
    },
  );
};

export default useAnalytics;
