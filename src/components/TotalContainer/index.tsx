import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faPercent,
  faCalendarDay
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "../utils/card";
import { formatNumber } from "../../utils/formatter/numbers";
import moment from "moment";

const Header = styled.header`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  padding: 10px 0px;
  gap: 20px;

  p {
    margin: 0;
  }

  .total-section {
    display: flex;
    justify-content: space-between;
  }

  [data-profit="true"] {
    color: green;
  }

  [data-profit="false"] {
    color: red;
  }

  .subtotal-section {
    display: flex;
    h3 {
      margin: 0;
    }
    h3:last-child {
      margin-left: 25px;
    }
  }

  .total-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;

    .balance-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};

      .icon-container {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${({ theme }) => theme.colors.primary};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .balance-content {
        flex: 1;

        .balance-label {
          font-size: 14px;
          color: ${({ theme }) => theme.colors.textSecondary};
          margin: 0 0 4px 0;
        }

        .balance-amount {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }
      }
    }

    .metrics-section {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .metric-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-radius: 8px;
        background: ${({ theme }) => theme.colors.surface};
        transition: all 0.2s ease;
        cursor: pointer;
        border: 1px solid transparent;

        &:hover {
          background: ${({ theme }) => theme.colors.border};
          transform: translateY(-1px);
          border-color: ${({ theme }) => theme.colors.primary};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        &:active {
          transform: translateY(0);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }

        .metric-left {
          display: flex;
          align-items: center;
          gap: 12px;

          .icon-container {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          }

          .metric-label {
            font-size: 16px;
            font-weight: 500;
            margin: 0;
          }
        }

        .metric-right {
          text-align: right;

          .metric-amount {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
          }
        }
      }
    }

    .progress-section {
      margin-top: 16px;

      .progress-label {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 0 0 8px 0;
        display: flex;
        justify-content: space-between;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: ${({ theme }) => theme.colors.border};
        border-radius: 4px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      }
    }

    .additional-metrics-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin-top: 16px;

      .metric-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 12px;
        background: ${({ theme }) => theme.colors.surface};
        border-radius: 8px;
        border: 1px solid ${({ theme }) => theme.colors.border};
        transition: all 0.2s ease;
        cursor: help;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-color: ${({ theme }) => theme.colors.primary};
        }

        &.loading {
          .metric-icon {
            background: ${({ theme }) => theme.colors.border};
          }

          .metric-label,
          .metric-value {
            background: ${({ theme }) => theme.colors.border};
            color: transparent;
            border-radius: 4px;
          }
        }

        .metric-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .metric-label {
          font-size: 12px;
          color: ${({ theme }) => theme.colors.textSecondary};
          margin: 0 0 4px 0;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }
      }
    }

    .filter-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid ${({ theme }) => theme.colors.border};
      text-align: center;

      .filter-label {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 0;
      }

      .filter-value {
        font-size: 16px;
        font-weight: 500;
        margin: 4px 0 0 0;
      }
    }
  }
`;

interface TotalContainerProps {
  accountBalance: number;
  data?: {
    subTotal: {
      in?: number;
      out?: number;
    };
  };
  tag?: {
    name: string;
  };
  onChartTypeChange: (type: string) => void;
  isLoading: boolean;
  dateRange: {
    from: string;
    to: string;
  };
}

const TotalContainer = ({
  accountBalance,
  data,
  tag,
  onChartTypeChange,
  isLoading,
  dateRange
}: TotalContainerProps) => {
  // Calculate additional metrics
  const income = data?.subTotal?.in || 0;
  const expenses = data?.subTotal?.out || 0;
  const netFlow = income - expenses;
  const savingsRate = income > 0 ? (netFlow / income) * 100 : 0;

  // Calculate number of days in the current period
  const startDate = moment(dateRange.from || moment().startOf("year"));
  const endDate = moment(dateRange.to || moment().endOf("year"));
  const daysInPeriod = Math.max(1, endDate.diff(startDate, "days") + 1);
  const dailyAverage = expenses / daysInPeriod;

  return (
    <Header>
      <Card
        background="gray"
        width={"100%"}
        radius="10px"
        className="total-container"
      >
        <div className="balance-section">
          <div className="icon-container">
            <FontAwesomeIcon icon={faWallet} />
          </div>
          <div className="balance-content">
            <p className="balance-label">Account Balance</p>
            <h2 className="balance-amount" data-profit={accountBalance > 0}>
              {formatNumber(accountBalance)} USD
            </h2>
          </div>
        </div>

        <div className="metrics-section">
          {(['in', 'out'] as const).map((type) => {
            const isIncome = type === "in";
            const amount = data?.subTotal?.[type] || 0;
            const isPositive = isIncome ? true : amount > 0;
            const tooltipText = isIncome
              ? "Click to filter chart to show only income transactions"
              : "Click to filter chart to show only expense transactions";

            return (
              <div
                className="metric-row"
                onClick={() => {
                  if (data?.subTotal?.[type]) onChartTypeChange(type);
                }}
                key={type}
                title={tooltipText}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (data?.subTotal?.[type]) onChartTypeChange(type);
                  }
                }}
                aria-label={`${type === "in" ? "Income" : "Expenses"}: ${formatNumber(amount)} - Click to filter chart`}
              >
                <div className="metric-left">
                  <div
                    className="icon-container"
                    style={{
                      backgroundColor: isIncome ? '#4caf50' : '#f44336',
                      color: 'white'
                    }}
                  >
                    <FontAwesomeIcon icon={isIncome ? faArrowUp : faArrowDown} />
                  </div>
                  <h3 className="metric-label">
                    {type === "in" ? "Income" : "Expenses"}
                  </h3>
                </div>
                <div className="metric-right">
                  <h3
                    className="metric-amount"
                    data-profit={isPositive}
                  >
                    {formatNumber(amount)}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {(data?.subTotal?.in || 0) > 0 && (
          <div className="progress-section">
            <div className="progress-label">
              <span>Income vs Expenses</span>
              <span>
                {((data?.subTotal?.out || 0) / (data?.subTotal?.in || 1) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((data?.subTotal?.out || 0) / (data?.subTotal?.in || 1) * 100, 100)}%`,
                  backgroundColor: (data?.subTotal?.out || 0) > (data?.subTotal?.in || 0) ? '#f44336' : '#4caf50'
                }}
              />
            </div>
          </div>
        )}

        <div className="additional-metrics-section">
          <div
            className={`metric-card ${isLoading ? 'loading' : ''}`}
            title="Net Flow = Income - Expenses. Positive values indicate you're saving money."
          >
            <div
              className="metric-icon"
              style={{
                backgroundColor: isLoading ? undefined : (netFlow >= 0 ? '#4caf50' : '#f44336'),
                color: 'white'
              }}
            >
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <p className="metric-label">
              {isLoading ? '\u00A0' : 'Net Flow'}
            </p>
            <p
              className="metric-value"
              style={{ color: isLoading ? undefined : (netFlow >= 0 ? '#4caf50' : '#f44336') }}
            >
              {isLoading ? '\u00A0\u00A0\u00A0\u00A0\u00A0' : `${netFlow >= 0 ? '+' : ''}${formatNumber(netFlow)}`}
            </p>
          </div>

          <div
            className={`metric-card ${isLoading ? 'loading' : ''}`}
            title="Savings Rate = (Income - Expenses) / Income × 100%. Shows what percentage of your income you're saving."
          >
            <div
              className="metric-icon"
              style={{
                backgroundColor: isLoading ? undefined : (savingsRate >= 0 ? '#4caf50' : '#f44336'),
                color: 'white'
              }}
            >
              <FontAwesomeIcon icon={faPercent} />
            </div>
            <p className="metric-label">
              {isLoading ? '\u00A0' : 'Savings Rate'}
            </p>
            <p
              className="metric-value"
              style={{ color: isLoading ? undefined : (savingsRate >= 0 ? '#4caf50' : '#f44336') }}
            >
              {isLoading ? '\u00A0\u00A0\u00A0\u00A0' : `${savingsRate >= 0 ? '+' : ''}${savingsRate.toFixed(1)}%`}
            </p>
          </div>

          <div
            className={`metric-card ${isLoading ? 'loading' : ''}`}
            title={`Daily Average = Total Expenses ÷ ${daysInPeriod} days. Shows your average daily spending.`}
          >
            <div
              className="metric-icon"
              style={{
                backgroundColor: isLoading ? undefined : '#2196f3',
                color: 'white'
              }}
            >
              <FontAwesomeIcon icon={faCalendarDay} />
            </div>
            <p className="metric-label">
              {isLoading ? '\u00A0' : 'Daily Avg'}
            </p>
            <p className="metric-value" style={{ color: isLoading ? undefined : '#2196f3' }}>
              {isLoading ? '\u00A0\u00A0\u00A0\u00A0\u00A0' : formatNumber(dailyAverage)}
            </p>
          </div>
        </div>

        <div className="filter-section">
          <p className="filter-label">Current Filter</p>
          <p className="filter-value">{tag?.name || "ALL"}</p>
        </div>
      </Card>
    </Header>
  );
};

export default TotalContainer;