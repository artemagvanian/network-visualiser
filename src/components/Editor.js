import React from "react";
import styled from "styled-components";
import parts from "../mocks/parts";

const Container = styled.div`
  background-color: hsl(270, 20%, 90%);
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  background-color: hsl(270, 20%, 90%);
  border: 1px solid hsl(270, 20%, 0%);
  color: hsl(270, 20%, 0%);
  margin: 20px 20px 0;
  padding: 10px;
  border-radius: 5px;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
  transition: filter 300ms ease-in-out;

  &:hover {
    filter: invert(1);
  }
`;

export default function Editor({ graph }) {
  return (
    <Container>
      <Button onClick={() => graph.update(parts.part2)}>Update</Button>
    </Container>
  );
}
