export interface DashboardDataResponse {
  totals: {
    income: string;
    expenses: string;
    savingsRate: number;
    balance: string;
  };
  monthly: {
    month: string;
    income: string;
    expenses: string;
    balance: string;
  }[];
  analytics: Record<string, unknown>;
}