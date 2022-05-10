console.log("Add your visualizations here!");
d3 = require('d3@7')
graticule = d3.geoGraticule10()
outline = ({type: "Sphere"})
projection = d3.geoEqualEarth()
world = FileAttachment("countries-50m.json").json()
data = d3.csv(
  "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv"
)
path = d3.geoPath(projection)

// color function
color = d3.scaleQuantize().domain([1, 10]).range(d3.schemeReds[9])

selectiondata3 = data   // 選目前最新的data
  .filter((d) => d.date == "2022-05-02")
  .sort((a, b) => a.total_cases - b.total_cases)

{ // Questions:
  // 1. 黑色的是對不到的，ex: 在我們的covid data，美國是United States，但是在地圖資料world 美國是United States of America
  // 2. 顏色的scale需要再改，現在大部分國家都是一樣的顏色
  // 3. legend 還沒加上去
  let width = 1152;
  let height = 561;

  // Create SVG
  let svg = d3.select(DOM.svg(width, height));

  let g = svg.append("g");

  const infectByLocation = {};
  let logScale = d3.scaleLog().domain([1, 200000]).range([0, 9]);

  selectiondata3.forEach(
    (d) => (infectByLocation[d.location] = +logScale(d.total_cases))
  );

  // Bind TopoJSON data
  g.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features) // Bind TopoJSON data elements
    //.data(land.features)
    // pass through what objects you want to use -- in this case we are doing county lines
    .enter()
    .append("path")
    .attr("d", path)
    //.style("fill", "#fc9272")
    .style("fill", (d) => color(infectByLocation[d.properties.name]))
    .style("stroke", "black");

  g.append("path")
    .datum(borders)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", path);

  g.append("path")
    .datum(outline)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", path);

  g.append("path")
    .datum(graticule)
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("d", path);

  return svg.node();
}
