import styled from "styled-components";

export const Input = styled.input`
  min-height: 50px;
  padding: 12px 16px;
  width: 100%;
  max-width: 100%;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline: none;
  background: #fafafa;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: #ffffff;
  }

  &::placeholder {
    color: #999;
    font-weight: 400;
  }

  &:hover {
    border-color: #ccc;
  }
`;

export const Select = styled.select`
  min-height: 30px;
  padding: 0 8px;
  width: 100%;
`;
