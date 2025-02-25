import styled from "styled-components";

export const Input = styled.input`
  min-height: 30px;
  padding: 0 8px;

  &:before {
    content: attr(data-label);
    display: inline-block;
    font-weight: bold; /* Style as needed */
    color: blue;
  }
`;
