import useSWR from "swr";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { useAuthContext } from "../../context/AuthContext";
import { Tag } from "../../types/manageSalaryTypes/tags";

const useTags = () => {
  const { sessionToken } = useAuthContext();
  return useSWR<Tag[]>("/tags", async () => {
    const data = await manageSalaryFetcher<{
      tags: Tag[];
    }>("/tags", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return data.tags;
  });
};

export default useTags;
