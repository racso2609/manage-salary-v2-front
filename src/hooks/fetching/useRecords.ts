import useSWR from "swr";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { useAuthContext } from "../../context/AuthContext";
import { Record } from "../../types/manageSalaryTypes/records";
import { Tag } from "styled-components/dist/sheet/types";

export type useRecords = {
  page?: number;
  limit?: number;
  type?: "in" | "out" | "all";
};

const useRecords = ({
  page = 0,
  limit = 10,
  type = "all",
}: useRecords = {}) => {
  const { sessionToken } = useAuthContext();
  return useSWR<Record[]>(
    sessionToken && `/in-out-records?page=${page}&limit=${limit}&type=${type}`,
    async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (type !== "all") params.set("recordType", type);

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
        };
      });
    },
  );
};

export default useRecords;
