import styled, { css } from "styled-components";
import { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const StyledButton = styled.button<ButtonProps>`
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid transparent;
  padding: ${({ theme, size }) =>
    size === "small"
      ? theme.spacing.small
      : size === "large"
        ? theme.spacing.xlarge
        : theme.spacing.medium};
  font-size: ${({ theme, size }) =>
    size === "small"
      ? theme.fonts.size.small
      : size === "large"
        ? theme.fonts.size.xlarge
        : theme.fonts.size.medium};
  font-weight: ${({ theme }) => theme.fonts.weight.normal};
  font-family: ${({ theme }) => theme.fonts.family};
  cursor: pointer;
  transition:
    border-color 0.25s,
    background-color 0.25s,
    color 0.25s;

  ${({ variant, theme }) => {
    switch (variant) {
      case "primary":
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${theme.colors.secondary};
          }
        `;
      case "danger":
        return css`
          background-color: ${theme.colors.danger};
          color: white;
          &:hover {
            background-color: #d32f2f;
          }
        `;
      case "secondary":
      default:
        return css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          border-color: ${theme.colors.border};
          &:hover {
            background-color: ${theme.colors.textSecondary};
          }
        `;
    }
  }}

  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = ({
  variant = "secondary",
  size = "medium",
  disabled = false,
  children,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

