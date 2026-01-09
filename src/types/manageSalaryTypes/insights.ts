export interface InsightsResponse {
  peaks: {
    period: "daily" | "weekly" | "monthly" | "yearly";
    date: string;
    amount: string;
  }[];
  trends: {
    period: "mom" | "yoy" | "wow";
    change: number;
    direction: "up" | "down" | "neutral";
  }[];
  patterns: {
    type: "cycle" | "seasonal" | "anomaly";
    description: string;
    data: number[];
  }[];
  recommendations: {
    type: "budget" | "saving" | "alert";
    message: string;
  }[];
}