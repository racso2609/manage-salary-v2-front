import { memo, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCalendarAlt, faTags, faDollarSign } from "@fortawesome/free-solid-svg-icons";

const TooltipContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 280px;
  font-size: 14px;
  z-index: 1000;
  pointer-events: none;

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

    .category-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .category-name {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      flex: 1;
    }

    .percentage {
      font-size: 12px;
      color: ${({ theme }) => theme.colors.textSecondary};
      font-weight: 500;
    }
  }

  .tooltip-content {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .tooltip-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;

      .icon {
        width: 14px;
        color: ${({ theme }) => theme.colors.primary};
        flex-shrink: 0;
      }

      .label {
        color: ${({ theme }) => theme.colors.textSecondary};
        min-width: 60px;
      }

      .value {
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }

  .tooltip-footer {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-align: center;
  }

  /* Arrow pointer */
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${({ theme }) => theme.colors.surface};
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
  }

  /* Arrow border */
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid ${({ theme }) => theme.colors.border};
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }
`;

interface ChartTooltipProps {
  data: {
    id: string;
    label: string;
    value: number;
    color: string;
  };
  total: number;
  dateRange: { from: string; to: string };
  chartType: 'in' | 'out';
  position?: { x: number; y: number };
  onClear?: () => void;
}

const ChartTooltip = memo(({
  data,
  total,
  dateRange,
  chartType,
  position,
  onClear
}: ChartTooltipProps) => {
  const percentage = useMemo(() => {
    return total > 0 ? ((data.value / total) * 100).toFixed(1) : '0.0';
  }, [data.value, total]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateRange = () => {
    const start = new Date(dateRange.from).toLocaleDateString();
    const end = new Date(dateRange.to).toLocaleDateString();
    return `${start} - ${end}`;
  };

  return (
    <TooltipContainer
      style={{
        position: 'fixed',
        left: position?.x || 0,
        top: position?.y || 0,
        transform: 'translate(-50%, -100%)',
        marginTop: '-8px'
      }}
    >
      <div className="tooltip-header">
        <div
          className="category-color"
          style={{ backgroundColor: data.color }}
        />
        <div className="category-name">{data.label}</div>
        <div className="percentage">{percentage}%</div>
      </div>

      <div className="tooltip-content">
        <div className="tooltip-row">
          <FontAwesomeIcon icon={faDollarSign} className="icon" />
          <span className="label">Amount:</span>
          <span className="value">{formatCurrency(data.value)}</span>
        </div>

        <div className="tooltip-row">
          <FontAwesomeIcon icon={faTags} className="icon" />
          <span className="label">Category:</span>
          <span className="value">{chartType === 'in' ? 'Income' : 'Expense'}</span>
        </div>

        <div className="tooltip-row">
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <span className="label">Period:</span>
          <span className="value">{formatDateRange()}</span>
        </div>
      </div>

      <div className="tooltip-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '4px' }} />
            Filtered by category
          </span>
          {onClear && (
            <button
              onClick={onClear}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
    </TooltipContainer>
  );
});

ChartTooltip.displayName = 'ChartTooltip';

export default ChartTooltip;