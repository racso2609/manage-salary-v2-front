import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faTag,
  faCalendarAlt,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { Record } from "../types/manageSalaryTypes/records";
import { Card } from "./utils/card";

const TransactionCard = styled(Card)<{ transactionType?: "in" | "out" }>`
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

  .transaction-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 8px;

    .transaction-info {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
      min-width: 0;

      .transaction-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${({ transactionType, theme }) =>
          transactionType === "in"
            ? theme.colors.success || "#10b981"
            : theme.colors.danger || "#ef4444"};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        flex-shrink: 0;
      }

      .transaction-details {
        flex: 1;
        min-width: 0;

        .transaction-description {
          font-size: 15px;
          font-weight: 600;
          color: ${({ theme }) => theme.colors.text};
          margin: 0 0 6px 0;
          line-height: 1.4;
          word-break: break-word;
        }

        .transaction-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: ${({ theme }) => theme.colors.textSecondary};
          flex-wrap: wrap;

          .category-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            background: ${({ theme }) => theme.colors.primary}15;
            color: ${({ theme }) => theme.colors.primary};
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 500;

            .badge-icon {
              font-size: 9px;
            }
          }

          .date-info {
            display: flex;
            align-items: center;
            gap: 3px;

            .date-icon {
              font-size: 9px;
            }
          }
        }
      }
    }

    .transaction-amount {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;

      .amount {
        font-size: 18px;
        font-weight: 700;
        color: ${({ transactionType, theme }) =>
          transactionType === "in"
            ? theme.colors.success || "#10b981"
            : theme.colors.danger || "#ef4444"};
        line-height: 1.2;
      }

      .amount-type {
        font-size: 11px;
        color: ${({ theme }) => theme.colors.textSecondary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
        background: ${({ theme }) => theme.colors.borderLight};
        padding: 2px 6px;
        border-radius: 4px;
      }
    }
  }

  .transaction-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid ${({ theme }) => theme.colors.borderLight};

    .action-button {
      padding: 4px 8px;
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: 4px;
      background: transparent;
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 3px;

      &:hover {
        background: ${({ theme }) => theme.colors.primary}10;
        border-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }

  @media (max-width: 768px) {
    padding: 12px;

    .transaction-header {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;

      .transaction-info {
        gap: 10px;
      }

      .transaction-amount {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        text-align: left;

        .amount {
          font-size: 16px;
        }

        .amount-type {
          margin-left: 8px;
        }
      }
    }

    .transaction-icon {
      width: 36px;
      height: 36px;
    }

    .transaction-description {
      font-size: 14px;
    }

    .transaction-actions {
      margin-top: 8px;
      padding-top: 6px;

      .action-button {
        padding: 3px 6px;
        font-size: 10px;
      }
    }
  }
`;

const RecentTransactionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .section-header {
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

  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    padding-right: 6px;
    max-height: 600px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.borderLight};
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.border};
      border-radius: 3px;

      &:hover {
        background: ${({ theme }) => theme.colors.primary}60;
      }
    }
  }

  .loading-skeleton {
    .skeleton-card {
      background: ${({ theme }) => theme.colors.surface};
      border: 1px solid ${({ theme }) => theme.colors.borderLight};
      border-radius: 12px;
      padding: 16px;
      animation: pulse 1.5s ease-in-out infinite;

      .skeleton-line {
        height: 14px;
        background: ${({ theme }) => theme.colors.borderLight};
        border-radius: 4px;
        margin-bottom: 8px;

        &:nth-child(1) {
          width: 70%;
        }
        &:nth-child(2) {
          width: 40%;
          margin-bottom: 12px;
        }
        &:nth-child(3) {
          width: 50%;
          height: 12px;
        }
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
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: ${({ theme }) => theme.colors.textSecondary};

    .empty-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      opacity: 0.5;
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .empty-description {
      font-size: 14px;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    .transactions-list {
      max-height: 300px;
    }
  }
`;

interface RecentTransactionsProps {
  recentTransactions: Record[];
  onTransactionClick?: (transaction: Record) => void;
  isLoading?: boolean;
}

const RecentTransactions = ({
  recentTransactions,
  onTransactionClick,
  isLoading = false,
}: RecentTransactionsProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getTransactionIcon = (type: string) => {
    return type === "in" ? faArrowUp : faArrowDown;
  };

  if (isLoading && !recentTransactions.length) {
    return (
      <RecentTransactionsContainer>
        <h3 className="section-header">
          <FontAwesomeIcon icon={faHistory} className="header-icon" />
          Recent Transactions
        </h3>
        <div className="transactions-list loading-skeleton">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      </RecentTransactionsContainer>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <RecentTransactionsContainer>
        <h3 className="section-header">
          <FontAwesomeIcon icon={faHistory} className="header-icon" />
          Recent Transactions
        </h3>
        <div className="empty-state">
          <FontAwesomeIcon icon={faHistory} className="empty-icon" />
          <div className="empty-title">No transactions yet</div>
          <div className="empty-description">
            Your recent transactions will appear here
          </div>
        </div>
      </RecentTransactionsContainer>
    );
  }

  return (
    <RecentTransactionsContainer>
      <h3 className="section-header">
        <FontAwesomeIcon icon={faHistory} className="header-icon" />
        Recent Transactions
      </h3>

      <div className="transactions-list">
        {recentTransactions.map((transaction) => (
          <TransactionCard
            key={transaction._id}
            onClick={() => onTransactionClick?.(transaction)}
            radius="12px"
            transactionType={transaction.type}
          >
            <div className="transaction-header">
              <div className="transaction-info">
                <div className="transaction-icon">
                  <FontAwesomeIcon
                    icon={getTransactionIcon(transaction.type)}
                  />
                </div>
                <div className="transaction-details">
                  <div className="transaction-description">
                    {transaction.description}
                  </div>
                  <div className="transaction-meta">
                    <span className="category-badge">
                      <FontAwesomeIcon icon={faTag} className="badge-icon" />
                      {transaction.tag.name}
                    </span>
                    <span className="date-info">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="date-icon"
                      />
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="transaction-amount">
                <div className="amount">
                  ${Number(transaction.amount).toLocaleString()}
                </div>
                <div className="amount-type">{transaction.type}</div>
              </div>
            </div>

            {
              // <div className="transaction-actions">
              //   <button className="action-button" onClick={(e) => {
              //     e.stopPropagation();
              //     // Handle edit action
              //     console.log('Edit transaction:', transaction._id);
              //   }}>
              //     Edit
              //   </button>
              //   <button className="action-button" onClick={(e) => {
              //     e.stopPropagation();
              //     // Handle view action
              //     console.log('View transaction:', transaction._id);
              //   }}>
              //     View
              //   </button>
              // </div>
              //
            }
          </TransactionCard>
        ))}
      </div>
    </RecentTransactionsContainer>
  );
};

export default RecentTransactions;

