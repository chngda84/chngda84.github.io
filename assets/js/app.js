// Step 1: Set up our chart
//= ================================

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Step 3:
// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(D3Data) {

    console.log(D3Data);

    // Step 4: Parse the data / Cast as numbers   
    // =================================
    D3Data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });
  
    // Step 5: Create Scales
    //= ============================================
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(D3Data, d => d.poverty) *0.8,
            d3.max(D3Data, d => d.poverty) * 1.1
            ])
        .range([0, width]);
  
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(D3Data, d => d.healthcare) * 0.8,
            d3.max(D3Data, d => d.healthcare) * 1.1
            ])
        .range([height, 0]);
    
    // Step 6: Create Axes
    // =============================================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
 
    // Step 7: Append the axes to the chartGroup - ADD STYLING
    // ==============================================
    // Add bottomAxis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("stroke", "black", )
        .call(bottomAxis);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    chartGroup.append("g")
        .attr("stroke", "black")
        .call(leftAxis);
    
    // Step 8: Create Circles
    // ==============================================
    chartGroup.selectAll("circle")
    .data(D3Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "#89bdd3")
    .attr("opacity", ".8")
    ;

    chartGroup.selectAll('.stateText')
    .data(D3Data)
    .enter()
    .append('text')
    .classed('stateText', true)
    .attr('x', d => xLinearScale(d.poverty))
    .attr('y', d => yLinearScale(d.healthcare))
    .attr('dy', 3)
    .attr('font-size', '10px')
    .text(function(d){return d.abbr});

    // Step 9: Create axes labels
    // ==============================================
  
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed('aText', true)
      .attr("font-size", "18px")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .classed('aText', true)
      .attr("font-size", "18px")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });