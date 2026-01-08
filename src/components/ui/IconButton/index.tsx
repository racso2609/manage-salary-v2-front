import styled from 'styled-components';
import { ReactNode } from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const StyledIconButton = styled.button<IconButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${(props) => props.theme.borderRadius};
  padding: ${(props) =>
    props.size === 'small' ? '4px' : props.size === 'large' ? '12px' : '8px'};
  color: ${(props) => props.theme.colors.text};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.textSecondary}33;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const IconButton = ({ onClick, children, size = 'medium' }: IconButtonProps) => {
  return <StyledIconButton onClick={onClick} size={size}>{children}</StyledIconButton>;
};

export default IconButton;