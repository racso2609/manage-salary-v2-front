// export type useDashboardInfo = {};

import useSWR from "swr";
import { useAuthContext } from "../../context/AuthContext";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { Record as RecordType } from "../../types/manageSalaryTypes/records";
import { formatBnNumber } from "../../utils/formatter/numbers";

type propsType = {
  tag?: string;
  from?: string;
  to?: string;
};

const useDashboardInfo = ({ tag, from, to }: propsType = {}) => {
  const { sessionToken } = useAuthContext();

  return useSWR<{
    total: number;
    subTotal: Record<string, number>;
    records: Record<
      string,
      {
        records: RecordType[];
        total: string | number;
      }
    >;
  }>(`/dashboard-info?tag${tag}&from=${from}&to=${to}`, async () => {
    const params = new URLSearchParams({});
    if (tag) params.set("tag", tag);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const data = await manageSalaryFetcher<{
      total: string;
      records: {
        _id: string;
        total: string;
        records: RecordType[];
      }[];
      totalIn: string;
      totalOut: string;
    }>(`/records/dashboard?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    console.log("=== data", data);

    const total = formatBnNumber(data.total);
    const totalIn = formatBnNumber(data.totalIn);
    const totalOut = formatBnNumber(data.totalOut);

    const records = data.records.reduce(
      (acc, record) => {
        acc[record._id] = {
          records: record.records.map((r) => ({
            ...r,
            amount: formatBnNumber(r.amount),
          })),
          total: formatBnNumber(record.total),
        };

        return acc;
      },
      {} as Record<string, { records: RecordType[]; total: string | number }>,
    );

    // const inRecords =
    // data.records.find((record) => record._id === "in")?.records ?? [];
    // const outRecords =
    // data.records.find((record) => record._id === "out")?.records ?? [];

    return {
      total,
      records,
      subTotal: {
        in: totalIn,
        out: totalOut,
      },
    };
  });
};

export default useDashboardInfo;
