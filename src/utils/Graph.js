import * as d3 from "d3";

function transform(data) {
  const nodes = data.nodes.map(({ id, group }) => ({
    id,
    sourceLinks: [],
    targetLinks: [],
    group,
  }));

  const nodeById = new Map(nodes.map((d) => [d.id, d]));

  const links = data.links.map(({ source, target, value }) => ({
    source: nodeById.get(source),
    target: nodeById.get(target),
    value,
  }));

  for (const link of links) {
    const { source, target } = link;
    source.sourceLinks.push(link);
    target.targetLinks.push(link);
  }

  return { nodes, links };
}

function calcSize(data, margin, step) {
  return (data.nodes.length - 1) * step + margin.top + margin.bottom;
}

function colorFactory(data) {
  return d3.scaleOrdinal(
    data.nodes.map((d) => d.group).sort(d3.ascending),
    d3.schemeCategory10
  );
}

function yCoordinateFactory(data, margin, size) {
  return d3.scalePoint(data.nodes.map((d) => d.id).sort(d3.ascending), [
    margin.top,
    size - margin.bottom,
  ]);
}

function arcFactory(margin) {
  return function arc(data) {
    const y1 = data.source.y;
    const y2 = data.target.y;
    const r = Math.abs(y2 - y1) / 2;
    return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${
      margin.left
    },${y2}`;
  };
}

export function draw(data, margin, step) {
  var graph = transform(data),
    size = calcSize(data, margin, step),
    getYCoordinate = yCoordinateFactory(data, margin, size),
    getColor = colorFactory(data),
    getArc = arcFactory(margin);

  var svg = d3
    .create("svg")
    .attr("id", "graph")
    .attr("viewBox", [-1000, -1000, 2000, 2000])
    .style("font", "12px sans-serif")
    .style("width", "100%")
    .style("height", "100%")
    .style("transform", "rotate(90deg)");

  svg.append("style").text(`
      .hover path {
        stroke: #ccc;
      }

      .hover text {
        fill: #ccc;
      }

      .hover g.primary text {
        fill: black;
        font-weight: bold;
      }

      .hover g.secondary text {
        fill: #333;
      }

      .hover path.primary {
        stroke: #333;
        stroke-opacity: 1;
      }
    `);

  var label = svg
    .append("g")
    .attr("id", "label")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(graph.nodes)
    .join("g")
    .attr(
      "transform",
      (d) => `translate(${margin.left},${(d.y = getYCoordinate(d.id))})`
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -6)
        .attr("dy", "0.35em")
        .attr("fill", (d) => d3.lab(getColor(d.group)).darker(2))
        .text((d) => d.id)
    )
    .call((g) =>
      g
        .append("circle")
        .attr("r", 3)
        .attr("fill", (d) => getColor(d.group))
    );

  var path = svg
    .insert("g", "*")
    .attr("id", "path")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(graph.links)
    .join("path")
    .attr("stroke", (d) =>
      d.source.group === d.target.group ? getColor(d.source.group) : "#aaa"
    )
    .attr("d", getArc);

  var overlay = svg
    .append("g")
    .attr("id", "overlay")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .selectAll("rect")
    .data(graph.nodes)
    .join("rect")
    .attr("width", margin.left + 40)
    .attr("height", step)
    .attr("y", (d) => getYCoordinate(d.id) - step / 2)
    .on("mouseover", (d) => {
      svg.classed("hover", true);
      label.classed("primary", (n) => n === d);
      label.classed(
        "secondary",
        (n) =>
          n.sourceLinks.some((l) => l.target === d) ||
          n.targetLinks.some((l) => l.source === d)
      );
      path
        .classed("primary", (l) => l.source === d || l.target === d)
        .filter(".primary")
        .raise();
    })
    .on("mouseout", () => {
      svg.classed("hover", false);
      label.classed("primary", false);
      label.classed("secondary", false);
      path.classed("primary", false).order();
    });

  return {
    svg: svg.node(),
    update(data) {
      var graph = transform(data);
      var size = calcSize(data, margin, step);
      var getYCoordinate = yCoordinateFactory(data, margin, size);
      var getColor = colorFactory(data);
      // side effect here
      // getYCoordinate.domain(graph.nodes.map((d) => d.id));

      const t = svg.transition().duration(750);

      label.data(graph.nodes);
      label.exit().remove();
      label
        .enter()
        .append("g")
        .attr(
          "transform",
          (d) => `translate(${margin.left},${(d.y = getYCoordinate(d.id))})`
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", -6)
            .attr("dy", "0.35em")
            .attr("fill", (d) => d3.lab(getColor(d.group)).darker(2))
            .text((d) => d.id)
        )
        .call((g) =>
          g
            .append("circle")
            .attr("r", 3)
            .attr("fill", (d) => getColor(d.group))
        );
      label
        .transition(t)
        .delay((d, i) => i * 20)
        .attrTween("transform", (d) => {
          const i = d3.interpolateNumber(d.y, getYCoordinate(d.id));
          return (t) => `translate(${margin.left},${(d.y = i(t))})`;
        });

      path.data(graph.links);
      path.exit().remove();
      path
        .enter()
        .append("path")
        .attr("stroke", (d) =>
          d.source.group === d.target.group ? getColor(d.source.group) : "#aaa"
        )
        .attr("d", getArc);
      path
        .transition(t)
        .duration(750 + graph.nodes.length * 20)
        .attrTween("d", (d) => () => getArc(d));

      overlay.data(graph.nodes);
      overlay.exit().remove();
      overlay
        .enter()
        .join("rect")
        .attr("width", margin.left + 40)
        .attr("height", step)
        .attr("y", (d) => getYCoordinate(d.id) - step / 2)
        .on("mouseover", (d) => {
          svg.classed("hover", true);
          label.classed("primary", (n) => n === d);
          label.classed(
            "secondary",
            (n) =>
              n.sourceLinks.some((l) => l.target === d) ||
              n.targetLinks.some((l) => l.source === d)
          );
          path
            .classed("primary", (l) => l.source === d || l.target === d)
            .filter(".primary")
            .raise();
        })
        .on("mouseout", () => {
          svg.classed("hover", false);
          label.classed("primary", false);
          label.classed("secondary", false);
          path.classed("primary", false).order();
        });

      overlay
        .transition(t)
        .delay((d, i) => i * 20)
        .attr("y", (d) => getYCoordinate(d.id) - step / 2);
    },
  };
}
