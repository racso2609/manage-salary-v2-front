import { FnHandlers } from "../../types/handlers";
import { Record } from "../../types/manageSalaryTypes/records";
import { manageSalaryFetcher } from "../../utils/fetchers";
import { useAuthContext } from "../../context/AuthContext";
import moment from "moment";

export type useUpdateRecord = {
  handlers?: FnHandlers<undefined>;
};

const useUpdateRecord = ({ handlers }: useUpdateRecord = {}) => {
  const { sessionToken } = useAuthContext();

  const onSuccess = () => {
    if (handlers?.onSuccess) handlers.onSuccess();
  };
  const onError = (e: unknown) => {
    if (handlers?.onError) handlers.onError(e);
  };

  const handleUpdateRecord = async (
    recordId: string,
    data: Partial<Omit<Record, "tag" | "_id"> & { tag: string }>,
  ) => {
    try {
      if (data.amount !== undefined && !Number(data.amount)) throw new Error("Invalid amount");
      if (data.type !== undefined && !["in", "out"].includes(data.type)) throw new Error("Invalid type");

      const updateData: any = { ...data };
      if (data.amount !== undefined) {
        updateData.amount = (Number(data.amount) * 100).toString();
      }
      if (data.date !== undefined) {
        updateData.date = moment.utc(data.date, 'YYYY-MM-DD').toISOString();
      }

      await manageSalaryFetcher(`/records/${recordId}`, {
        method: "PUT",
        body: updateData,
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };
  return { handleUpdateRecord };
};

export default useUpdateRecord;