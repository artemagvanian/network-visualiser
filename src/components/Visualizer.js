import React, { Component } from "react";

export default class Visualizer extends Component {
  constructor(props) {
    super(props);
    this.svg = props.svg;
    this.visualizationContainer = React.createRef();
  }

  componentDidMount() {
    this.visualizationContainer.current.appendChild(this.svg);
  }

  render() {
    return <div ref={this.visualizationContainer} />;
  }
}
