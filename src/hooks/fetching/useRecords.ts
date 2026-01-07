import useSWRInfinite from "swr/infinite";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { useAuthContext } from "../../context/AuthContext";
import { Record } from "../../types/manageSalaryTypes/records";
import { Tag } from "styled-components/dist/sheet/types";

export type useRecords = {
  page?: number;
  limit?: number;
  type?: "in" | "out" | "all";
  tag?: string;
  from?: string;
  to?: string;
};

const useRecords = ({
  limit = 10,
  type = "all",
  from,
  to,
  tag = undefined,
}: useRecords = {}) => {
  const { sessionToken } = useAuthContext();
  return useSWRInfinite<Record[]>(
    (page) =>
      sessionToken && [
        page,
        `/in-out-records?page=${page}&limit=${limit}&type=${type}&tag=${tag}&from=${from}&to=${to}`,
      ],
    async ([page]) => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (type !== "all") params.set("recordType", type);
      if (tag) params.set("tag", tag);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const records = await manageSalaryFetcher<{
        records: (Record & { tag: Tag })[];
      }>(`/records?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      return records.records.map((a) => {
        return {
          ...a,
          amount: (Number(a.amount) / 100).toString(),
          tag: a.tag ?? { name: "Untagged", color: "#808080" },
        };
      });
    },
  );
};

export default useRecords;
