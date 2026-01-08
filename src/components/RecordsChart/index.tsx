import { HighlightItemData, PieChart } from "@mui/x-charts";
import { Record } from "../../types/manageSalaryTypes/records";
import { useMemo, useState } from "react";

export type RecordsChart = {
  records: Record[];
  onTagClick?: (tagId: string) => void;
};

const RecordsChart = ({ records, onTagClick }: RecordsChart) => {
  const [highlightedItem, setHighlightedItem] =
    useState<HighlightItemData | null>(null);

  const formattedData = useMemo(() => {
    setHighlightedItem(null);
    return records
      .map((value) => {
        return {
          id: value.tag._id,
          value: Number(value.amount),

          label: (location: string) =>
            (location !== "legend" ? value.tag.name : undefined) as string,
        };
      })
      .reduce(
        (acc, value) => {
          const indexOf = acc.findIndex((record) => record.id === value.id);
          if (acc[indexOf]) acc[indexOf].value += value.value;
          else acc.push(value);

          return acc;
        },
        [] as {
          id: string;
          value: number;
          label: (location: string) => string;
        }[],
      );
  }, [records]);

  return (
    <>
      <PieChart
        height={200}
        onItemClick={(_, item, params) => {
          if (item.dataIndex === highlightedItem?.dataIndex)
            setHighlightedItem(null);
          else setHighlightedItem(item);
          onTagClick?.(params.id?.toString() || "");
        }}
        highlightedItem={highlightedItem}
        series={[
          {
            data: formattedData,

            highlightScope: { fade: "global", highlight: "item" },

            innerRadius: 30,
            paddingAngle: 5,
            cornerRadius: 5,
          },
        ]}
      />
    </>
  );
};

export default RecordsChart;
