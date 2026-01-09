import React, { FC, memo, useMemo, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faPercent,
  faCalendarDay,
  faToggleOn,
  faToggleOff,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "../utils/card";
import { formatNumber } from "../../utils/formatter/numbers";
import moment from "moment";
import useInsights from "../../hooks/fetching/useInsights";
import Button from "../ui/Button";

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
          content: "";
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

        /* Optimize for reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          &,
          &:hover,
          &:active {
            transform: none;
            transition: none;
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
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
              );
              animation: shimmer 2s infinite;
            }
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
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
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
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

          /* Optimize for reduced motion preference */
          @media (prefers-reduced-motion: reduce) {
            &,
            &:hover {
              transform: none;
              transition: none;

              &::before {
                animation: none;
              }
            }
          }

          &.loading {
            .metric-icon {
              background: ${({ theme }) => theme.colors.border};
              animation: pulse 1.5s ease-in-out infinite;
            }

            .metric-label {
              background: ${({ theme }) => theme.colors.border};
              color: transparent;
              border-radius: 4px;
              animation: pulse 1.5s ease-in-out infinite;
              animation-delay: 0.1s;
            }

            .metric-value {
              background: ${({ theme }) => theme.colors.border};
              color: transparent;
              border-radius: 4px;
              animation: pulse 1.5s ease-in-out infinite;
              animation-delay: 0.2s;
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
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
    @media (max-width: 1024px) {
      .balance-section .balance-content .balance-amount {
        font-size: 30px;
      }

      .flow-section .metric-row {
        .metric-left .metric-label {
          font-size: 16px;
        }

        .metric-right .metric-amount {
          font-size: 17px;
        }
      }
    }

    @media (max-width: 768px) {
      padding: 16px;

      .balance-section {
        padding: 16px;
        margin-bottom: 16px;

        .balance-content {
          .balance-amount {
            font-size: 28px;
          }

          .balance-subtitle {
            font-size: 11px;
          }
        }

        .balance-toggle {
          padding: 3px 6px;
          font-size: 11px;
        }
      }

      .flow-section {
        gap: 12px;

        .flow-header {
          .flow-title {
            font-size: 17px;
          }

          .flow-summary {
            font-size: 13px;
          }
        }

        .metric-row {
          padding: 14px 16px;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;

          .metric-left {
            width: 100%;

            .metric-label {
              font-size: 15px;
            }
          }

          .metric-right {
            width: 100%;
            text-align: left;

            .metric-amount {
              font-size: 16px;
            }
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
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
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

        .filter-label {
          font-size: 13px;
        }

        .filter-value {
          font-size: 16px;
        }
      }
    }

    @media (max-width: 480px) {
      padding: 12px;

      .balance-section {
        padding: 12px;

        .balance-content .balance-amount {
          font-size: 24px;
        }

        .balance-toggle {
          padding: 2px 4px;
          font-size: 10px;
        }
      }

      .additional-metrics-section {
        grid-template-columns: 1fr;
        gap: 8px;

        .metric-card {
          padding: 12px 8px;

          .metric-icon {
            width: 24px;
            height: 24px;
            font-size: 12px;
          }

          .metric-label {
            font-size: 11px;
          }

          .metric-value {
            font-size: 14px;
          }
        }
      }

      .flow-section .metric-row {
        padding: 12px;

        .metric-label {
          font-size: 14px;
        }

        .metric-amount {
          font-size: 15px;
        }
      }
    }
  }
`;

interface TotalContainerProps {
  currentYearBalance: number;
  allTimeBalance: number;
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
  dashboardData?: {
    totals: {
      income: string;
      expenses: string;
      savingsRate: number;
      balance: string;
    };
  };
}

const BalanceContainer = styled.section`
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.primary}10,
        ${({ theme }) => theme.colors.secondary}10
      );
      border-radius: 12px;
      border: 1px solid ${({ theme }) => theme.colors.primary}20;


.left-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;

      .icon-container {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        background: ${({ theme }) => theme.colors.primary};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
}

     

        .balance-header {
          display: flex;
        flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;


          .balance-label {
            font-size: 16px;
            color: ${({ theme }) => theme.colors.textSecondary};
            margin: 0;
          }

          .balance-toggle {

            background: ${({ theme }) => theme.colors.primary};
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            border-radius: 16px;
            color: white;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              background: ${({ theme }) => theme.colors.primary}10;
              border-color: ${({ theme }) => theme.colors.primary};
              color: ${({ theme }) => theme.colors.primary};
            }

            .toggle-text {
              font-weight: 500;
            }
          }

        .balance-amount {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: ${({ theme }) => theme.colors.text};
        }

        .balance-subtitle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: ${({ theme }) => theme.colors.textSecondary};
          margin: 0;
          opacity: 0.8;
        }
      }

        .balance-amount {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          color: ${({ theme }) => theme.colors.text};
        }
    }

    @media (max-width: 1024px) {
        font-size: 30px;
       .balance-content .balance-amount {
        font-size: 30px;
      }
    }



`;

export const BalanceSection: FC<{
  currentYearBalance: number;
  allTimeBalance: number;
}> = ({ currentYearBalance, allTimeBalance }) => {
  const [showAllTimeBalance, setShowAllTimeBalance] = useState(false);
  return (
    <BalanceContainer>
      <div className="balance-header">
        <div className="left-section">
          <div className="icon-container">
            <FontAwesomeIcon icon={faWallet} />
          </div>
          <span className="balance-label">
            {showAllTimeBalance ? "All Time Balance" : "Current Year Balance"}
          </span>
        </div>
        <span
          onClick={() => setShowAllTimeBalance(!showAllTimeBalance)}
          className="balance-toggle"
        >
          {" "}
          <FontAwesomeIcon
            icon={showAllTimeBalance ? faToggleOn : faToggleOff}
          />
          <span className="toggle-text">
            {showAllTimeBalance ? "All Time" : "This Year"}
          </span>
        </span>
      </div>

      <h2
        className="balance-amount"
        data-profit={
          (showAllTimeBalance ? allTimeBalance : currentYearBalance) > 0
        }
      >
        {formatNumber(showAllTimeBalance ? allTimeBalance : currentYearBalance)}{" "}
        USD
      </h2>
    </BalanceContainer>
  );
};

const TotalContainer = memo(
  ({
    data,
    tag,
    onChartTypeChange,
    isLoading,
    dateRange,
    dashboardData,
  }: TotalContainerProps) => {
    const { data: insights } = useInsights({
      from: dateRange.from,
      to: dateRange.to,
    });

    // Memoize expensive calculations
    const metrics = useMemo(() => {
      const income = dashboardData
        ? Number(dashboardData.totals.income) / 100
        : 0;
      const expenses = dashboardData
        ? Number(dashboardData.totals.expenses) / 100
        : 0;
      const netFlow = income - expenses;
      const savingsRate = dashboardData?.totals.savingsRate || 0;

      // Calculate number of days in the current period
      const startDate = moment(dateRange.from || moment().startOf("year"));
      const endDate = moment(dateRange.to || moment().endOf("year"));
      const daysInPeriod = Math.max(1, endDate.diff(startDate, "days") + 1);

      // Get daily average from insights patterns or calculate
      const dailyAverage =
        insights?.patterns &&
        insights.patterns.length > 0 &&
        insights.patterns[0].data &&
        insights.patterns[0].data.length > 0
          ? insights.patterns[0].data[0]
          : expenses / daysInPeriod;

      return {
        income,
        expenses,
        netFlow,
        savingsRate,
        daysInPeriod,
        dailyAverage,
      };
    }, [dashboardData, insights, dateRange.from, dateRange.to]);

    const {
      income,
      expenses,
      netFlow,
      savingsRate,
      daysInPeriod,
      dailyAverage,
    } = metrics;

    return (
      <Header>
        <Card
          background="gray"
          width={"100%"}
          radius="10px"
          className="total-container"
        >
          <div className="flow-section">
            <div className="flow-header">
              <h3 className="flow-title">Cash Flow</h3>
              <p className="flow-summary">
                Income vs Expenses ({daysInPeriod} days)
              </p>
            </div>
            {(["in", "out"] as const).map((type) => {
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
                    if (e.key === "Enter" || e.key === " ") {
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
                        backgroundColor: isIncome ? "#4caf50" : "#f44336",
                        color: "white",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={isIncome ? faArrowUp : faArrowDown}
                      />
                    </div>
                    <h3 className="metric-label">
                      {type === "in" ? "Total Income" : "Total Expenses"}
                    </h3>
                  </div>
                  <div className="metric-right">
                    <h3 className="metric-amount" data-profit={isPositive}>
                      {formatNumber(amount)}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="insights-section">
            {income > 0 && (
              <div className="progress-section">
                <div className="progress-label">
                  <span>Spending Efficiency</span>
                  <span>{((expenses / income) * 100).toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min((expenses / income) * 100, 100)}%`,
                      backgroundColor:
                        expenses > income ? "#f44336" : "#4caf50",
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <h4 className="section-header">Key Metrics</h4>
              <div className="additional-metrics-section">
                <div
                  className={`metric-card ${isLoading ? "loading" : ""}`}
                  title="Net Flow = Income - Expenses. Positive values indicate you're saving money."
                >
                  <div
                    className="metric-icon"
                    style={{
                      backgroundColor: isLoading
                        ? undefined
                        : netFlow >= 0
                          ? "#4caf50"
                          : "#f44336",
                      color: "white",
                    }}
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <p className="metric-label">
                    {isLoading ? "\u00A0" : "Net Flow"}
                  </p>
                  <p
                    className="metric-value"
                    style={{
                      color: isLoading
                        ? undefined
                        : netFlow >= 0
                          ? "#4caf50"
                          : "#f44336",
                    }}
                  >
                    {isLoading
                      ? "\u00A0\u00A0\u00A0\u00A0\u00A0"
                      : `${netFlow >= 0 ? "+" : ""}${formatNumber(netFlow)}`}
                  </p>
                </div>

                <div
                  className={`metric-card ${isLoading ? "loading" : ""}`}
                  title="Savings Rate = (Income - Expenses) / Income × 100%. Shows what percentage of your income you're saving."
                >
                  <div
                    className="metric-icon"
                    style={{
                      backgroundColor: isLoading
                        ? undefined
                        : savingsRate >= 0
                          ? "#4caf50"
                          : "#f44336",
                      color: "white",
                    }}
                  >
                    <FontAwesomeIcon icon={faPercent} />
                  </div>
                  <p className="metric-label">
                    {isLoading ? "\u00A0" : "Savings Rate"}
                  </p>
                  <p
                    className="metric-value"
                    style={{
                      color: isLoading
                        ? undefined
                        : savingsRate >= 0
                          ? "#4caf50"
                          : "#f44336",
                    }}
                  >
                    {isLoading
                      ? "\u00A0\u00A0\u00A0\u00A0"
                      : `${savingsRate >= 0 ? "+" : ""}${savingsRate.toFixed(1)}%`}
                  </p>
                </div>

                <div
                  className={`metric-card ${isLoading ? "loading" : ""}`}
                  title={`Daily Average = Total Expenses ÷ ${daysInPeriod} days. Shows your average daily spending.`}
                >
                  <div
                    className="metric-icon"
                    style={{
                      backgroundColor: isLoading ? undefined : "#2196f3",
                      color: "white",
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendarDay} />
                  </div>
                  <p className="metric-label">
                    {isLoading ? "\u00A0" : "Daily Avg"}
                  </p>
                  <p
                    className="metric-value"
                    style={{ color: isLoading ? undefined : "#2196f3" }}
                  >
                    {isLoading
                      ? "\u00A0\u00A0\u00A0\u00A0\u00A0"
                      : formatNumber(dailyAverage)}
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
  },
);

TotalContainer.displayName = "TotalContainer";

// Error Boundary Component
class TotalContainerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("TotalContainer error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card
          background="gray"
          width="100%"
          radius="10px"
          className="total-container"
        >
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "#f44336",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>
              Unable to load financial data
            </h3>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
              Please refresh the page or try again later.
            </p>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Wrap with error boundary
const TotalContainerWithErrorBoundary = (props: TotalContainerProps) => (
  <TotalContainerErrorBoundary>
    <TotalContainer {...props} />
  </TotalContainerErrorBoundary>
);

export default TotalContainerWithErrorBoundary;
