// Immediately Invoked Function Expression to limit access to our
// variables and prevent conflicts with other scripts
((() => {

  // shorter names for the long neighborhood labels
  const shortNames = {
    "Fenway/Kenmore": "Fenway",
    "Longwood/Mission Hill/Fenway": "Longwood",
    "Upham's Corner & Columbia Point": "Upham's Corner"
  };

  // load the data, turning text into numbers as each row comes in
  d3.csv("data/boston_student_housing_summary_by_zip.csv", d => ({
    zip: d.zip_code,
    name: shortNames[d.neighborhood] || d.neighborhood,
    students: +d.total_students,
    kids2024: +d.pct_with_children_2024
  })).then(data => {

    // side-by-side bar chart
    sideBySideBarChart()("#bar-chart", data);

    // year slider 
    yearSlider()("#year-slider");

    // neighborhood slider
    neighborhoodSlider()("#neighborhood-slider", data);

  });

})());
