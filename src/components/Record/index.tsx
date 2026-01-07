import { FC, ReactNode } from "react";
import { Record } from "../../types/manageSalaryTypes/records";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { DATE_FORMAT } from "../../constants/dates";
import moment from "moment";
import { Card } from "../utils/card";
import useRemoveRecord from "../../hooks/actions/useRemoveRecord";

type RecordItem = {
  record: Record;
  onDelete?: (recordId: string) => void;
  iconsSection?: ReactNode;
};

const RecordComponent = styled(Card)`
  display: grid;
  grid-template-columns: 1fr 25px;

  .record-icons {
    display: flex;
    gap: 10px;
    justify-content: end;
  }
  p {
    margin: 5px 0;
  }

  .record-amount {
    margin: 0;
  }

  [data-type="in"] {
    color: green;
  }

  [data-type="out"] {
    color: red;
    opacity: 0.6;
  }

  .tag {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;

    background: black;
    padding: 5px 15px;
    height: auto;
    font-size: 12px;
    align-text: center;

    height: 100%;
  }

  .amount-and-tag {
    display: flex;
    justify-content: space-between;
  }
`;

const ActionButton = styled(FontAwesomeIcon)`
  max-width: 20px;
`;

const DefaultIconSection = ({
  record,
  onDelete,
}: {
  record: Record;
  onDelete?: (recordId: string) => void;
}) => {
  const { handleRemoveRecord } = useRemoveRecord({
    handlers: {
      onSuccess: () => {
        onDelete?.(record._id);
      },
    },
  });
  return (
    <p className="record-icons">
      <ActionButton
        icon={faTrash}
        onClick={() => handleRemoveRecord(record._id)}
      />
    </p>
  );
};

const RecordItem: FC<RecordItem> = ({
  record,
  onDelete,
  iconsSection = <DefaultIconSection record={record} onDelete={onDelete} />,
}) => {
  return (
    <RecordComponent>
      <div>
        <div className="amount-and-tag">
          <h2 data-type={record.type} className="record-amount">
            {record.amount}
          </h2>
          <div className="tag bold">
            <span>{record.tag.name}</span>
          </div>
        </div>
        <p>{record.description}</p>
        <p>{moment(record.date).format(DATE_FORMAT)}</p>
      </div>

      {iconsSection}
    </RecordComponent>
  );
};

export default RecordItem;
