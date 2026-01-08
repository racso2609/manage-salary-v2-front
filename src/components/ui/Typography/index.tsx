import styled from 'styled-components';
import { ReactNode } from 'react';

interface BaseTextProps {
  color?: 'default' | 'secondary' | 'success' | 'danger';
  children: ReactNode;
}

const getColor = ({ color, theme }: { color?: string; theme: any }) => {
  switch (color) {
    case 'secondary':
      return theme.colors.textSecondary;
    case 'success':
      return theme.colors.success;
    case 'danger':
      return theme.colors.danger;
    default:
      return theme.colors.text;
  }
};

export const Heading = styled.h1<BaseTextProps>`
  font-size: ${({ theme }) => theme.fonts.size.xlarge};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${getColor};
  margin: 0;
`;

export const Heading2 = styled.h2<BaseTextProps>`
  font-size: ${({ theme }) => theme.fonts.size.large};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${getColor};
  margin: 0;
`;

export const Heading3 = styled.h3<BaseTextProps>`
  font-size: ${({ theme }) => theme.fonts.size.medium};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${getColor};
  margin: 0;
`;

export const Paragraph = styled.p<BaseTextProps>`
  font-size: ${({ theme }) => theme.fonts.size.medium};
  color: ${getColor};
  margin: 0;
`;

export const Caption = styled.span<BaseTextProps>`
  font-size: ${({ theme }) => theme.fonts.size.small};
  color: ${getColor};
`;

// Example usage:
// <Heading>Page Title</Heading>
// <Paragraph color="secondary">Subtitle</Paragraph>