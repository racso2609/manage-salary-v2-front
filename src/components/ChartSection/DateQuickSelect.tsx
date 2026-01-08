import { memo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const DateQuickSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
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

const QuickSelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
`;

const QuickSelectButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.border};
  border-radius: 6px;
  background: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, active }) =>
    active ? 'white' : theme.colors.text};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  &:hover {
    background: ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.borderLight};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 10px;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.primary}20;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};

  .chip-label {
    white-space: nowrap;
  }

  .chip-remove {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.danger};
      transform: scale(1.1);
    }
  }
`;

export type DateRange = {
  from: string;
  to: string;
  label: string;
};

interface DateQuickSelectProps {
  currentRange: { from: string; to: string };
  onRangeChange: (range: DateRange) => void;
  onCustomRange: () => void;
}

const DateQuickSelect = memo(({
  currentRange,
  onRangeChange,
  onCustomRange
}: DateQuickSelectProps) => {
  const today = moment();

  const presetRanges: DateRange[] = [
    {
      from: today.clone().subtract(6, 'days').format('YYYY-MM-DD'),
      to: today.format('YYYY-MM-DD'),
      label: 'Last 7 Days'
    },
    {
      from: today.clone().subtract(29, 'days').format('YYYY-MM-DD'),
      to: today.format('YYYY-MM-DD'),
      label: 'Last 30 Days'
    },
    {
      from: today.clone().subtract(89, 'days').format('YYYY-MM-DD'),
      to: today.format('YYYY-MM-DD'),
      label: 'Last 90 Days'
    },
    {
      from: today.clone().startOf('month').format('YYYY-MM-DD'),
      to: today.clone().endOf('month').format('YYYY-MM-DD'),
      label: 'This Month'
    }
  ];

  const getActiveRange = () => {
    return presetRanges.find(range =>
      range.from === currentRange.from && range.to === currentRange.to
    );
  };

  const activeRange = getActiveRange();

  return (
    <DateQuickSelectContainer>
      <SectionHeader>
        <FontAwesomeIcon icon={faCalendarAlt} className="header-icon" />
        Quick Date Ranges
      </SectionHeader>

      <QuickSelectGrid>
        {presetRanges.map((range, index) => (
          <QuickSelectButton
            key={index}
            active={activeRange?.label === range.label}
            onClick={() => onRangeChange(range)}
          >
            {range.label}
          </QuickSelectButton>
        ))}

        <QuickSelectButton onClick={onCustomRange}>
          Custom Range
        </QuickSelectButton>
      </QuickSelectGrid>

      {activeRange && (
        <ActiveFilters>
          <FilterChip>
            <span className="chip-label">{activeRange.label}</span>
            <div
              className="chip-remove"
              onClick={onCustomRange}
              title="Clear date filter"
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </FilterChip>
        </ActiveFilters>
      )}
    </DateQuickSelectContainer>
  );
});

DateQuickSelect.displayName = 'DateQuickSelect';

export default DateQuickSelect;