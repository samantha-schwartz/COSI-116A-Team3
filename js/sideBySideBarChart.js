/* Side-by-side bar chart (reusable chart model)
 * Left (blue): number of off-campus students in each neighborhood
 * Right (orange): percent of homes with kids in 2024
 * One row per Boston ZIP code, sorted from most students to fewest
 * Styling matches the example chart in the course template
 */
function sideBySideBarChart() {

    // default settings (can be changed with the functions at the bottom)
    let width = 820;
    let height = 560;
    let margin = { top: 60, right: 30, bottom: 55, left: 150 };

    const BLUE = "#4E79A7";    // students
    const ORANGE = "#F28E2B";  // homes with kids
    const GRID = "#ddd";       // light gray lines
    const AXIS = "#888";       // darker gray for axes

    // draws the chart inside the element given by selector, using data
    function chart(selector, data) {

        // the middle line where both sets of bars start
        const middle = margin.left + (width - margin.left - margin.right) / 2;
        const top = margin.top;
        const bottom = height - margin.bottom;

        const svg = d3.select(selector)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("font-family", "sans-serif");

        // most students at the top
        data.sort((a, b) => b.students - a.students);

        // y: one row for each ZIP code
        const y = d3.scaleBand()
            .domain(data.map(d => d.zip))
            .range([top, bottom])
            .padding(0.2);

        // left side: more students = longer bar going left
        const xStudents = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.students)])
            .range([middle, margin.left])
            .nice();

        // right side: percent of homes with kids (0% to 40%)
        const xKids = d3.scaleLinear()
            .domain([0, 40])
            .range([middle, width - margin.right]);

        // light gridlines behind the bars
        const grid = svg.append("g");

        grid.selectAll(".grid-students")
            .data(xStudents.ticks(5))
            .join("line")
            .attr("x1", d => xStudents(d))
            .attr("x2", d => xStudents(d))
            .attr("y1", top)
            .attr("y2", bottom)
            .attr("stroke", GRID);

        grid.selectAll(".grid-kids")
            .data(xKids.ticks(4))
            .join("line")
            .attr("x1", d => xKids(d))
            .attr("x2", d => xKids(d))
            .attr("y1", top)
            .attr("y2", bottom)
            .attr("stroke", GRID);

        // border around the plot area
        svg.append("rect")
            .attr("x", margin.left)
            .attr("y", top)
            .attr("width", width - margin.left - margin.right)
            .attr("height", bottom - top)
            .attr("fill", "none")
            .attr("stroke", GRID);

        // blue bars (students)
        svg.selectAll(".student-bar")
            .data(data)
            .join("rect")
            .attr("class", "student-bar")
            .attr("x", d => xStudents(d.students))
            .attr("y", d => y(d.zip))
            .attr("width", d => middle - xStudents(d.students))
            .attr("height", y.bandwidth())
            .attr("fill", BLUE);

        // orange bars (homes with kids)
        svg.selectAll(".kids-bar")
            .data(data)
            .join("rect")
            .attr("class", "kids-bar")
            .attr("x", middle)
            .attr("y", d => y(d.zip))
            .attr("width", d => xKids(d.kids2024) - middle)
            .attr("height", y.bandwidth())
            .attr("fill", ORANGE);

        // dark line down the middle so both sides clearly start there
        svg.append("line")
            .attr("x1", middle)
            .attr("x2", middle)
            .attr("y1", top)
            .attr("y2", bottom)
            .attr("stroke", AXIS);

        // neighborhood names on the left
        svg.selectAll(".row-label")
            .data(data)
            .join("text")
            .attr("class", "row-label")
            .attr("x", margin.left - 7)
            .attr("y", d => y(d.zip) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("font-size", 10)
            .text(d => d.name);

        // bottom axes (hide the students "0" so it doesn't overlap "0%")
        const studentAxis = svg.append("g")
            .attr("transform", `translate(0, ${bottom})`)
            .call(d3.axisBottom(xStudents).ticks(5)
                .tickFormat(d => d === 0 ? "" : d3.format(",")(d)));

        const kidsAxis = svg.append("g")
            .attr("transform", `translate(0, ${bottom})`)
            .call(d3.axisBottom(xKids).ticks(4).tickFormat(d => d + "%"));

        // make both axes gray with small text, like the template example
        [studentAxis, kidsAxis].forEach(axis => {
            axis.selectAll("line, path").attr("stroke", AXIS);
            axis.selectAll("text").attr("font-size", 10).attr("fill", "#000");
        });

        // axis titles
        svg.append("text")
            .attr("x", (margin.left + middle) / 2)
            .attr("y", height - 20)
            .attr("text-anchor", "middle")
            .attr("font-size", 11)
            .attr("font-weight", "bold")
            .text("Off-campus students (Fall 2024)");

        svg.append("text")
            .attr("x", (middle + width - margin.right) / 2)
            .attr("y", height - 20)
            .attr("text-anchor", "middle")
            .attr("font-size", 11)
            .attr("font-weight", "bold")
            .text("Homes with kids, 2024 (%)");

        // chart title, top left like the template example
        svg.append("text")
            .attr("x", 10)
            .attr("y", 25)
            .attr("font-size", 13)
            .attr("font-weight", "bold")
            .text("Off-campus students vs. homes with kids, by neighborhood");

        // legend, top right
        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 230}, 38)`);

        legend.append("rect")
            .attr("width", 10).attr("height", 10).attr("fill", BLUE);
        legend.append("text")
            .attr("x", 15).attr("y", 9).attr("font-size", 10)
            .text("Students");

        legend.append("rect")
            .attr("x", 90).attr("width", 10).attr("height", 10).attr("fill", ORANGE);
        legend.append("text")
            .attr("x", 105).attr("y", 9).attr("font-size", 10)
            .text("Homes with kids (%)");

        return chart;
    }

    // getter/setter functions so other code can change the size
    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function (value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    return chart;
}