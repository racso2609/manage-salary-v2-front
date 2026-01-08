import React from "react";
import styled from "styled-components";
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
  faTags
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "./utils/card";

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
          color: ${({ theme }) => theme.colors.success || '#10b981'};
        }

        &.negative {
          color: ${({ theme }) => theme.colors.danger || '#ef4444'};
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
  records: any;
  dateRange: { from: string; to: string };
  isLoading?: boolean;
}

const SpendingInsights = ({
  records,
  dateRange,
  isLoading = false
}: SpendingInsightsProps) => {
  // Calculate insights from records
  const insights = React.useMemo(() => {
    if (!records || isLoading) return null;

    const allRecords = Object.values(records).flatMap((month: any) =>
      month.records || []
    );

    const outflowRecords = allRecords.filter((record: any) => record.type === 'out');

    if (outflowRecords.length === 0) return null;

    // Calculate total spending
    const totalSpending = outflowRecords.reduce((sum: number, record: any) =>
      sum + Number(record.amount), 0
    );

    // Calculate date range in days
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Average daily spending
    const avgDailySpending = totalSpending / daysDiff;

    // Get recent period for comparison (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRecords = outflowRecords.filter((record: any) =>
      new Date(record.date) >= thirtyDaysAgo
    );

    const recentTotal = recentRecords.reduce((sum: number, record: any) =>
      sum + Number(record.amount), 0
    );

    const olderRecords = outflowRecords.filter((record: any) =>
      new Date(record.date) < thirtyDaysAgo
    );

    const olderTotal = olderRecords.reduce((sum: number, record: any) =>
      sum + Number(record.amount), 0
    );

    const recentAvg = recentRecords.length > 0 ? recentTotal / Math.max(1, recentRecords.length / 30) : 0;
    const olderAvg = olderRecords.length > 0 ? olderTotal / Math.max(1, olderRecords.length / 30) : 0;

    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
    let trendValue = 0;

    if (recentAvg > 0 && olderAvg > 0) {
      const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
      trendValue = Math.abs(changePercent);
      trendDirection = changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'neutral';
    }

    // Calculate peak spending day
    const spendingByDay = outflowRecords.reduce((acc: { [key: string]: number }, record: any) => {
      const day = new Date(record.date).toDateString();
      acc[day] = (acc[day] || 0) + Number(record.amount);
      return acc;
    }, {});

    const peakDay = Object.entries(spendingByDay).reduce((max, [day, amount]) =>
      amount > max.amount ? { day, amount } : max,
      { day: '', amount: 0 }
    );

    // Calculate top spending category
    const spendingByCategory = outflowRecords.reduce((acc: { [key: string]: number }, record: any) => {
      const categoryName = record.tag?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + Number(record.amount);
      return acc;
    }, {});

    const topCategory = Object.entries(spendingByCategory).reduce((max, [category, amount]) =>
      amount > max.amount ? { category, amount } : max,
      { category: '', amount: 0 }
    );

    // Calculate spending by day of week
    const spendingByDayOfWeek = outflowRecords.reduce((acc: { [key: number]: number }, record: any) => {
      const dayOfWeek = new Date(record.date).getDay(); // 0 = Sunday, 1 = Monday, etc.
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + Number(record.amount);
      return acc;
    }, {});

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const busiestDay = Object.entries(spendingByDayOfWeek).reduce((max, [day, amount]) =>
      amount > max.amount ? { day: dayNames[parseInt(day)], amount } : max,
      { day: '', amount: 0 }
    );

    return {
      totalSpending,
      avgDailySpending,
      trendDirection,
      trendValue: Math.round(trendValue),
      transactionCount: outflowRecords.length,
      peakDay,
      topCategory,
      busiestDay
    };
  }, [records, dateRange, isLoading]);

  if (isLoading || !insights) {
    return (
      <InsightsContainer>
        <h3 className="insights-header">
          <FontAwesomeIcon icon={faChartLine} className="header-icon" />
          Spending Insights
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} radius="12px" padding="16px">
              <div style={{
                height: '44px',
                background: '#f0f0f0',
                borderRadius: '8px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            </Card>
          ))}
        </div>
      </InsightsContainer>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return faArrowUp;
      case 'down': return faArrowDown;
      default: return faEquals;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'negative'; // Red for spending increase
      case 'down': return 'positive'; // Green for spending decrease
      default: return 'neutral';
    }
  };

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
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <FontAwesomeIcon icon={faCoins} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Total Spending</div>
            <div className="insight-value">{formatCurrency(insights.totalSpending)}</div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCalendarAlt} className="trend-icon" />
              {insights.transactionCount} transactions
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <FontAwesomeIcon icon={faClock} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Daily Average</div>
            <div className="insight-value">{formatCurrency(insights.avgDailySpending)}</div>
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
              background: insights.trendDirection === 'up'
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : insights.trendDirection === 'down'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6b7280, #4b5563)'
            }}
          >
            <FontAwesomeIcon
              icon={insights.trendDirection === 'up' ? faArrowTrendUp : insights.trendDirection === 'down' ? faArrowTrendDown : faEquals}
              color="white"
            />
          </div>
          <div className="insight-details">
            <div className="insight-title">Spending Trend</div>
            <div className="insight-value">
              {insights.trendDirection === 'neutral' ? 'Stable' :
               `${insights.trendValue}% ${insights.trendDirection}`}
            </div>
            <div className={`insight-trend ${getTrendColor(insights.trendDirection)}`}>
              <FontAwesomeIcon icon={getTrendIcon(insights.trendDirection)} className="trend-icon" />
              vs previous period
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            <FontAwesomeIcon icon={faFire} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Peak Spending Day</div>
            <div className="insight-value">{formatCurrency(insights.peakDay.amount)}</div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCalendarDay} className="trend-icon" />
              {new Date(insights.peakDay.day).toLocaleDateString()}
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
          >
            <FontAwesomeIcon icon={faTags} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Top Category</div>
            <div className="insight-value">{insights.topCategory.category}</div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCoins} className="trend-icon" />
              {formatCurrency(insights.topCategory.amount)}
            </div>
          </div>
        </div>
      </InsightCard>

      <InsightCard radius="12px">
        <div className="insight-content">
          <div
            className="insight-icon"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
          >
            <FontAwesomeIcon icon={faCalendarAlt} color="white" />
          </div>
          <div className="insight-details">
            <div className="insight-title">Busiest Day</div>
            <div className="insight-value">{insights.busiestDay.day}</div>
            <div className="insight-trend neutral">
              <FontAwesomeIcon icon={faCoins} className="trend-icon" />
              {formatCurrency(insights.busiestDay.amount)} avg
            </div>
          </div>
        </div>
      </InsightCard>
    </InsightsContainer>
  );
};

export default SpendingInsights;