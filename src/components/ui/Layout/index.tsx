import styled from 'styled-components';
import { ReactNode } from 'react';

interface FlexProps {
  direction?: 'row' | 'column';
  gap?: 'small' | 'medium' | 'large' | 'xlarge';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  children: ReactNode;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  gap: ${({ theme, gap }) => gap ? theme.spacing[gap] : theme.spacing.medium};
  align-items: ${({ align }) => align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align || 'stretch'};
  justify-content: ${({ justify }) => {
    switch (justify) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      default: return 'flex-start';
    }
  }};
  flex-wrap: ${({ wrap }) => wrap ? 'wrap' : 'nowrap'};
`;

interface GridProps {
  columns?: number | string;
  gap?: 'small' | 'medium' | 'large' | 'xlarge';
  children: ReactNode;
}

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${({ columns }) => typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns || 'repeat(auto-fit, minmax(200px, 1fr))'};
  gap: ${({ theme, gap }) => gap ? theme.spacing[gap] : theme.spacing.medium};
`;

// Example usage:
// <Flex direction="column" gap="large" align="center">
//   <div>Item 1</div>
//   <div>Item 2</div>
// </Flex>
// <Grid columns={3} gap="medium">
//   <div>Item 1</div>
//   <div>Item 2</div>
//   <div>Item 3</div>
// </Grid>