/* Sliders for year and neighborhood data selection
 */

function yearSlider() {

    function chart(selector) {

        // set the two available years
        const years = [2015, 2024];
        let selectedYear = 2015;

        // set the slider dimensions
        const width = 600;
        const height = 100;

        // create the svg container
        const svg = d3.select(selector)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("width", "100%");

        // create a scale for the two years
        const x = d3.scalePoint()
            .domain(years)
            .range([30, width - 30]);

        // display the currently selected year
        const yearLabel = svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("font-size", 18)
            .attr("font-weight", "bold")
            .text(selectedYear);

        // draw the slider track
        svg.append("line")
            .attr("x1", x(2015))
            .attr("x2", x(2024))
            .attr("y1", 50)
            .attr("y2", 50)
            .attr("stroke", "#ddd")
            .attr("stroke-width", 6)
            .attr("stroke-linecap", "round");

        // create the draggable slider handle
        const handle = svg.append("circle")
            .attr("cx", x(selectedYear))
            .attr("cy", 50)
            .attr("r", 10)
            .attr("fill", "#4E79A7")
            .style("cursor", "pointer");

        // update the selected year and handle position
        function update(year) {

            selectedYear = year;

            handle.attr("cx", x(selectedYear));
            yearLabel.text(selectedYear);

        }

        // allow the handle to be dragged between the two years
        const drag = d3.drag()
            .on("drag", function(event) {

                const [mouseX] = d3.pointer(
                    event,
                    svg.node()
                );

                // choose the closest year based on the mouse position
                const selected = mouseX < width / 2
                    ? 2015
                    : 2024;

                update(selected);

            });

        handle.call(drag);

        // allow users to click the track to change years
        svg.on("click", function(event) {

            const [mouseX] = d3.pointer(event);

            update(mouseX < width / 2 ? 2015 : 2024);

        });

        // display the first year below the slider
        svg.append("text")
            .attr("x", x(2015))
            .attr("y", 80)
            .attr("text-anchor", "middle")
            .text("2015");

        // display the second year below the slider
        svg.append("text")
            .attr("x", x(2024))
            .attr("y", 80)
            .attr("text-anchor", "middle")
            .text("2024");

        return chart;
    }

    return chart;
}


// slider for selecting neighborhoods based on different categories
function neighborhoodSlider() {

    function chart(controlsSelector, data) {

        // define the available categories and their data fields
        const metrics = {
            families: {
                label: "Homes with families",
                field: "kids2024",
                format: d => d + "%",
                color: "#F28E2B"
            },

            students: {
                label: "Off-campus students",
                field: "students",
                format: d => d3.format(",")(d),
                color: "#4E79A7"
            }
        };

        // set the default category and neighborhood
        let selectedMetric = "families";
        let selectedIndex = 0;

        // select the container and clear existing content
        const controls = d3.select(controlsSelector);
        controls.selectAll("*").remove();

        // create the category dropdown menu
        controls.append("label")
            .text("Choose a category: ");

        const dropdown = controls.append("select")
            .style("margin-left", "8px")
            .style("padding", "6px");

        // add the category options to the dropdown
        dropdown.selectAll("option")
            .data(Object.entries(metrics))
            .join("option")
            .attr("value", d => d[0])
            .text(d => d[1].label);

        // create a container for the neighborhood name and value
        const display = controls.append("div")
            .style("margin-top", "25px")
            .style("text-align", "center");

        // display the selected neighborhood name
        const neighborhoodName = display.append("div")
            .style("font-size", "24px")
            .style("font-weight", "bold");

        // display the selected neighborhood's value
        const neighborhoodValue = display.append("div")
            .style("font-size", "16px")
            .style("margin-top", "5px")
            .style("color", "#666");

        // create the neighborhood slider
        const slider = controls.append("input")
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", data.length - 1)
            .attr("step", 1)
            .attr("value", 0)
            .style("width", "100%")
            .style("margin-top", "20px")
            .style("cursor", "pointer");

        // create labels for the lowest and highest neighborhoods
        const rangeLabels = controls.append("div")
            .style("display", "flex")
            .style("justify-content", "space-between")
            .style("font-size", "12px")
            .style("color", "#777");

        const lowestLabel = rangeLabels.append("span");
        const highestLabel = rangeLabels.append("span");

        // store the neighborhoods in sorted order
        let sortedData = [];

        // update the selected neighborhood and its information
        function update() {

            // get the selected category
            const metric = metrics[selectedMetric];

            // sort neighborhoods from lowest to highest value
            sortedData = data
                .filter(d =>
                    d[metric.field] !== null &&
                    Number.isFinite(d[metric.field])
                )
                .sort((a, b) =>
                    a[metric.field] - b[metric.field]
                );

            // keep the selected position within the slider range
            selectedIndex = Math.min(
                selectedIndex,
                sortedData.length - 1
            );

            // update the slider to match the number of neighborhoods
            slider
                .attr("max", sortedData.length - 1)
                .property("value", selectedIndex);

            // get the currently selected neighborhood
            const selected = sortedData[selectedIndex];

            // display the neighborhood name
            neighborhoodName
                .text(selected.name);

            // display the neighborhood's value
            neighborhoodValue
                .text(metric.format(selected[metric.field]));

            // change the slider color based on the selected category
            slider.style("accent-color", metric.color);

            // display the lowest and highest neighborhoods
            lowestLabel.text(
                "Lowest: " + sortedData[0].name
            );

            highestLabel.text(
                "Highest: " +
                sortedData[sortedData.length - 1].name
            );
        }

        // update the chart when a different category is selected
        dropdown.on("change", function() {

            selectedMetric = this.value;

            // start at the lowest neighborhood
            selectedIndex = 0;

            update();
        });

        // update the neighborhood when the slider moves
        slider.on("input", function() {

            selectedIndex = +this.value;

            update();
        });

        // display the initial neighborhood
        update();

        return chart;
    }

    return chart;
}