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
    gap: 24px;
    padding: 24px;

    /* Section headers */
    .section-header {
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.textSecondary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    }

    .balance-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10, ${({ theme }) => theme.colors.secondary}10);
      border-radius: 12px;
      border: 1px solid ${({ theme }) => theme.colors.primary}20;

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
        text-align: center;

        .balance-label {
          font-size: 16px;
          color: ${({ theme }) => theme.colors.textSecondary};
          margin: 0 0 8px 0;
          font-weight: 500;
        }

        .balance-amount {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          color: ${({ theme }) => theme.colors.text};
        }
      }
    }

    .flow-section {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .flow-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .flow-title {
          font-size: 18px;
          font-weight: 600;
          color: ${({ theme }) => theme.colors.text};
          margin: 0;
        }

        .flow-summary {
          font-size: 14px;
          color: ${({ theme }) => theme.colors.textSecondary};
          margin: 0;
        }
      }

      .metric-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-radius: 12px;
        background: ${({ theme }) => theme.colors.surface};
        transition: all 0.3s ease;
        cursor: pointer;
        border: 2px solid transparent;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: ${({ theme }) => theme.colors.primary};
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          background: ${({ theme }) => theme.colors.primary}08;
          transform: translateY(-2px);
          border-color: ${({ theme }) => theme.colors.primary}30;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

          &::before {
            opacity: 1;
          }
        }

        &:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

    .insights-section {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .progress-section {
        background: ${({ theme }) => theme.colors.surface};
        padding: 20px;
        border-radius: 12px;
        border: 1px solid ${({ theme }) => theme.colors.border};

        .progress-label {
          font-size: 16px;
          font-weight: 600;
          color: ${({ theme }) => theme.colors.text};
          margin: 0 0 16px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: ${({ theme }) => theme.colors.borderLight};
          border-radius: 6px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

          .progress-fill {
            height: 100%;
            border-radius: 6px;
            transition: width 0.5s ease;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
              animation: shimmer 2s infinite;
            }
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      }

      .additional-metrics-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 16px;

        .metric-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px 16px;
          background: ${({ theme }) => theme.colors.surface};
          border-radius: 12px;
          border: 2px solid ${({ theme }) => theme.colors.borderLight};
          transition: all 0.3s ease;
          cursor: help;
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: left 0.5s;
          }

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
            border-color: ${({ theme }) => theme.colors.primary};

            &::before {
              left: 100%;
            }
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
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .metric-label {
            font-size: 13px;
            font-weight: 500;
            color: ${({ theme }) => theme.colors.textSecondary};
            margin: 0 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .metric-value {
            font-size: 18px;
            font-weight: 700;
            margin: 0;
            color: ${({ theme }) => theme.colors.text};
          }
        }
      }
    }

    .filter-section {
      margin-top: 20px;
      padding: 16px 20px;
      background: ${({ theme }) => theme.colors.surface};
      border-radius: 12px;
      border: 1px solid ${({ theme }) => theme.colors.border};
      text-align: center;

      .filter-label {
        font-size: 14px;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 0 0 8px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .filter-value {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        color: ${({ theme }) => theme.colors.primary};
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      padding: 16px;

      .balance-section {
        padding: 16px;

        .balance-content .balance-amount {
          font-size: 28px;
        }
      }

      .flow-section {
        gap: 12px;

        .metric-row {
          padding: 14px 16px;

          .metric-left .metric-label {
            font-size: 15px;
          }

          .metric-right .metric-amount {
            font-size: 16px;
          }
        }
      }

      .insights-section {
        gap: 16px;

        .progress-section {
          padding: 16px;

          .progress-label {
            font-size: 15px;
            margin-bottom: 12px;
          }
        }

        .additional-metrics-section {
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;

          .metric-card {
            padding: 16px 12px;

            .metric-icon {
              width: 28px;
              height: 28px;
              font-size: 13px;
            }

            .metric-label {
              font-size: 12px;
            }

            .metric-value {
              font-size: 16px;
            }
          }
        }
      }

      .filter-section {
        padding: 14px 16px;

        .filter-value {
          font-size: 16px;
        }
      }
    }

    @media (max-width: 480px) {
      .balance-section .balance-content .balance-amount {
        font-size: 24px;
      }

      .additional-metrics-section {
        grid-template-columns: 1fr;
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
            <p className="balance-label">Current Balance</p>
            <h2 className="balance-amount" data-profit={accountBalance > 0}>
              {formatNumber(accountBalance)} USD
            </h2>
          </div>
        </div>

        <div className="flow-section">
          <div className="flow-header">
            <h3 className="flow-title">Cash Flow</h3>
            <p className="flow-summary">
              Income vs Expenses ({daysInPeriod} days)
            </p>
          </div>
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
                    {type === "in" ? "Total Income" : "Total Expenses"}
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

        <div className="insights-section">
          {(data?.subTotal?.in || 0) > 0 && (
            <div className="progress-section">
              <div className="progress-label">
                <span>Spending Efficiency</span>
                <span>
                  {((data?.subTotal?.out || 0) / (data?.subTotal?.in || 1) * 100).toFixed(1)}% spent
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

          <div>
            <h4 className="section-header">Key Metrics</h4>
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
          </div>
        </div>

        <div className="filter-section">
          <p className="filter-label">Active Filter</p>
          <p className="filter-value">{tag?.name || "All Categories"}</p>
        </div>
      </Card>
    </Header>
  );
};

export default TotalContainer;