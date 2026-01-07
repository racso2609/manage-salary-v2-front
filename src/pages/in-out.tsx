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
  const temporalState = useTemporalState<{ text: string; class: string }>();

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

  const dateInput = useForm({
    defaultValue: "",
    type: "date",
    id: "date",
    placeholder: "Record date",
  });

  const tagInput = useForm({
    defaultValue: "",
    type: "text",
    id: "tag",
    placeholder: "In-Out tag",
    required: true,
  });

  const cleanData = () => {
    tagInput.onChange({ target: { value: "" } });
    descriptionInput.onChange({ target: { value: "" } });
    amountInput.onChange({ target: { value: "" } });
    dateInput.onChange({ target: { value: "" } });
    typeInput.onChange({ target: { value: "" } });
  };

  const { handleCreateRecord } = useCreateRecord({
    handlers: {
      onSuccess: () => {
        cleanData();
        temporalState.setState({ text: "Record created", class: "success" });
      },
      onError: (e: any) => {
        temporalState.setState({
          text: e.message,
          class: "danger",
        });
      },
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleCreateRecord({
      type: typeInput.value as "in" | "out",
      amount: amountInput.value,
      description: descriptionInput.value,
      date: dateInput.value,
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
       <Input {...dateInput} />
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
      <button className={temporalState.state?.class}>
        {temporalState.state?.text ?? "Create record"}
      </button>
    </InOut>
  );
};

export default InOutPage;
