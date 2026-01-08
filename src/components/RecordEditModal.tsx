import React, { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import TextField from "./ui/TextField";
import SelectField from "./ui/SelectField";
import moment from "moment";
import { Record } from "../types/manageSalaryTypes/records";
import useTags from "../hooks/fetching/useTags";

interface RecordEditModalProps {
  open: boolean;
  record: Record | null;
  onClose: () => void;
  onSave: (data: Partial<Omit<Record, "tag"> & { tag: string }>) => void;
}

const RecordEditModal: React.FC<RecordEditModalProps> = ({
  open,
  record,
  onClose,
  onSave,
}) => {
  const { data: tags } = useTags();
  const [formData, setFormData] = useState({
    type: "in" as "in" | "out",
    description: "",
    amount: "",
    date: "",
    tag: "",
  });

  useEffect(() => {
    if (record) {
      setFormData({
        type: record.type,
        description: record.description,
        amount: Number(record.amount).toString(),
          date: moment(record.date).utc().format("YYYY-MM-DD"),
        tag: record.tag._id,
      });
    }
  }, [record]);

  const handleSubmit = () => {
    // Soft validation
    if (formData.amount && Number(formData.amount) <= 0) {
      alert("Amount must be positive");
      return;
    }
    if (formData.type && !["in", "out"].includes(formData.type)) {
      alert("Invalid type");
      return;
    }

    onSave({
      type: formData.type,
      description: formData.description,
      amount: formData.amount,
      date: formData.date,
      tag: formData.tag,
    });
  };

  const actions = [
    { label: "Cancel", onClick: onClose },
    { label: "Save", onClick: handleSubmit, variant: "primary" as const },
  ];

  return (
    <Modal isOpen={open} title="Edit Record" onClose={onClose} actions={actions}>
      <SelectField
        label="Type"
        value={formData.type}
        onChange={(e) =>
          setFormData({ ...formData, type: e.target.value as "in" | "out" })
        }
        fullWidth
        margin="dense"
      >
        <option value="in">In</option>
        <option value="out">Out</option>
      </SelectField>
      <TextField
        label="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        fullWidth
        margin="dense"
      />
      <TextField
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        fullWidth
        margin="dense"
      />
      <SelectField
        label="Tag"
        value={formData.tag}
        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
        fullWidth
        margin="dense"
      >
        {tags?.map((tag) => (
          <option key={tag._id} value={tag._id}>
            {tag.name}
          </option>
        ))}
      </SelectField>
    </Modal>
  );
};

export default RecordEditModal;

