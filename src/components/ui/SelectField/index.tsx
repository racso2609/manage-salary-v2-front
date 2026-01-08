import styled from 'styled-components';
import { Select } from '../Input';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  fullWidth?: boolean;
  margin?: 'dense' | 'normal' | 'none';
}

const SelectFieldWrapper = styled.div<{ margin: 'dense' | 'normal' | 'none'; fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme, margin }) => margin === 'dense' ? theme.spacing.small : margin === 'normal' ? theme.spacing.medium : '0'};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fonts.size.small};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const StyledSelect = styled(Select)<{ fullWidth?: boolean }>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

const SelectField = ({
  label,
  value,
  onChange,
  children,
  fullWidth = false,
  margin = 'normal',
}: SelectFieldProps) => {
  return (
    <SelectFieldWrapper margin={margin} fullWidth={fullWidth}>
      <Label>{label}</Label>
      <StyledSelect value={value} onChange={onChange} fullWidth={fullWidth}>
        {children}
      </StyledSelect>
    </SelectFieldWrapper>
  );
};

export default SelectField;