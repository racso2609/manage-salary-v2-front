import { useAtom } from 'jotai';
import { ThemeProvider } from 'styled-components';
import { themeAtom } from '../stores/theme';
import { ReactNode } from 'react';

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export const ThemeProviderWrapper = ({ children }: ThemeProviderWrapperProps) => {
  const [theme] = useAtom(themeAtom);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};