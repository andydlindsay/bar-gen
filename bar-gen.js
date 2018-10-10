/*
  drawBarChart - renders a bar chart into a DOM element.
  Accepts 3 arguments:
    data - the data for the bar chart.
    options - an object with options for the chart.
    element - a DOM or jQuery element that the chart will be rendered into.
*/

// helper functions
var addSuffix = function(input, suffix) {
  return input + suffix;
};

// main function
var drawBarChart = function(data, options, element) {
  // variable declaration
  var elem;

  // check what type of element was passed in; a jQuery element will have a length while an element selected by document.getElementById will not
  if (element.length) {
    // a jQuery element was passed in
    elem = element[0];
  } else {
    // a DOM element was passed in
    elem = element;
  }

  // define element styling
  var elemStyle = elem.style;
  elemStyle.width = addSuffix(options.width, "px");
  elemStyle.height = addSuffix(options.height, "px");

};

/*
  options {
    width - the width of the barchart
    height - the height of the barchart

    valuePosition - where the value should be displayed in the bar (top, centre, or bottom)
    barColor - the colour of the bars
    labelColor - the colour of the labels
    barSpacing - the space between bars
    xAxisTitle - title to be displayed on x axis
    yAxisTitle - title to be displayed on y axis

    yAxisTicks - how are we implementing this?

    chartTitle - the title for the barchart
    titleFontSize - the font size of the title
    titleFontColor - the font color of the title
  }
*/
