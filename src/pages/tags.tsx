// type Tags = {

import styled from "styled-components";
import useForm from "../hooks/forms/useForms";
import { Input } from "../components/Inputs";
import useTemporalState from "../hooks/effects/temporalState";
import useCreateTag from "../hooks/actions/useCreateTag";
import Button from "../components/ui/Button";

// }

const Tag = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TagsPage = () => {
  const temporalState = useTemporalState<{ text: string; class: string }>();

  const tagNameInput = useForm({
    defaultValue: "",
    placeholder: "Tag name",
    id: "tagName",
    required: true,
  });

  const { handleCreateTag } = useCreateTag({
    handlers: {
      onSuccess: () => {
        temporalState.setState({ text: "Tag created", class: "success" });
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
    handleCreateTag({ name: tagNameInput.value });
  };

  return (
    <Tag>
      <h1>Tags</h1>
      <p>This section is for create tags to categorize your your records</p>
      <form onSubmit={handleSubmit}>
        <Input {...tagNameInput} />
        <Button className={temporalState.state?.class}>
          {temporalState.state?.text ?? "Create tag"}
        </Button>
      </form>
    </Tag>
  );
};

export default TagsPage;
