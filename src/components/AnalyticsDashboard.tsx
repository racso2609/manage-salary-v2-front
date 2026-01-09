import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faChartPie,
  faCalendarAlt,
  faTrophy,
  faExclamationTriangle,
  faLightbulb,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "./utils/card";
import useInsights from "../hooks/fetching/useInsights";

const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 20px;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;

  .header-icon {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.primary};
  }

  .header-title {
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MetricCard = styled(Card)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 24px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.primary}40;
  }

  .metric-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .metric-change {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;

      &.positive {
        color: ${({ theme }) => theme.colors.success || "#10b981"};
      }

      &.negative {
        color: ${({ theme }) => theme.colors.danger || "#ef4444"};
      }

      &.neutral {
        color: ${({ theme }) => theme.colors.textSecondary};
      }
    }
  }

  .metric-title {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 8px;
  }

  .metric-value {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 4px;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 28px;
    }
  }

  .metric-subtitle {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ChartCard = styled(Card)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: 24px;

  .chart-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    .chart-icon {
      width: 24px;
      height: 24px;
      color: ${({ theme }) => theme.colors.primary};
    }

    .chart-title {
      font-size: 18px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      margin: 0;
    }
  }

  .chart-placeholder {
    height: 300px;
    background: ${({ theme }) => theme.colors.borderLight}20;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 16px;
    border: 2px dashed ${({ theme }) => theme.colors.borderLight};
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const InsightsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InsightCard = styled(Card)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: 20px;

  .insight-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .insight-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .insight-title {
      font-size: 16px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      margin: 0;
    }
  }

  .insight-content {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.5;
  }
`;

interface AnalyticsDashboardProps {
  dateRange: { from: string; to: string };
  isLoading?: boolean;
}

const AnalyticsDashboard = ({ dateRange }: AnalyticsDashboardProps) => {
  const {
    data: insights,
    isLoading,
    error,
  } = useInsights({
    from: dateRange.from,
    to: dateRange.to,
  });

  // Calculate analytics from insights
  const analytics = React.useMemo(() => {
    if (!insights || isLoading) return null;

    // Use peaks for spending data
    const peakSpending =
      insights.peaks?.find((p) => p.period === "daily") || insights.peaks?.[0];
    const totalSpending = peakSpending ? Number(peakSpending.amount) : 0;

    // Use patterns for daily average
    const dailyAverage =
      insights.patterns?.find((p) => p.type === "cycle")?.data?.[0] || 0;

    // Use trends for spending change
    const spendingTrend = insights.trends?.find((t) => t.period === "mom");
    const spendingChange = spendingTrend ? spendingTrend.change : 0;

    // Mock top category since not in insights
    const topCategory = { name: "N/A", amount: 0 };

    // Mock savings rate
    const savingsRate = 0;

    return {
      totalSpending,
      dailyAverage,
      topCategory,
      spendingChange,
      savingsRate,
    };
  }, [insights, isLoading]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <AnalyticsContainer>
        <DashboardHeader>
          <FontAwesomeIcon icon={faChartLine} className="header-icon" />
          <h1 className="header-title">Analytics Dashboard</h1>
        </DashboardHeader>
        <div>Error loading analytics: {error.message}</div>
      </AnalyticsContainer>
    );
  }

  if (!analytics) {
    return (
      <AnalyticsContainer>
        <DashboardHeader>
          <FontAwesomeIcon icon={faChartLine} className="header-icon" />
          <h1 className="header-title">Analytics Dashboard</h1>
        </DashboardHeader>
        <div>Loading analytics...</div>
      </AnalyticsContainer>
    );
  }

  return (
    <AnalyticsContainer>
      <DashboardHeader>
        <FontAwesomeIcon icon={faChartLine} className="header-icon" />
        <h1 className="header-title">Analytics Dashboard</h1>
      </DashboardHeader>

      {/* Key Metrics */}
      <MetricsGrid>
        <MetricCard radius="12px">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              }}
            >
              <FontAwesomeIcon icon={faChartLine} color="white" />
            </div>
            <div
              className={`metric-change ${analytics.spendingChange > 0 ? "negative" : analytics.spendingChange < 0 ? "positive" : "neutral"}`}
            >
              <FontAwesomeIcon
                icon={analytics.spendingChange > 0 ? faArrowUp : faArrowDown}
                size="xs"
              />
              {Math.abs(analytics.spendingChange).toFixed(1)}%
            </div>
          </div>
          <div className="metric-title">Total Spending</div>
          <div className="metric-value">
            {formatCurrency(analytics.totalSpending)}
          </div>
          <p className="metric-subtitle">vs previous period</p>
        </MetricCard>

        <MetricCard radius="12px">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
              }}
            >
              <FontAwesomeIcon icon={faTrophy} color="white" />
            </div>
          </div>
          <div className="metric-title">Top Insight</div>
          <div className="metric-value">
            {insights?.recommendations?.[0]?.type || "N/A"}
          </div>
          <p className="metric-subtitle">
            {insights?.recommendations?.[0]?.message?.substring(0, 20) || ""}
          </p>
        </MetricCard>

        <MetricCard radius="12px">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
              }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} color="white" />
            </div>
          </div>
          <div className="metric-title">Daily Average</div>
          <div className="metric-value">
            {formatCurrency(analytics.dailyAverage)}
          </div>
          <p className="metric-subtitle">Spending per day</p>
        </MetricCard>

        <MetricCard radius="12px">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              }}
            >
              <FontAwesomeIcon icon={faChartPie} color="white" />
            </div>
          </div>
          <div className="metric-title">Savings Rate</div>
          <div className="metric-value">
            {analytics.savingsRate.toFixed(1)}%
          </div>
          <p className="metric-subtitle">of total income</p>
        </MetricCard>
      </MetricsGrid>

      {/* Charts Section */}
      <ChartsSection>
        <ChartCard radius="12px">
          <div className="chart-header">
            <FontAwesomeIcon icon={faChartLine} className="chart-icon" />
            <h3 className="chart-title">Spending Trends</h3>
          </div>
          <div className="chart-placeholder">
            📈 Spending trends chart would go here
          </div>
        </ChartCard>

        <ChartCard radius="12px">
          <div className="chart-header">
            <FontAwesomeIcon icon={faChartPie} className="chart-icon" />
            <h3 className="chart-title">Category Breakdown</h3>
          </div>
          <div className="chart-placeholder">
            🥧 Category breakdown chart would go here
          </div>
        </ChartCard>
      </ChartsSection>

      {/* Insights Section */}
      <InsightsSection>
        {insights?.recommendations?.map((recommendation, index) => (
          <InsightCard key={index} radius="12px">
            <div className="insight-header">
              <div
                className="insight-icon"
                style={{
                  background:
                    recommendation.type === "budget"
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : recommendation.type === "saving"
                        ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                        : "linear-gradient(135deg, #f59e0b, #d97706)",
                }}
              >
                <FontAwesomeIcon
                  icon={
                    recommendation.type === "budget"
                      ? faLightbulb
                      : recommendation.type === "saving"
                        ? faTrophy
                        : faExclamationTriangle
                  }
                  color="white"
                />
              </div>
              <h4 className="insight-title">
                {recommendation.type === "budget"
                  ? "Budget Insight"
                  : recommendation.type === "saving"
                    ? "Savings Tip"
                    : "Alert"}
              </h4>
            </div>
            <div className="insight-content">{recommendation.message}</div>
          </InsightCard>
        ))}
        {(!insights?.recommendations ||
          insights.recommendations.length === 0) && (
          <>
            <InsightCard radius="12px">
              <div className="insight-header">
                <div
                  className="insight-icon"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                  }}
                >
                  <FontAwesomeIcon icon={faLightbulb} color="white" />
                </div>
                <h4 className="insight-title">Smart Insights</h4>
              </div>
              <div className="insight-content">
                No specific insights available. Check back later for
                personalized recommendations.
              </div>
            </InsightCard>

            <InsightCard radius="12px">
              <div className="insight-header">
                <div
                  className="insight-icon"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} color="white" />
                </div>
                <h4 className="insight-title">Spending Alert</h4>
              </div>
              <div className="insight-content">
                No spending alerts available at this time.
              </div>
            </InsightCard>
          </>
        )}
      </InsightsSection>
    </AnalyticsContainer>
  );
};

export default AnalyticsDashboard;
