import { Record } from "../../types/manageSalaryTypes/records";
import { useMemo } from "react";
import styled from "styled-components";

export type RecordsChart = {
  records: Record[];
  onTagClick?: (tagId: string) => void;
};

const ChartContainer = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`;

const ChartItem = styled.div<{ isSelected: boolean }>`
  padding: 8px;
  background: ${({ theme, isSelected }) => isSelected ? theme.colors.primary + "33" : theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  &:hover {
    background: ${({ theme }) => theme.colors.primary + "22"};
  }
`;

const RecordsChart = ({ records, onTagClick }: RecordsChart) => {
  const formattedData = useMemo(() => {
    return records
      .map((value) => ({
        id: value.tag._id,
        name: value.tag.name,
        value: Number(value.amount),
      }))
      .reduce((acc, value) => {
        const existing = acc.find((item) => item.id === value.id);
        if (existing) {
          existing.value += value.value;
        } else {
          acc.push(value);
        }
        return acc;
      }, [] as { id: string; name: string; value: number }[]);
  }, [records]);

  return (
    <ChartContainer>
      {formattedData.map((item) => (
        <ChartItem
          key={item.id}
          isSelected={false} // No selection for now
          onClick={() => onTagClick?.(item.id)}
        >
          <span>{item.name}</span>
          <span>${item.value.toFixed(2)}</span>
        </ChartItem>
      ))}
    </ChartContainer>
  );
};

export default RecordsChart;
