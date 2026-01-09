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
      responsive: {
        h1: {
          desktop: string;
          tablet: string;
          mobile: string;
        };
        h2: {
          desktop: string;
          tablet: string;
          mobile: string;
        };
        h3: {
          desktop: string;
          tablet: string;
          mobile: string;
        };
        body: {
          desktop: string;
          tablet: string;
          mobile: string;
        };
        small: {
          desktop: string;
          tablet: string;
          mobile: string;
        };
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

