import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      danger: string;
      warning: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      borderLight: string;
    };
    fonts: {
      family: string;
      size: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
      };
      weight: {
        normal: number;
        bold: number;
      };
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    borderRadius: string;
    boxShadow: string;
  }
}

