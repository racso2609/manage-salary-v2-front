import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
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
        amount: (Number(record.amount) / 100).toString(),
        date: new Date(record.date).toISOString().split("T")[0],
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Record</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "in" | "out" })}
          >
            <MenuItem value="in">In</MenuItem>
            <MenuItem value="out">Out</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="dense"
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Tag</InputLabel>
          <Select
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
          >
            {tags?.map((tag) => (
              <MenuItem key={tag._id} value={tag._id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordEditModal;