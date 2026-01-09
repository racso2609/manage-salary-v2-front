import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#646cff', // From existing index.css
    secondary: '#535bf2', // Hover variant
    success: '#4caf50', // Green for success
    danger: '#f44336', // Red for danger
    warning: '#ff9800', // Orange for warning
    background: '#242424', // Dark background
    surface: '#1a1a1a', // Slightly lighter surface
    text: 'rgba(255, 255, 255, 0.87)', // Main text
    textSecondary: 'rgba(255, 255, 255, 0.6)', // Secondary text
    border: '#e0e0e0', // Light border
    borderLight: '#cccccc',
  },
  fonts: {
    family: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    size: {
      small: '12px',
      medium: '16px',
      large: '20px',
      xlarge: '24px',
    },
    responsive: {
      h1: {
        desktop: '2.5rem',
        tablet: '2rem',
        mobile: '1.75rem',
      },
      h2: {
        desktop: '2rem',
        tablet: '1.75rem',
        mobile: '1.5rem',
      },
      h3: {
        desktop: '1.5rem',
        tablet: '1.375rem',
        mobile: '1.25rem',
      },
      body: {
        desktop: '1rem',
        tablet: '0.95rem',
        mobile: '0.9rem',
      },
      small: {
        desktop: '0.875rem',
        tablet: '0.8rem',
        mobile: '0.75rem',
      },
    },
    weight: {
      normal: 400,
      bold: 500,
    },
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '20px',
    xlarge: '32px',
  },
  borderRadius: '8px',
  boxShadow: '0 4px 0px rgba(0, 0, 0, 0.2)',
};

export const lightTheme: DefaultTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: '#ffffff',
    surface: '#f9f9f9',
    text: '#213547',
    textSecondary: '#666666',
    border: '#e0e0e0',
    borderLight: '#cccccc',
  },
};