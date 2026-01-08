import styled from 'styled-components';

export const TableContainer = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.colors.surface};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: ${({ theme }) => theme.colors.background};
  }
  &:hover {
    background: ${({ theme }) => theme.colors.textSecondary}22;
  }
`;

export const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
`;

// For header cells
export const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: left;
  color: white;
  font-weight: bold;
`;