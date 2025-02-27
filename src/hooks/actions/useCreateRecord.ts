import { FnHandlers } from "../../types/handlers";
import { Record } from "../../types/manageSalaryTypes/records";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { useAuthContext } from "../../context/AuthContext";

export type useCreateRecord = {
  handlers?: FnHandlers<undefined>;
};

const useCreateRecord = ({ handlers }: useCreateRecord = {}) => {
  const { sessionToken } = useAuthContext();

  const onSuccess = () => {
    if (handlers?.onSuccess) handlers.onSuccess();
  };
  const onError = (e: unknown) => {
    if (handlers?.onError) handlers.onError(e);
  };

  const handleCreateRecord = async (
    data: Omit<Record, "tag" | "_id" | "createdAt"> & { tag: string },
  ) => {
    try {
      if (Number(data.amount) < 0 || !["in", "out"].includes(data.type))
        throw new Error("Invalid amount");
      await manageSalaryFetcher("/records", {
        body: {
          ...data,
          amount: (BigInt(data.amount) * 100n).toString(),
        },
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };
  return { handleCreateRecord };
};

export default useCreateRecord;
