import styled from "styled-components";

export const Card = styled.section<
  Partial<{
    background: string;
    width: string;
    radius: string;
    padding: string;
  }>
>`
  box-shadow: 0 4px 0px rgba(0, 0, 0, 0.2); /* Subtle bottom shadow */
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); /* Slightly stronger shadow on hover */
  }
  padding: ${(props) => props.padding || "10px 15px"};

  background: ${(props) => props.background};
  width: ${(props) => props.width};
  border-radius: ${(props) => props.radius};
`;
