import styled from "styled-components";
import { Input, Select } from "../components/Inputs";
import useForm from "../hooks/forms/useForms";
import useTags from "../hooks/fetching/useTags";
import useCreateRecord from "../hooks/actions/useCreateRecord";
import useTemporalState from "../hooks/effects/temporalState";

const InOut = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InOutPage = () => {
  const tags = useTags();
  const temporalState = useTemporalState<string>();
  const { handleCreateRecord } = useCreateRecord({
    handlers: {
      onSuccess: () => {
        temporalState.setState("Record created");
      },
      onError: () => {
        temporalState.setState("Failure creating record");
      },
    },
  });

  const typeInput = useForm({
    defaultValue: "in",
    type: "text",
    id: "record",
    placeholder: "Record type",
    required: true,
  });

  const descriptionInput = useForm({
    defaultValue: "",
    type: "text",
    id: "description",
    placeholder: "In out description",
    required: true,
  });

  const amountInput = useForm({
    defaultValue: "",
    type: "number",
    id: "amount",
    placeholder: "In out amount",
    required: true,
  });

  const tagInput = useForm({
    defaultValue: "unknown",
    type: "text",
    id: "tag",
    placeholder: "In-Out tag",
    required: true,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleCreateRecord({
      type: typeInput.value as "in" | "out",
      amount: amountInput.value,
      description: descriptionInput.value,
      tag: tagInput.value,
      currency: "USD",
    });
  };

  return (
    <InOut onSubmit={handleSubmit}>
      <h1>In-Out</h1>
      <p>
        On this page you can create in and out records to track your finances
      </p>
      <Select {...typeInput}>
        <option>Select a record type</option>
        <option value="in">In</option>
        <option value="out">Out</option>
      </Select>
      <Input {...descriptionInput} />
      <Input {...amountInput} />
      <Select {...tagInput}>
        <option>Select a tag to categories your records</option>
        {tags?.data?.map((tag) => {
          return (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          );
        })}
      </Select>
      <button>{temporalState.state ?? "Create record"}</button>
    </InOut>
  );
};

export default InOutPage;
