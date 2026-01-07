import { FnHandlers } from "../../types/handlers";
import { Record } from "../../types/manageSalaryTypes/records";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { useAuthContext } from "../../context/AuthContext";
import moment from "moment";

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
    data: Omit<Record, "tag" | "_id"> & { tag: string },
  ) => {
    try {
      if (!Number(data.amount)) throw new Error("Invalid amount");

      if (!["in", "out"].includes(data.type)) throw new Error("Invalid type");

      if (!data.tag) throw new Error("Tag is required");
      if (!data.description) throw new Error("Description is required");

      await manageSalaryFetcher("/records", {
        body: {
          ...data,
          amount: (Number(data.amount) * 100).toString(),
          date: moment.utc(data.date, 'YYYY-MM-DD').toISOString(),
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
