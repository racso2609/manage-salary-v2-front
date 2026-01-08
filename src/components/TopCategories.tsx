import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faTag,
  faArrowUp,
  faArrowDown,
  faTrophy,
  faMedal,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "./utils/card";

const CategoryCard = styled(Card)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    border-color: ${({ theme }) => theme.colors.primary}40;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .category-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .category-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        position: relative;

        .rank-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${({ theme }) => theme.colors.primary};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid ${({ theme }) => theme.colors.surface};
        }
      }

      .category-details {
        .category-name {
          font-size: 16px;
          font-weight: 600;
          color: ${({ theme }) => theme.colors.text};
          margin: 0 0 4px 0;
        }

        .category-rank {
          font-size: 12px;
          color: ${({ theme }) => theme.colors.textSecondary};
          background: ${({ theme }) => theme.colors.primary}15;
          padding: 3px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;

          .rank-icon {
            font-size: 10px;
          }
        }
      }
    }

    .category-amount {
      text-align: right;

      .amount {
        font-size: 20px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text};
        margin: 0 0 6px 0;
      }

      .percentage {
        font-size: 12px;
        color: ${({ theme }) => theme.colors.textSecondary};
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;

        &.positive {
          color: #4caf50;
        }

        &.negative {
          color: #f44336;
        }

        &.neutral {
          color: ${({ theme }) => theme.colors.textSecondary};
        }
      }
    }
  }

  .progress-section {
    margin-bottom: 14px;

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
      color: ${({ theme }) => theme.colors.textSecondary};

      .progress-percentage {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.primary};
      }
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: ${({ theme }) => theme.colors.borderLight};
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

      .progress-fill {
        height: 100%;
        background: linear-gradient(
          90deg,
          ${({ theme }) => theme.colors.primary},
          ${({ theme }) => theme.colors.secondary}
        );
        border-radius: 5px;
        transition: width 0.6s ease;
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
          animation: shimmer 2.5s infinite;
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

  .category-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textSecondary};

    .transaction-count {
      display: flex;
      align-items: center;
      gap: 4px;

      .count-icon {
        font-size: 9px;
      }
    }

    .last-updated {
      font-style: italic;
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .category-amount {
        text-align: left;
        align-self: flex-end;
      }
    }

    .category-icon {
      width: 40px !important;
      height: 40px !important;
    }

    .amount {
      font-size: 18px !important;
    }
  }
`;

const TopCategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 8px;

    .header-icon {
      width: 28px;
      height: 28px;
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  .categories-grid {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

    max-height: 600px;
    overflow-y: auto;

    @media (max-width: 76px) {
      gap: 14px;
    }
  }

  .loading-skeleton {
    .skeleton-card {
      background: ${({ theme }) => theme.colors.surface};
      border: 1px solid ${({ theme }) => theme.colors.borderLight};
      border-radius: 12px;
      padding: 24px;
      animation: pulse 1.5s ease-in-out infinite;

      .skeleton-line {
        height: 18px;
        background: ${({ theme }) => theme.colors.borderLight};
        border-radius: 4px;
        margin-bottom: 10px;

        &:nth-child(1) {
          width: 60%;
        }
        &:nth-child(2) {
          width: 40%;
          margin-bottom: 16px;
        }
        &:nth-child(3) {
          width: 80%;
          height: 12px;
        }
        &:nth-child(4) {
          width: 50%;
          height: 12px;
          margin-bottom: 12px;
        }
        &:nth-child(5) {
          width: 70%;
          height: 14px;
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
`;

interface TopCategoriesProps {
  topCategories: Array<{ tag: any; total: number }>;
  onTagClick: (tagId: string) => void;
  isLoading?: boolean;
}

const TopCategories = ({
  topCategories,
  onTagClick,
  isLoading = false,
}: TopCategoriesProps) => {
  // Calculate total for percentage calculations
  const totalAmount = topCategories.reduce((sum, cat) => sum + cat.total, 0);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return faTrophy;
      case 2:
        return faMedal;
      case 3:
        return faAward;
      default:
        return faTag;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700";
      case 2:
        return "#C0C0C0";
      case 3:
        return "#CD7F32";
      default:
        return "#667eea";
    }
  };

  if (isLoading && !topCategories.length) {
    return (
      <TopCategoriesContainer>
        <h3 className="section-header">
          <FontAwesomeIcon icon={faChartBar} className="header-icon" />
          Top Spending Categories
        </h3>
        <div className="categories-grid loading-skeleton">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      </TopCategoriesContainer>
    );
  }

  return (
    <TopCategoriesContainer>
      <h3 className="section-header">
        <FontAwesomeIcon icon={faChartBar} className="header-icon" />
        Top Spending Categories
      </h3>

      <div className="categories-grid">
        {topCategories.map(({ tag, total }, index) => {
          const rank = index + 1;
          const percentage = totalAmount > 0 ? (total / totalAmount) * 100 : 0;
          // Mock trend data - in real app this would come from analytics
          const trend = Math.random() > 0.5 ? "up" : "down";
          const trendValue = (Math.random() * 25 + 5).toFixed(1);

          return (
            <CategoryCard
              key={tag._id}
              onClick={() => onTagClick(tag._id)}
              radius="12px"
              style={{ flex: 1 }}
            >
              <div className="card-header">
                <div className="category-info">
                  <div
                    className="category-icon"
                    style={{
                      background: `linear-gradient(135deg, ${getRankColor(rank)}, ${getRankColor(rank)}dd)`,
                    }}
                  >
                    <FontAwesomeIcon icon={faTag} />
                    <div className="rank-badge">{rank}</div>
                  </div>
                  <div className="category-details">
                    <h4 className="category-name">{tag.name}</h4>
                    <span className="category-rank">
                      <FontAwesomeIcon
                        icon={getRankIcon(rank)}
                        className="rank-icon"
                      />
                      Rank #{rank}
                    </span>
                  </div>
                </div>

                <div className="category-amount">
                  <div className="amount">${total.toLocaleString()}</div>
                  <div className={`percentage ${trend}`}>
                    <FontAwesomeIcon
                      icon={trend === "up" ? faArrowUp : faArrowDown}
                      style={{ fontSize: "11px" }}
                    />
                    {trendValue}%
                  </div>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span>Share of total spending</span>
                  <span className="progress-percentage">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="category-footer">
                <div className="transaction-count">
                  <FontAwesomeIcon icon={faTag} className="count-icon" />
                  Top spender
                </div>
                <div className="last-updated">Live data</div>
              </div>
            </CategoryCard>
          );
        })}
      </div>
    </TopCategoriesContainer>
  );
};

export default TopCategories;

