import styled from "styled-components";
import { Input, Select } from "../components/Inputs";
import useForm from "../hooks/forms/useForms";

const InOut = styled.section`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InOutPage = () => {
  const typeInput = useForm({
    defaultValue: "in",
    type: "text",
    id: "record",
    placeholder: "Record type",
  });

  const descriptionInput = useForm({
    defaultValue: "",
    type: "text",
    id: "description",
    placeholder: "In out description",
  });

  const amountInput = useForm({
    defaultValue: "",
    type: "number",
    id: "amount",
    placeholder: "In out amount",
  });

  const tagInput = useForm({
    defaultValue: "unknown",
    type: "text",
    id: "tag",
    placeholder: "In-Out tag",
  });

  return (
    <InOut>
      <h1>In-Out</h1>
      <p>
        On this page you can create in and out records to track your finances
      </p>
      <Select {...typeInput} />
      <Input {...descriptionInput} />
      <Input {...amountInput} />
      <Select {...tagInput} />
      <button>Create record</button>
    </InOut>
  );
};

export default InOutPage;
