import { FC, ReactNode } from "react";
import { Tag } from "../../types/manageSalaryTypes/tags";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { DATE_FORMAT } from "../../constants/dates";
import moment from "moment";
import { Card } from "../utils/card";
import useRemoveTag from "../../hooks/actions/useRemoveTag";

type TagItem = {
  tag: Tag;
  iconsSection?: ReactNode;
  onDelete?: (tagId: string) => void;
};

const TagComponent = styled(Card)`
  display: grid;
  grid-template-columns: 1fr 50px;

  h2 {
    margin: 0;
  }

  .tag-icons {
    display: flex;
    gap: 10px;
    justify-content: end;
  }
  p {
    margin: 5px 0;
  }
`;

const ActionButton = styled(FontAwesomeIcon)`
  max-width: 20px;
`;

const DefaultIconSection = ({
  tag,
  onDelete,
}: {
  tag: Tag;
  onDelete?: (tagId: string) => void;
}) => {
  const { handleRemoveTag } = useRemoveTag({
    handlers: { onSuccess: () => onDelete?.(tag._id) },
  });
  return (
    <p className="tag-icons">
      <ActionButton icon={faTrash} onClick={() => handleRemoveTag(tag._id)} />
    </p>
  );
};

const TagItem: FC<TagItem> = ({
  tag,
  onDelete,
  iconsSection = <DefaultIconSection tag={tag} onDelete={onDelete} />,
}) => {
  return (
    <TagComponent>
      <div>
        <h2>{tag.name}</h2>
        <p>{moment(tag.createdAt).format(DATE_FORMAT)}</p>
      </div>

      {iconsSection}
    </TagComponent>
  );
};

export default TagItem;
