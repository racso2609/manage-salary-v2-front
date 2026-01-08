import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import useApiKeys from "../hooks/fetching/useApiKeys";
import useCreateApiKey from "../hooks/actions/useCreateApiKey";
import useDeleteApiKey from "../hooks/actions/useDeleteApiKey";
import useUpdateApiKey from "../hooks/actions/useUpdateApiKey";
import {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
} from "../types/manageSalaryTypes/apiKeys";

const Settings = styled.section`
  width: 90%;
  margin: auto;
  gap: 20px;
  display: flex;
  flex-direction: column;
  h2 {
    margin-top: 0;
  }
`;

const AddApiKeyDialog = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApiKeyRequest) => void;
}) => {
  const [formData, setFormData] = useState<CreateApiKeyRequest>({
    name: "",
    permissions: [],
    expiresAt: "",
  });
  const hasCreateRecords =
    formData.permissions?.includes("create_records") || false;

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: "", permissions: [], expiresAt: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New API Key</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Card
          sx={{
            cursor: "pointer",
            backgroundColor: hasCreateRecords
              ? "primary.light"
              : "background.paper",
            margin: "10px 0",
          }}
          onClick={() =>
            setFormData({
              ...formData,
              permissions: hasCreateRecords ? [] : ["create_records"],
            })
          }
        >
          <CardContent>
            <Typography variant="body1">create_records</Typography>
          </CardContent>
        </Card>
        <TextField
          label="Expires At"
          type="datetime-local"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={formData.expiresAt}
          onChange={(e) =>
            setFormData({ ...formData, expiresAt: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditApiKeyDialog = ({
  open,
  onClose,
  onSubmit,
  apiKey,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateApiKeyRequest) => void;
  apiKey: ApiKey | null;
}) => {
  const [formData, setFormData] = useState<UpdateApiKeyRequest>({
    permissions: [],
    expiresAt: "",
  });

  useEffect(() => {
    if (apiKey) {
      setFormData({
        permissions: apiKey.permissions,
        expiresAt: apiKey.expiresAt,
      });
    }
  }, [apiKey]);

  const hasCreateRecords =
    formData.permissions?.includes("create_records") || false;

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit API Key</DialogTitle>
      <DialogContent>
        <Card
          sx={{
            cursor: "pointer",
            backgroundColor: hasCreateRecords
              ? "primary.light"
              : "background.paper",
            margin: "10px 0",
          }}
          onClick={() =>
            setFormData({
              ...formData,
              permissions: hasCreateRecords ? [] : ["create_records"],
            })
          }
        >
          <CardContent>
            <Typography variant="body1">create_records</Typography>
          </CardContent>
        </Card>
        <TextField
          label="Expires At"
          type="datetime-local"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={formData.expiresAt}
          onChange={(e) =>
            setFormData({ ...formData, expiresAt: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteApiKeyDialog = ({
  open,
  onClose,
  onConfirm,
  apiKeyName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  apiKeyName: string;
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      Are you sure you want to deactivate the API key "{apiKeyName}"?
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} variant="contained" color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const ApiKeyCreatedDialog = ({
  open,
  onClose,
  apiKey,
}: {
  open: boolean;
  onClose: () => void;
  apiKey: string;
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>API Key Created</DialogTitle>
    <DialogContent>
      <Alert severity="warning">
        Save this key securely. It will not be shown again.
      </Alert>
      <TextField
        label="API Key"
        fullWidth
        margin="dense"
        value={apiKey}
        InputProps={{ readOnly: true }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const ApiKeysSection = () => {
  const { data: apiKeys, error, mutate: mutateApiKeys } = useApiKeys();
  const { handleCreateApiKey } = useCreateApiKey({
    handlers: {
      onSuccess: () => mutateApiKeys(),
    },
  });
  const { handleDeleteApiKey } = useDeleteApiKey({
    handlers: {
      onSuccess: () => mutateApiKeys(),
    },
  });
  const { handleUpdateApiKey } = useUpdateApiKey({
    handlers: {
      onSuccess: () => mutateApiKeys(),
    },
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [newKeyValue, setNewKeyValue] = useState<string>("");

  const handleAdd = () => setAddDialogOpen(true);

  const handleEdit = (key: ApiKey) => {
    setSelectedKey(key);
    setEditDialogOpen(true);
  };

  const handleDelete = (key: ApiKey) => {
    setSelectedKey(key);
    setDeleteDialogOpen(true);
  };

  const submitAdd = async (data: CreateApiKeyRequest) => {
    try {
      const response = await handleCreateApiKey(data);
      setNewKeyValue(response.apiKey);
      setKeyDialogOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const submitEdit = async (data: UpdateApiKeyRequest) => {
    if (!selectedKey) return;
    try {
      await handleUpdateApiKey(selectedKey._id, data);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!selectedKey) return;
    try {
      await handleDeleteApiKey(selectedKey._id);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <div>Error loading API keys</div>;
  if (!apiKeys) return <div>Loading...</div>;

  return (
    <>
      <h2>API Keys</h2>
      <Button variant="contained" onClick={handleAdd}>
        Add New API Key
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key._id}>
                <TableCell>{key.name}</TableCell>
                <TableCell>
                  {key.permissions.map((perm) => (
                    <Chip key={perm} label={perm} size="small" />
                  ))}
                </TableCell>
                <TableCell>
                  {key.expiresAt
                    ? new Date(key.expiresAt).toLocaleString()
                    : "Never"}
                </TableCell>
                <TableCell>
                  {new Date(key.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{key.active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(key)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(key)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddApiKeyDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={submitAdd}
      />
      <EditApiKeyDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={submitEdit}
        apiKey={selectedKey}
      />
      <DeleteApiKeyDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        apiKeyName={selectedKey?.name || ""}
      />
      <ApiKeyCreatedDialog
        open={keyDialogOpen}
        onClose={() => setKeyDialogOpen(false)}
        apiKey={newKeyValue}
      />
    </>
  );
};

const SettingsPage = () => {
  return (
    <Settings>
      <ApiKeysSection />
    </Settings>
  );
};

export default SettingsPage;
