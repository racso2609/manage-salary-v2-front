import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { darkTheme, lightTheme } from '../theme';

// Atom to store theme mode ('dark' or 'light'), persisted in localStorage
export const themeModeAtom = atomWithStorage<'dark' | 'light'>('themeMode', 'dark');

// Derived atom for the actual theme object
export const themeAtom = atom((get) => {
  const mode = get(themeModeAtom);
  return mode === 'dark' ? darkTheme : lightTheme;
});

// Hook to toggle theme
export const useThemeToggle = () => {
  const [themeMode, setThemeMode] = useAtom(themeModeAtom);
  const toggleTheme = () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  return { themeMode, toggleTheme };
};