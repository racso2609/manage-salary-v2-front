import styled from 'styled-components';

export const Input = styled.input`
  min-height: 50px;
  padding: 12px 16px;
  width: 100%;
  max-width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fonts.size.medium};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: ${({ theme }) => theme.colors.background};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 400;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;

export const Select = styled.select`
  min-height: 50px;
  padding: 12px 16px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fonts.size.medium};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TextArea = styled.textarea`
  min-height: 100px;
  padding: 12px 16px;
  width: 100%;
  max-width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fonts.size.medium};
  font-family: ${({ theme }) => theme.fonts.family};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: ${({ theme }) => theme.colors.background};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 400;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 8px;
`;

// Note: For labeled inputs, you can wrap with a div and use Typography for labels.