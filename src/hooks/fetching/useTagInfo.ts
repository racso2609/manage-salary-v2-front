import useSWR from "swr";
import { Tag } from "../../types/manageSalaryTypes/tags";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { useAuthContext } from "../../context/AuthContext";
import { Record } from "../../types/manageSalaryTypes/records";
import { formatBnNumber } from "../../utils/formatter/numbers";

export type useTag = {
  tagId: string;
};

const useTagInfo = ({ tagId }: useTag) => {
  const { sessionToken } = useAuthContext();

  return useSWR(`/tags/${tagId}/info`, async (url) => {
    const data = await manageSalaryFetcher<{
      tag: Tag;
      recordsGrouped: {
        _id: string;
        total: string;
        records: Record[];
      }[];
      records: Record[];
    }>(url, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    const inRecords = data.recordsGrouped.find((record) => record._id === "in");
    const outRecords = data.recordsGrouped.find(
      (record) => record._id === "out",
    );

    return {
      tag: data.tag,
      inRecords: {
        total: formatBnNumber(inRecords?.total),
        records: inRecords?.records?.map((r) => ({
          ...r,
          amount: formatBnNumber(r.amount),
        })),
      },
      outRecords: {
        total: formatBnNumber(outRecords?.total),
        records: outRecords?.records.map((r) => ({
          ...r,
          amount: formatBnNumber(r.amount),
        })),
      },

      records: data.records.map((r) => ({
        ...r,
        amount: formatBnNumber(r.amount),
      })),
    };
  });
};

export default useTagInfo;
