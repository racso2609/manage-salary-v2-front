import { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableHeaderCell,
} from "../components/ui/Table";
import Chip from "../components/ui/Chip";
import IconButton from "../components/ui/IconButton";
import Alert from "../components/ui/Alert";
import { Card } from "../components/utils/card";
import { Paragraph } from "../components/ui/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
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

  const actions = [
    { label: "Cancel", onClick: onClose },
    { label: "Create", onClick: handleSubmit, variant: "primary" as const },
  ];

  return (
    <Modal
      isOpen={open}
      title="Add New API Key"
      onClose={onClose}
      actions={actions}
    >
      <TextField
        label="Name"
        fullWidth
        margin="dense"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Card
        background={hasCreateRecords ? "#667eea" : "#667eea33"}
        padding="10px"
        onClick={() =>
          setFormData({
            ...formData,
            permissions: hasCreateRecords ? [] : ["create_records"],
          })
        }
        style={{ cursor: "pointer", margin: "10px 0" }}
      >
        <Paragraph>create_records</Paragraph>
      </Card>
      <TextField
        label="Expires At"
        type="datetime-local"
        fullWidth
        margin="dense"
        value={formData.expiresAt || ""}
        onChange={(e) =>
          setFormData({ ...formData, expiresAt: e.target.value })
        }
      />
    </Modal>
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
        expiresAt: apiKey.expiresAt || "",
      });
    }
  }, [apiKey]);

  const hasCreateRecords =
    formData.permissions?.includes("create_records") || false;

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const actions = [
    { label: "Cancel", onClick: onClose },
    { label: "Update", onClick: handleSubmit, variant: "primary" as const },
  ];

  return (
    <Modal
      isOpen={open}
      title="Edit API Key"
      onClose={onClose}
      actions={actions}
    >
      <Card
        background={hasCreateRecords ? "#667eea" : "#667eea33"}
        padding="10px"
        onClick={() =>
          setFormData({
            ...formData,
            permissions: hasCreateRecords ? [] : ["create_records"],
          })
        }
        style={{ cursor: "pointer", margin: "10px 0" }}
      >
        <Paragraph>create_records</Paragraph>
      </Card>
      <TextField
        label="Expires At"
        type="datetime-local"
        fullWidth
        margin="dense"
        value={formData.expiresAt || ""}
        onChange={(e) =>
          setFormData({ ...formData, expiresAt: e.target.value })
        }
      />
    </Modal>
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
}) => {
  const actions = [
    { label: "Cancel", onClick: onClose },
    { label: "Delete", onClick: onConfirm, variant: "danger" as const },
  ];

  return (
    <Modal
      isOpen={open}
      title="Confirm Delete"
      onClose={onClose}
      actions={actions}
    >
      Are you sure you want to deactivate the API key "{apiKeyName}"?
    </Modal>
  );
};

const ApiKeyCreatedDialog = ({
  open,
  onClose,
  apiKey,
}: {
  open: boolean;
  onClose: () => void;
  apiKey: string;
}) => {
  const actions = [{ label: "Close", onClick: onClose }];

  return (
    <Modal
      isOpen={open}
      title="API Key Created"
      onClose={onClose}
      actions={actions}
    >
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
    </Modal>
  );
};

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
      <Button variant="primary" onClick={handleAdd}>
        Add New API Key
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Permissions</TableHeaderCell>
              <TableHeaderCell>Expires At</TableHeaderCell>
              <TableHeaderCell>Created At</TableHeaderCell>
              <TableHeaderCell>Active</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
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
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(key)}>
                    <FontAwesomeIcon icon={faTrash} />
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
