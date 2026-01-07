// export type useDashboardInfo = {};

import useSWR from "swr";
import { useAuthContext } from "../../context/AuthContext";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { Record as RecordType } from "../../types/manageSalaryTypes/records";
import { formatBnNumber } from "../../utils/formatter/numbers";
import moment from "moment";

type propsType = {
  tag?: string;
  from?: string;
  to?: string;
};

const useDashboardInfo = ({ tag, from, to }: propsType = {}) => {
  const { sessionToken } = useAuthContext();

  const { data, mutate } = useSWR<{
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

    const total = formatBnNumber(data.total);
    const totalIn = formatBnNumber(data.totalIn);
    const totalOut = formatBnNumber(data.totalOut);

    const records = data.records.reduce(
      (acc, record) => {
        acc[record._id] = {
          records: record.records.map((r) => ({
            ...r,
            amount: formatBnNumber(r.amount),
            date: moment(r.date).utc().format("YYYY-MM-DD"),
            tag: r.tag || { name: "Untagged", color: "#808080" },
          })),
          total: formatBnNumber(record.total),
        };

        return acc;
      },
      {} as Record<string, { records: RecordType[]; total: string | number }>,
    );

    return {
      total,
      records,
      subTotal: {
        in: totalIn,
        out: totalOut,
      },
    };
  });

  const { data: previousBalanceData } = useSWR<{ total: number }>(
    `/dashboard-info-previous?tag${tag}`,
    async () => {
      const params = new URLSearchParams({});
      if (tag) params.set("tag", tag);
      params.set("from", "1900-01-01");
      params.set(
        "to",
        moment().startOf("year").subtract(1, "day").format("YYYY-MM-DD"),
      );

      const data = await manageSalaryFetcher<{
        total: string;
      }>(`/records/dashboard?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      return {
        total: formatBnNumber(data.total),
      };
    },
  );

  return {
    data,
    previousBalance: previousBalanceData?.total || 0,
    mutate,
  };
};

export default useDashboardInfo;
