import { FC, ReactNode } from "react";
import { Record } from "../../types/manageSalaryTypes/records";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { DATE_FORMAT } from "../../constants/dates";
import moment from "moment";
import { Card } from "../utils/card";
import useRemoveRecord from "../../hooks/actions/useRemoveRecord";

type RecordItem = {
  record: Record;
  onDelete?: (recordId: string) => void;
  onEdit?: (record: Record) => void;
  iconsSection?: ReactNode;
};

const RecordComponent = styled(Card)`
  display: grid;
  grid-template-columns: 1fr 1fr;

  .record-icons {
    display: flex;
    gap: 10px;
    justify-content: end;
    align-items: center;
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
  onEdit,
}: {
  record: Record;
  onDelete?: (recordId: string) => void;
  onEdit?: (record: Record) => void;
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
      <div className="tag bold">
        <span>{record.tag.name}</span>
      </div>

      {onEdit && <ActionButton icon={faEdit} onClick={() => onEdit(record)} />}
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
  onEdit,
  iconsSection = (
    <DefaultIconSection record={record} onDelete={onDelete} onEdit={onEdit} />
  ),
}) => {
  return (
    <RecordComponent>
      <div style={{ flex: 1 }}>
        <div className="amount-and-tag">
          <h2 data-type={record.type} className="record-amount">
            {record.amount}
          </h2>
        </div>
        <p>{record.description}</p>
        <p>{moment(record.date).format(DATE_FORMAT)}</p>
      </div>

      <section style={{ flex: 1 }}>{iconsSection}</section>
    </RecordComponent>
  );
};

export default RecordItem;
