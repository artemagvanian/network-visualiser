import * as d3 from "d3";

export class ArcDiagram {
  constructor(data, margin, initialSize) {
    Object.assign(this, { data, margin, initialSize });
  }
  draw() {
    const { width, height } = this.initialSize;

    this.svg = d3
      .create("svg")
      .attr("viewBox", [
        -this.margin.left,
        -this.margin.top,
        width + this.margin.right + this.margin.left,
        height + this.margin.bottom + this.margin.top,
      ]);

    this.scaleX = d3.scalePoint().range([0, width]);

    this.svg.append("g").attr("id", "nodes");
    this.svg.append("g").attr("id", "labels");
    this.svg.append("g").attr("id", "links");

    this.update(this.data);

    return this.svg.node();
  }
  update(newData) {
    function drawArc(d, t = 1) {
      var start = t * this.scaleX(d.source);
      var end = t * this.scaleX(d.target);
      var r = Math.abs(start - end) / 2;
      return `M ${start} ${60} A ${r} ${r} 0 0 ${
        start > end ? 1 : 0
      } ${end} ${60}`;
    }

    this.data = newData;

    this.scaleX.domain(
      this.data.nodes.map(function getId(d) {
        return d.id;
      })
    );

    var nodes = this.svg
      .select("#nodes")
      .selectAll("circle")
      .data(this.data.nodes, (d) => d.id);

    nodes
      .transition()
      .duration(500)
      .attr(
        "cx",
        function (d) {
          return this.scaleX(d.id);
        }.bind(this)
      );

    nodes
      .enter()
      .append("circle")
      .attr(
        "cx",
        function (d) {
          return this.scaleX(d.id);
        }.bind(this)
      )
      .style("fill", "#69b3a2")
      .transition()
      .duration(500)
      .attr("cy", 60)
      .attr("r", 5);

    nodes.exit().transition().duration(500).attr("cy", -100).remove();

    var labels = this.svg
      .select("#labels")
      .selectAll("text")
      .data(this.data.nodes, (d) => d.id);

    labels
      .transition()
      .duration(500)
      .attr(
        "x",
        function (d) {
          return this.scaleX(d.id);
        }.bind(this)
      );

    labels
      .enter()
      .append("text")
      .style("font", "12px sans-serif")
      .attr(
        "transform",
        function (d) {
          return `rotate(90 ${this.scaleX(d.id)}, 50)`;
        }.bind(this)
      )
      .attr(
        "x",
        function (d) {
          return this.scaleX(d.id);
        }.bind(this)
      )
      .text(function (d) {
        return d.id;
      })
      .style("text-anchor", "end")
      .transition()
      .duration(500)
      .attr("y", 53);

    labels.exit().transition().duration(500).attr("y", -100).remove();

    var links = this.svg
      .select("#links")
      .selectAll("path")
      .data(this.data.links, (d) => d.id);

    links
      .transition()
      .duration(500)
      .attrTween(
        "d",
        function (d) {
          return function (t) {
            return drawArc.bind(this)(d, t);
          }.bind(this);
        }.bind(this)
      );

    links
      .enter()
      .append("path")
      .style("fill", "none")
      .attr("stroke", "black")
      .transition()
      .duration(500)
      .attrTween(
        "d",
        function (d) {
          return function (t) {
            return drawArc.bind(this)(d, t);
          }.bind(this);
        }.bind(this)
      );

    links.exit().remove();
  }
}
