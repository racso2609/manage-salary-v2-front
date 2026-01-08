import { memo } from "react";
import styled from "styled-components";

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-label {
    white-space: nowrap;
    font-weight: 500;
  }

  .legend-value {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 400;
    margin-left: 4px;
  }
`;

interface ChartLegendProps {
  data: Array<{
    id: string;
    label: string;
    value: number;
    color: string;
  }>;
  total: number;
}

const ChartLegend = memo(({ data, total }: ChartLegendProps) => {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return total > 0 ? `(${(value / total * 100).toFixed(1)}%)` : '';
  };

  return (
    <LegendContainer>
      {data.map((item) => (
        <LegendItem key={item.id}>
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
          />
          <span className="legend-label">{item.label}</span>
          <span className="legend-value">
            {formatValue(item.value)} {formatPercentage(item.value)}
          </span>
        </LegendItem>
      ))}
    </LegendContainer>
  );
});

ChartLegend.displayName = 'ChartLegend';

export default ChartLegend;