import { FC, ReactNode } from "react";
import { Tag } from "../../types/manageSalaryTypes/tags";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DATE_FORMAT } from "../../constants/dates";
import moment from "moment";

type TagItem = {
  tag: Tag;
  iconsSection?: ReactNode;
};

const TagComponent = styled.section`
  display: grid;
  grid-template-columns: 1fr 0.6fr;
  background: gray;
  border-radius: 10px;
  padding: 5px 15px;

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

const TagItem: FC<TagItem> = ({
  tag,
  iconsSection = (
    <p className="tag-icons">
      <ActionButton icon={faTrash} />
      <ActionButton icon={faPencil} />
    </p>
  ),
}) => {
  return (
    <TagComponent>
      <div>
        <p>{tag.name}</p>
        <p>{moment(tag.createdAt).format(DATE_FORMAT)}</p>
      </div>

      {iconsSection}
    </TagComponent>
  );
};

export default TagItem;
