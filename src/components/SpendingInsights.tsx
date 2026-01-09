import styled from "styled-components";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCalendarAlt,
  faArrowUp,
  faArrowDown,
  faEquals,
  faClock,
  faCoins,
  faArrowTrendUp,
  faArrowTrendDown,
  faFire,
  faCalendarDay,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "./utils/card";
import useInsights from "../hooks/fetching/useInsights";
import useDashboardData from "../hooks/fetching/useDashboardData";

const InsightsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .insights-header {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 4px;

    .header-icon {
      width: 24px;
      height: 24px;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const InsightCard = styled(Card)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    border-color: ${({ theme }) => theme.colors.primary}30;
  }

  .insight-content {
    display: flex;
    align-items: center;
    gap: 14px;

    .insight-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .insight-details {
      flex: 1;
      min-width: 0;

      .insight-title {
        font-size: 14px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
        margin: 0 0 4px 0;
      }

      .insight-value {
        font-size: 20px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text};
        margin: 0 0 4px 0;
        line-height: 1.2;
      }

      .insight-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 500;

        &.positive {
          color: ${({ theme }) => theme.colors.success || "#10b981"};
        }

        &.negative {
          color: ${({ theme }) => theme.colors.danger || "#ef4444"};
        }

        &.neutral {
          color: ${({ theme }) => theme.colors.textSecondary};
        }

        .trend-icon {
          font-size: 10px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 12px;

    .insight-content {
      gap: 10px;

      .insight-icon {
        width: 36px;
        height: 36px;
      }

      .insight-details {
        .insight-title {
          font-size: 13px;
        }

        .insight-value {
          font-size: 18px;
        }
      }
    }
  }
`;

interface SpendingInsightsProps {
  dateRange: { from: string; to: string };
  isLoading?: boolean;
}

const SpendingInsights = ({
  dateRange,
  isLoading = false,
}: SpendingInsightsProps) => {
  const {
    data: insights,
    isLoading: insightsLoading,
    error,
  } = useInsights({
    from: dateRange.from,
    to: dateRange.to,
  });
  const { data: dashboardData, isLoading: dashboardLoading } =
    useDashboardData();

  const analytics = React.useMemo(() => {
    if (!insights || !dashboardData) return null;

    const spendingTrend = insights.trends.find((t) => t.period === "mom");
    const totalSpending = Number(dashboardData.totals.expenses) / 100;
    const dailyAverage =
      insights.patterns &&
      insights.patterns.length > 0 &&
      insights.patterns[0].data &&
      insights.patterns[0].data.length > 0
        ? insights.patterns[0].data[0]
        : 0;
    const topCategory = { name: "From Insights", amount: totalSpending * 0.5 };
    const busiestDay = { dayOfWeek: 1, avg: dailyAverage };
    const spendingChange = spendingTrend?.change || 0;
    const trendDirection = spendingTrend?.direction || "neutral";
    const totalIncome = Number(dashboardData.totals.income) / 100;
    const savingsRate = dashboardData.totals.savingsRate;
    const peakSpendingDay =
      insights.peaks && insights.peaks.length > 0
        ? {
            date: insights.peaks[0].date,
            amount: Number(insights.peaks[0].amount) / 100,
          }
        : { date: new Date().toISOString().split("T")[0], amount: 0 };

    return {
      totalSpending,
      dailyAverage,
      spendingTrend: {
        changePercent: spendingChange,
        trendDirection,
      },
      topCategory,
      busiestDay,
      totalIncome,
      savingsRate,
      peakSpendingDay,
    };
  }, [insights, dashboardData]);

  const isLoadingCombined = isLoading || insightsLoading || dashboardLoading;

  if (isLoadingCombined || !analytics) {
    if (error) {
      return (
        <InsightsContainer>
          <h3 className="insights-header">
            <FontAwesomeIcon icon={faChartLine} className="header-icon" />
            Spending Insights
          </h3>
          <Card radius="12px" padding="16px">
            <div style={{ color: "red", textAlign: "center" }}>
              Failed to load insights. Please try again.
            </div>
          </Card>
        </InsightsContainer>
      );
    }
    return (
      <InsightsContainer>
        <h3 className="insights-header">
          <FontAwesomeIcon icon={faChartLine} className="header-icon" />
          Spending Insights
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} radius="12px" padding="16px">
              <div
                style={{
                  height: "44px",
                  background: "#f0f0f0",
                  borderRadius: "8px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </Card>
          ))}
        </div>
      </InsightsContainer>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return faArrowUp;
      case "down":
        return faArrowDown;
      default:
        return faEquals;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "negative"; // Red for spending increase
      case "down":
        return "positive"; // Green for spending decrease
      default:
        return "neutral";
    }
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <InsightsContainer>
      <h3 className="insights-header">
        <FontAwesomeIcon icon={faChartLine} className="header-icon" />
        Spending Insights
      </h3>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
          >
            <FontAwesomeIcon icon={faCoins} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Total Spending</div>
            <div className="insight-value">
              {formatCurrency(analytics?.totalSpending)}
            </div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCalendarAlt} className="trend-icon" />
              In selected period
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <FontAwesomeIcon icon={faClock} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Daily Average</div>
            <div className="insight-value">
              {formatCurrency(analytics.dailyAverage)}
            </div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCalendarAlt} className="trend-icon" />
              Per day this period
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{
              background:
                analytics.spendingTrend.trendDirection === "up"
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : analytics.spendingTrend.trendDirection === "down"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #6b7280, #4b5563)",
            }}
          >
            <FontAwesomeIcon
              icon={
                analytics.spendingTrend.trendDirection === "up"
                  ? faArrowTrendUp
                  : analytics.spendingTrend.trendDirection === "down"
                    ? faArrowTrendDown
                    : faEquals
              }
              color="white"
            />
          </div>
          <div className="insight-details">
            <div className="insight-title">Spending Trend</div>
            <div className="insight-value">
              {analytics.spendingTrend.trendDirection === "neutral"
                ? "Stable"
                : `${analytics.spendingTrend.changePercent}% ${analytics.spendingTrend.trendDirection}`}
            </div>
            <div
              className={`insight-trend ${getTrendColor(analytics.spendingTrend.trendDirection)}`}
            >
              <FontAwesomeIcon
                icon={getTrendIcon(analytics.spendingTrend.trendDirection)}
                className="trend-icon"
              />
              vs previous period
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <FontAwesomeIcon icon={faFire} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Peak Spending Day</div>
            <div className="insight-value">
              {formatCurrency(analytics.peakSpendingDay.amount)}
            </div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCalendarDay} className="trend-icon" />
              {new Date(analytics.peakSpendingDay.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}
          >
            <FontAwesomeIcon icon={faTags} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Top Category</div>
            <div className="insight-value">{analytics.topCategory.name}</div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCoins} className="trend-icon" />
              {formatCurrency(analytics.topCategory.amount)}
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
          >
            <FontAwesomeIcon icon={faCalendarAlt} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Busiest Day</div>
            <div className="insight-value">
              {dayNames[analytics.busiestDay.dayOfWeek]}
            </div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCoins} className="trend-icon" />
              {formatCurrency(analytics.busiestDay.avg)} avg
            </div>
          </div>
        </div>
      </InsightCard>
    </InsightsContainer>
  );
};

export default SpendingInsights;
