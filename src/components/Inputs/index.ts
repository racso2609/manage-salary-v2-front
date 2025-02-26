import styled from "styled-components";

export const Input = styled.input`
  min-height: 30px;
  padding: 0 8px;
  padding-inline: 0;
  width: 100%;
  max-width: 100%;

  &:before {
    content: attr(data-label);
    display: inline-block;
    font-weight: bold; /* Style as needed */
    color: blue;
  }

  &::placeholder {
    position: relative;
    left: 5px;
  }
`;

export const Select = styled.select`
  min-height: 30px;
  padding: 0 8px;
  width: 100%;
`;
