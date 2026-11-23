/* Code that will be applied to the map to make zooming in and out possible
*/

// selects the map svg. Once the map is fleshed out we can connect the zoom functionalities to it by inserting the actual map name 
const svg = d3.select("MAPSVGNAME");

// creates a map group so that all of the elements of the map can be controlled at once. 
const mapGroup = svg.select("SVGELEMENTS");

// use .zoom to create the zoom feature on the created mapgroup
const zoom = d3.zoom()
    // 1 through 10 is the range of zooms that the user can use 
    .scaleExtent([1, 10]) 
    .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform);
    });

// call the created zoom feature for the map
svg.call(zoom);

// the reset button for the zoom, so that when the user clicks it the maps returns to normal zoom
d3.select("#resetButton")
    .on("click", function() {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    });