import ReactDOM from "react-dom";
import React from "react";
import styled from "styled-components";

import "normalize.css/normalize.css";

import Visualizer from "./components/Visualizer";
import Editor from "./components/Editor";

import { ArcDiagram } from "./utils/ArcDiagram";
import parts from "./mocks/parts";
import miserables from "./mocks/miserables";

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 1fr) 5fr;
  grid-gap: 10px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

function App() {
  var diagram = new ArcDiagram(
      miserables,
      {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
      },
      { height: 720, width: 1280 }
    ),
    svg = diagram.draw();

  return (
    <Grid>
      <Editor graph={diagram} />
      <Visualizer svg={svg} />
    </Grid>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
