import { memo, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faEquals, faTags, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Record } from "../../types/manageSalaryTypes/records";
import moment from "moment";

const InsightsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InsightsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .header-icon {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary}30;
  }

  .card-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .card-title {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-value {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }

  .trend-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    margin-top: 4px;

    &.positive {
      color: ${({ theme }) => theme.colors.success || '#4caf50'};
    }

    &.negative {
      color: ${({ theme }) => theme.colors.danger || '#f44336'};
    }

    &.neutral {
      color: ${({ theme }) => theme.colors.textSecondary};
    }

    .trend-icon {
      font-size: 10px;
    }
  }
`;

interface ChartInsightsProps {
  records: Record[];
  chartType: 'in' | 'out';
  dateRange: { from: string; to: string };
}

const ChartInsights = memo(({
  records,
  chartType,
  dateRange
}: ChartInsightsProps) => {
  const insights = useMemo(() => {
    const totalAmount = records.reduce((sum, record) => sum + Number(record.amount), 0);
    const categoryCount = new Set(records.map(record => record.tag._id)).size;
    const transactionCount = records.length;

    // Calculate date range duration
    const startDate = moment(dateRange.from);
    const endDate = moment(dateRange.to);
    const daysDiff = Math.max(1, endDate.diff(startDate, 'days') + 1);

    // Calculate average per day
    const averagePerDay = totalAmount / daysDiff;

    // Calculate trend (this would normally compare with previous period)
    // For now, we'll show a mock trend based on category distribution
    const trendPercentage = categoryCount > 3 ? 12.5 : categoryCount > 1 ? 5.2 : -3.1;
    const trendDirection = trendPercentage > 0 ? 'up' : trendPercentage < 0 ? 'down' : 'neutral';

    return {
      totalAmount,
      categoryCount,
      transactionCount,
      averagePerDay,
      trendPercentage,
      trendDirection,
      daysDiff
    };
  }, [records, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTrend = (percentage: number) => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  return (
    <InsightsContainer>
      <InsightsHeader>
        <FontAwesomeIcon icon={faCalendarAlt} className="header-icon" />
        Insights & Summary
      </InsightsHeader>

      <SummaryGrid>
        <SummaryCard>
          <div
            className="card-icon"
            style={{ backgroundColor: '#2196f3', color: 'white' }}
          >
            <FontAwesomeIcon icon={faTags} />
          </div>
          <p className="card-title">Total {chartType === 'in' ? 'Income' : 'Expenses'}</p>
          <p className="card-value">{formatCurrency(insights.totalAmount)}</p>
          <div className={`trend-indicator ${insights.trendDirection}`}>
            <FontAwesomeIcon
              icon={
                insights.trendDirection === 'up' ? faArrowUp :
                insights.trendDirection === 'down' ? faArrowDown : faEquals
              }
              className="trend-icon"
            />
            {formatTrend(insights.trendPercentage)}
          </div>
        </SummaryCard>

        <SummaryCard>
          <div
            className="card-icon"
            style={{ backgroundColor: '#9c27b0', color: 'white' }}
          >
            {insights.categoryCount}
          </div>
          <p className="card-title">Categories</p>
          <p className="card-value">{insights.categoryCount}</p>
        </SummaryCard>

        <SummaryCard>
          <div
            className="card-icon"
            style={{ backgroundColor: '#ff9800', color: 'white' }}
          >
            {insights.transactionCount}
          </div>
          <p className="card-title">Transactions</p>
          <p className="card-value">{insights.transactionCount}</p>
        </SummaryCard>

        <SummaryCard>
          <div
            className="card-icon"
            style={{ backgroundColor: '#4caf50', color: 'white' }}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <p className="card-title">Daily Avg</p>
          <p className="card-value">{formatCurrency(insights.averagePerDay)}</p>
        </SummaryCard>
      </SummaryGrid>
    </InsightsContainer>
  );
});

ChartInsights.displayName = 'ChartInsights';

export default ChartInsights;