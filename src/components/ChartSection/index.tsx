import { memo, useState, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faChartBar,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { PieChart, BarChart } from "@mui/x-charts";
import { Record } from "../../types/manageSalaryTypes/records";
import DateQuickSelect, { DateRange } from "./DateQuickSelect";
import ChartInsights from "./ChartInsights";
import ChartExport from "./ChartExport";
import ChartTooltip from "./ChartTooltip";
import ChartLegend from "./ChartLegend";

const ChartSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .chart-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: ${({ theme }) => theme.colors.primary};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .chart-title {
      font-size: 18px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      margin: 0;
    }
  }

  .header-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;

    .header-left {
      justify-content: center;
    }

    .header-right {
      justify-content: center;
    }
  }
`;

const ChartTypeToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
  padding: 4px;
  gap: 4px;

  .toggle-button {
    flex: 1;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      background: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.text};
    }

    &.active {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
`;

const ChartControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .control-button {
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background: ${({ theme }) => theme.colors.primary}10;
      border-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.primary};
    }

    &:active {
      transform: translateY(1px);
    }

    &.active {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ChartContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: 20px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  .chart-wrapper {
    width: 100%;
    height: 100%;
    min-height: 250px;
  }

  /* Loading skeleton */
  &.loading {
    .skeleton {
      width: 100%;
      height: 250px;
      background: ${({ theme }) => theme.colors.borderLight};
      border-radius: 8px;
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }
    }

    @keyframes shimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 16px;

    .chart-wrapper {
      min-height: 200px;
    }
  }
`;

interface ChartSectionProps {
  records: Record[];
  chartType: 'in' | 'out';
  onTagClick?: (tagId: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: DateRange) => void;
}

type ChartType = "pie" | "bar";

const ChartSection = memo(
  ({
    records,
    chartType,
    onTagClick,
    isLoading = false,
    onRefresh,
    dateRange,
    onDateRangeChange
  }: ChartSectionProps) => {
    const [selectedChartType, setSelectedChartType] =
      useState<ChartType>("pie");
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const formattedData = useMemo(() => {
      // Generate colors for tags since Tag type doesn't include color
      const colors = [
        "#2196f3",
        "#4caf50",
        "#ff9800",
        "#f44336",
        "#9c27b0",
        "#00bcd4",
        "#8bc34a",
        "#ffc107",
      ];

      return records
        .map((record, index) => ({
          id: record.tag._id,
          value: Number(record.amount),
          label: record.tag.name,
          color: colors[index % colors.length],
        }))
        .reduce(
          (acc, item) => {
            const existing = acc.find((record) => record.id === item.id);
            if (existing) {
              existing.value += item.value;
            } else {
              acc.push(item);
            }
            return acc;
          },
          [] as Array<{
            id: string;
            value: number;
            label: string;
            color: string;
          }>,
        );
    }, [records]);

    const chartTitle =
      chartType === "in" ? "Income Breakdown" : "Expense Breakdown";

  const handleRefresh = () => {
    onRefresh?.();
  };

  const handleItemClick = (item: any) => {
    if (item?.dataIndex !== undefined && formattedData[item.dataIndex]) {
      setSelectedItem(selectedItem?.dataIndex === item.dataIndex ? null : formattedData[item.dataIndex]);
    }
    onTagClick?.(item.dataIndex?.toString() || "");
  };

    return (
      <ChartSectionContainer>
        <ChartHeader>
          <div className="header-left">
            <div className="chart-icon">
              {selectedChartType === "pie" ? (
                <FontAwesomeIcon icon={faChartPie} />
              ) : (
                <FontAwesomeIcon icon={faChartBar} />
              )}
            </div>
            <h3 className="chart-title">{chartTitle}</h3>
          </div>

          <div className="header-right">
            <ChartTypeToggle>
              <button
                className={`toggle-button ${selectedChartType === "pie" ? "active" : ""}`}
                onClick={() => setSelectedChartType("pie")}
              >
                <FontAwesomeIcon icon={faChartPie} />
                Pie
              </button>
              <button
                className={`toggle-button ${selectedChartType === "bar" ? "active" : ""}`}
                onClick={() => setSelectedChartType("bar")}
              >
                <FontAwesomeIcon icon={faChartBar} />
                Bar
              </button>
            </ChartTypeToggle>

          <ChartControls>
            <button className="control-button" onClick={handleRefresh}>
              <FontAwesomeIcon icon={faSync} />
              Refresh
            </button>
          </ChartControls>
          </div>
        </ChartHeader>

        <ChartContainer className={isLoading ? "loading" : ""}>
          {isLoading ? (
            <div className="skeleton" />
          ) : (
            <div className="chart-wrapper">
              {selectedChartType === "pie" ? (
                <PieChart
                  height={250}
                  series={[
                    {
                      data: formattedData,
                      innerRadius: 30,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      highlightScope: { fade: "global", highlight: "item" },
                    },
                  ]}
                  onItemClick={(_, item) => handleItemClick(item)}
                />
              ) : (
                <BarChart
                  height={250}
                  xAxis={[
                    {
                      data: formattedData.map((item) => item.label),
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      data: formattedData.map((item) => item.value),
                      color: "#2196f3",
                    },
                  ]}
                onItemClick={(_, item) => handleItemClick(item)}
                />
              )}
            </div>
          )}
        </ChartContainer>

        <ChartLegend
          data={formattedData}
          total={formattedData.reduce((sum, item) => sum + item.value, 0)}
        />

        <DateQuickSelect
            currentRange={dateRange}
            onRangeChange={onDateRangeChange}
            onCustomRange={() => {
              // Reset to show all data (remove date filter)
              onDateRangeChange({
                from: '',
                to: '',
                label: 'All Time'
              });
            }}
          />

        <ChartInsights
          records={records}
          chartType={chartType}
          dateRange={dateRange}
        />

        <ChartExport
          records={records}
          chartType={chartType}
          dateRange={dateRange}
        />

        {selectedItem && (
          <ChartTooltip
            data={selectedItem}
            total={formattedData.reduce((sum, item) => sum + item.value, 0)}
            dateRange={dateRange}
            chartType={chartType}
            position={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
          />
        )}
      </ChartSectionContainer>
    );
  },
);

ChartSection.displayName = "ChartSection";

export default ChartSection;

