// export type useDashboardInfo = {};

import useSWR from "swr";
import { useAuthContext } from "../../context/AuthContext";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { Record as RecordType } from "../../types/manageSalaryTypes/records";

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
    records: Record<string, RecordType[]>;
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
    }>(`/records/dashboard?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    const total = Number(data.total) / 100;
    const subTotal = data.records.reduce(
      (acc, data) => {
        acc[data._id] = Number(data.total) / 100;
        return acc;
      },
      {} as Record<string, number>,
    );
    const inRecords =
      data.records.find((record) => record._id === "in")?.records ?? [];
    const outRecords =
      data.records.find((record) => record._id === "out")?.records ?? [];

    return {
      total,
      subTotal,
      records: {
        in: inRecords.map((r) => {
          return {
            ...r,
            amount: (Number(r.amount) / 100).toString(),
          };
        }),
        out: outRecords.map((r) => {
          return {
            ...r,
            amount: (Number(r.amount) / 100).toString(),
          };
        }),
      },
    };
  });
};

export default useDashboardInfo;
