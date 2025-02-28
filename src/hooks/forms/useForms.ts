import { useCallback, useState } from "react";

export type useForm<T> = {
  defaultValue: T;
  validatorFn?: (value: T) => Promise<boolean> | boolean;
  postUpdate?: (value: T) => void | Promise<void>;

  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  name?: string;
  type?: string;
  required?: boolean;
};

const useForm = <T>({
  defaultValue,
  validatorFn,
  postUpdate,
  type = "text",
  ...props
}: useForm<T>) => {
  const [value, setValue] = useState<T>(defaultValue);

  const onChange = useCallback(
    async (e: any) => {
      const newValue = e.target.value;
      const isValidata = await validatorFn?.(newValue);

      if (validatorFn && !isValidata) return;

      setValue(newValue);
      postUpdate?.(newValue);
    },
    [validatorFn, postUpdate],
  );

  return {
    id: props.id,
    name: props.name,
    className: props.className,
    placeholder: props.placeholder,
    label: props.label,
    onChange,
    value,
    type,
    "data-label": props.label,
    required: props.required,
  };
};

export default useForm;
