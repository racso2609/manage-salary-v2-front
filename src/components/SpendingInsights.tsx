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
import styled from "styled-components";
import { Card } from "./utils/card";
import useAnalytics from "../hooks/fetching/useAnalytics";

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
  padding: 16px;

  .insight-content {
    display: flex;
    align-items: center;
    gap: 16px;

    .insight-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .insight-details {
      flex: 1;

      .insight-title {
        font-size: 14px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
        margin: 0 0 4px 0;
      }

      .insight-value {
        font-size: 18px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text};
        margin: 0 0 4px 0;
      }

      .insight-trend {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: ${({ theme }) => theme.colors.textSecondary};

        &.positive {
          color: #10b981;
        }

        &.negative {
          color: #ef4444;
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
`;

interface SpendingInsightsProps {
  dateRange: { from: string; to: string };
}

const SpendingInsights = ({
  dateRange,
}: SpendingInsightsProps) => {
  const {
    data: analytics,
    error,
  } = useAnalytics({ from: dateRange.from, to: dateRange.to });

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!analytics) {
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
            <FontAwesomeIcon icon={faCoins} />
          </div>
          <div className="insight-details">
            <div className="insight-title">Total Spending</div>
            <div className="insight-value">
              {formatCurrency(analytics.totalSpending)}
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
            <FontAwesomeIcon icon={faClock} />
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
            <FontAwesomeIcon icon={faFire} />
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
            <FontAwesomeIcon icon={faTags} />
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
            <FontAwesomeIcon icon={faCalendarAlt} />
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

