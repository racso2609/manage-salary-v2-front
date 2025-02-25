export type FnHandlers<T> = Partial<{
  onSuccess: (data?: T) => void;
  onError: (error: unknown) => void;
}>;
