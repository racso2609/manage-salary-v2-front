import styled from 'styled-components';
import { ReactNode } from 'react';

interface AlertProps {
  severity: 'success' | 'info' | 'warning' | 'error';
  children: ReactNode;
}

const StyledAlert = styled.div<AlertProps>`
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid;
  background-color: ${({ theme, severity }) => {
    switch (severity) {
      case 'success':
        return theme.colors.success + '22';
      case 'info':
        return theme.colors.primary + '22';
      case 'warning':
        return theme.colors.danger + '22';
      case 'error':
        return theme.colors.danger + '22';
      default:
        return theme.colors.primary + '22';
    }
  }};
  border-color: ${({ theme, severity }) => {
    switch (severity) {
      case 'success':
        return theme.colors.success;
      case 'info':
        return theme.colors.primary;
      case 'warning':
        return theme.colors.danger;
      case 'error':
        return theme.colors.danger;
      default:
        return theme.colors.primary;
    }
  }};
  color: ${({ theme, severity }) => {
    switch (severity) {
      case 'success':
        return theme.colors.success;
      case 'info':
        return theme.colors.primary;
      case 'warning':
        return theme.colors.danger;
      case 'error':
        return theme.colors.danger;
      default:
        return theme.colors.primary;
    }
  }};
`;

const Alert = ({ severity, children }: AlertProps) => {
  return <StyledAlert severity={severity}>{children}</StyledAlert>;
};

export default Alert;