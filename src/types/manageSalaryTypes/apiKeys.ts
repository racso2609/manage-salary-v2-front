export interface ApiKey {
  _id: string;
  name: string;
  permissions: string[];
  expiresAt: string;
  createdAt: string;
  active: boolean;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions?: string[];
  expiresAt?: string;
}

export interface CreateApiKeyResponse {
  apiKey: string;
  name: string;
  permissions: string[];
  expiresAt: string;
  createdAt: string;
}

export interface UpdateApiKeyRequest {
  permissions?: string[];
  expiresAt?: string;
}

export interface UpdateApiKeyResponse {
  updated: boolean;
}

export interface DeleteApiKeyResponse {
  message: string;
}