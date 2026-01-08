import styled from 'styled-components';
import { Input } from '../Input';

interface TextFieldProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  fullWidth?: boolean;
  margin?: 'dense' | 'normal' | 'none';
  InputLabelProps?: { shrink?: boolean };
  InputProps?: { readOnly?: boolean };
}

const TextFieldWrapper = styled.div<TextFieldProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme, margin }) => margin === 'dense' ? theme.spacing.small : margin === 'normal' ? theme.spacing.medium : '0'};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fonts.size.small};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const StyledInput = styled(Input)<{ fullWidth?: boolean }>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

const TextField = ({
  label,
  value,
  onChange,
  type = 'text',
  fullWidth = false,
  margin = 'normal',
  InputProps
}: Omit<TextFieldProps, 'InputLabelProps'>) => {
  return (
    <TextFieldWrapper margin={margin} fullWidth={fullWidth} label={label} value={value} onChange={onChange} type={type}>
      <Label>{label}</Label>
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        readOnly={InputProps?.readOnly}
        fullWidth={fullWidth}
      />
    </TextFieldWrapper>
  );
};

export default TextField;