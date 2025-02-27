import { PieChart } from "@mui/x-charts";
import { Record } from "../../types/manageSalaryTypes/records";
import { useMemo } from "react";

export type RecordsChart = {
  records: Record[];
};

const RecordsChart = ({ records }: RecordsChart) => {
  const formattedData = useMemo(() => {
    return records
      .map((value) => {
        return {
          id: value.tag.name,
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
        series={[
          {
            data: formattedData,
            arcLabel: (params) => params.label ?? "",
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
