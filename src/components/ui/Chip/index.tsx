import styled from 'styled-components';

interface ChipProps {
  label: string;
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'success' | 'danger';
}

const StyledChip = styled.span<Pick<ChipProps, 'size' | 'color'>>`
  display: inline-flex;
  align-items: center;
  padding: ${(props) => props.size === 'small' ? '4px 8px' : '6px 12px'};
  border-radius: ${(props) => props.theme.borderRadius};
  font-size: ${({ theme, size }) => size === 'small' ? theme.fonts.size.small : theme.fonts.size.medium};
  font-weight: ${({ theme }) => theme.fonts.weight.normal};
  background-color: ${({ theme, color }) => {
    switch (color) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'success':
        return theme.colors.success;
      case 'danger':
        return theme.colors.danger;
      default:
        return theme.colors.primary;
    }
  }};
  color: white;
`;

const Chip = ({ label, size = 'small', color = 'primary' }: ChipProps) => {
  return <StyledChip size={size} color={color}>{label}</StyledChip>;
};

export default Chip;