/*
 * COSI 116A: Information Visualization
 * In-class programming: D3 map of U.S. state borders
 * Author: Dylan Cashman
 */

var svgStates = d3.select("svg #states"), //finding where to put stuff in the html. css selector language. look for an svg tag, and look for something ith an id of states 
    svgBoundary = d3.select("svg #boundary"),
    states = {},
    startYear = 1910,
    currentYear = startYear;

var width = window.innerWidth, // 
    height = window.innerHeight;

var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]);  // (2)

var path = d3.geoPath()
    .projection(projection);  // (3)

d3.json("data/usa.json").then(function(boundary) {
    svgBoundary.selectAll("path")
    .data(boundary.features)
    .enter()
    .append("path")
    .attr("d", path)
});

d3.json("data/states.json").then(function(topologies) {  // (4)
    var state = topojson.feature(topologies[0], topologies[0].objects.stdin);  // (5)
    
  svgStates.selectAll("path")  
      .data(state.features)
      .enter()
    .append("path")
      .attr("d", path)
    .style("fill", function(d, i) { 
      console.log("d is ", d)
      var name = d.properties.STATENAM.replace(" Territory", ""); 
      return colors[name]; 
    })
    .append("svg:title")
  .text(function(d) { return d.properties.STATENAM; });

});