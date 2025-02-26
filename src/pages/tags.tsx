// type Tags = {

import styled from "styled-components";
import useForm from "../hooks/forms/useForms";
import { Input } from "../components/Inputs";
import useTemporalState from "../hooks/effects/temporalState";
import useCreateTag from "../hooks/actions/useCreateTag";

// }

const Tag = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TagsPage = () => {
  const temporalState = useTemporalState<string>();

  const tagNameInput = useForm({
    defaultValue: "",
    placeholder: "Tag name",
    id: "tagName",
  });

  const { handleCreateTag } = useCreateTag({
    handlers: {
      onSuccess: () => {
        temporalState.setState("Tag created");
      },
      onError: () => {
        temporalState.setState("Error creating tag");
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
        <button>{temporalState.state ?? "Create tag"}</button>
      </form>
    </Tag>
  );
};

export default TagsPage;
