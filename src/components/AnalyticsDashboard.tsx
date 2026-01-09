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
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "./utils/card";

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
        color: ${({ theme }) => theme.colors.success || '#10b981'};
      }

      &.negative {
        color: ${({ theme }) => theme.colors.danger || '#ef4444'};
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
  records: any;
  dateRange: { from: string; to: string };
  isLoading?: boolean;
}

const AnalyticsDashboard = ({
  records,
  dateRange,
  isLoading = false
}: AnalyticsDashboardProps) => {
  // Calculate comprehensive analytics
  const analytics = React.useMemo(() => {
    if (!records || isLoading) return null;

    const allRecords = Object.values(records).flatMap((month: any) =>
      month.records || []
    );

    const outflowRecords = allRecords.filter((record: any) => record.type === 'out');
    const inflowRecords = allRecords.filter((record: any) => record.type === 'in');

    if (outflowRecords.length === 0) return null;

    // Basic metrics
    const totalSpending = outflowRecords.reduce((sum: number, record: any) =>
      sum + Number(record.amount), 0
    );

    const totalIncome = inflowRecords.reduce((sum: number, record: any) =>
      sum + Number(record.amount), 0
    );

    // Time-based calculations
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    const avgDailySpending = totalSpending / daysDiff;
    const avgDailyIncome = totalIncome / daysDiff;

    // Savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

    // Category analysis
    const spendingByCategory = outflowRecords.reduce((acc: { [key: string]: number }, record: any) => {
      const categoryName = record.tag?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + Number(record.amount);
      return acc;
    }, {});

    const topCategory = Object.entries(spendingByCategory).reduce((max, [category, amount]) =>
      amount > max.amount ? { category, amount } : max,
      { category: '', amount: 0 }
    );

    // Trend analysis (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSpending = outflowRecords
      .filter((record: any) => new Date(record.date) >= thirtyDaysAgo)
      .reduce((sum: number, record: any) => sum + Number(record.amount), 0);

    const olderSpending = outflowRecords
      .filter((record: any) => new Date(record.date) < thirtyDaysAgo)
      .reduce((sum: number, record: any) => sum + Number(record.amount), 0);

    const spendingChange = olderSpending > 0 ? ((recentSpending - olderSpending) / olderSpending) * 100 : 0;

    // Monthly breakdown (simplified)
    const monthlyData = Object.entries(records).map(([monthKey, monthData]: [string, any]) => {
      const monthSpending = monthData.records
        .filter((record: any) => record.type === 'out')
        .reduce((sum: number, record: any) => sum + Number(record.amount), 0);

      return {
        month: monthKey,
        spending: monthSpending,
        transactions: monthData.records.filter((record: any) => record.type === 'out').length
      };
    });

    return {
      totalSpending,
      totalIncome,
      avgDailySpending,
      avgDailyIncome,
      savingsRate,
      topCategory,
      spendingChange,
      transactionCount: outflowRecords.length,
      monthlyData,
      spendingByCategory
    };
  }, [records, dateRange, isLoading]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading || !analytics) {
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
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              <FontAwesomeIcon icon={faChartLine} color="white" />
            </div>
            <div className={`metric-change ${analytics.spendingChange > 0 ? 'negative' : analytics.spendingChange < 0 ? 'positive' : 'neutral'}`}>
              <FontAwesomeIcon
                icon={analytics.spendingChange > 0 ? faArrowUp : faArrowDown}
                size="xs"
              />
              {Math.abs(analytics.spendingChange).toFixed(1)}%
            </div>
          </div>
          <div className="metric-title">Total Spending</div>
          <div className="metric-value">{formatCurrency(analytics.totalSpending)}</div>
          <p className="metric-subtitle">vs previous period</p>
        </MetricCard>

        <MetricCard radius="12px">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <FontAwesomeIcon icon={faTrophy} color="white" />
            </div>
          </div>
          <div className="metric-title">Top Category</div>
          <div className="metric-value">{analytics.topCategory.category}</div>
          <p className="metric-subtitle">{formatCurrency(analytics.topCategory.amount)}</p>
        </MetricCard>

        <MetricCard radius="12px">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} color="white" />
            </div>
          </div>
          <div className="metric-title">Daily Average</div>
          <div className="metric-value">{formatCurrency(analytics.avgDailySpending)}</div>
          <p className="metric-subtitle">{analytics.transactionCount} transactions</p>
        </MetricCard>

        <MetricCard radius="12px">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
            >
              <FontAwesomeIcon icon={faChartPie} color="white" />
            </div>
          </div>
          <div className="metric-title">Savings Rate</div>
          <div className="metric-value">{analytics.savingsRate.toFixed(1)}%</div>
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
        <InsightCard radius="12px">
          <div className="insight-header">
            <div
              className="insight-icon"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <FontAwesomeIcon icon={faLightbulb} color="white" />
            </div>
            <h4 className="insight-title">Smart Insights</h4>
          </div>
          <div className="insight-content">
            Your spending on {analytics.topCategory.category.toLowerCase()} is {((analytics.topCategory.amount / analytics.totalSpending) * 100).toFixed(1)}% of your total expenses.
            Consider setting a budget for this category to optimize your spending.
          </div>
        </InsightCard>

        <InsightCard radius="12px">
          <div className="insight-header">
            <div
              className="insight-icon"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} color="white" />
            </div>
            <h4 className="insight-title">Spending Alert</h4>
          </div>
          <div className="insight-content">
            {analytics.spendingChange > 10
              ? "Your spending has increased significantly compared to last month. Review your recent transactions to identify areas for cost reduction."
              : analytics.spendingChange < -10
              ? "Great job! Your spending has decreased compared to last month. Keep up the good work with your financial discipline."
              : "Your spending is stable compared to last month. Continue monitoring your expenses for optimal financial health."
            }
          </div>
        </InsightCard>
      </InsightsSection>
    </AnalyticsContainer>
  );
};

export default AnalyticsDashboard;