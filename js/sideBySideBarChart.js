/* Side-by-side bar chart (reusable chart model)
 * Left (blue): number of off-campus students in each neighborhood
 * Right (orange): percent of homes with kids in 2024
 * One row per Boston ZIP code, sorted from most students to fewest
 */
function sideBySideBarChart() {

    // default settings (can be changed with the functions at the bottom)
    let width = 820;
    let height = 560;
    let margin = { top: 70, right: 40, bottom: 60, left: 150 };

    const BLUE = "#4E79A7";    // students
    const ORANGE = "#F28E2B";  // homes with kids

    // draws the chart inside the element given by selector, using data
    function chart(selector, data) {

        // the middle line where both sets of bars start
        const middle = margin.left + (width - margin.left - margin.right) / 2;

        const svg = d3.select(selector)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // most students at the top
        data.sort((a, b) => b.students - a.students);

        // STEP 2 CODE GOES HERE
        // y: one row for each ZIP code
        const y = d3.scaleBand()
            .domain(data.map(d => d.zip))
            .range([margin.top, height - margin.bottom])
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
        // STEP 3 CODE GOES HERE

        // STEP 4 CODE GOES HERE

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