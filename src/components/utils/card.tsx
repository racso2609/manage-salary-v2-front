import styled from "styled-components";

export const Card = styled.section<
  Partial<{
    background: string;
    width: string;
    radius: string;
    padding: string;
  }>
>`
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  padding: ${(props) => props.padding || "10px 15px"};

  background: ${({ theme, background }) => background || theme.colors.surface};
  width: ${(props) => props.width};
  border-radius: ${({ theme, radius }) => radius || theme.borderRadius};
  color: ${({ theme }) => theme.colors.text};
`;
