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

var stripSuffix = function(input, suffixLength) {
  return input.slice(0, input.length - suffixLength);
};

var addSpacer = function() {
  return "<div class=\"bar-gen spacer\"></div>";
};

// passed options object must include width, height, value, valuePosition, and fontColor
var addBar = function(options) {
  return "<div style=\"width:" + addSuffix(options.width, "px") + ";height:" + addSuffix(options.height, "px") + ";color:" +  options.fontColor + ";background-color:" + options.barColor + ";\" class=\"bar-gen bar\"><span class=\"bar-value " + options.valuePosition + "\">" + options.value + "</span></div>";
};

var addLabel = function(label, width, labelColor) {
  return "<div style=\"width:" + addSuffix(width, "px") + ";color:" + labelColor + ";\" class=\"bar-gen label\">" + label + "</div>";
};

var maxValue = function(data) {
  var returnNum = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i] > returnNum) {
      returnNum = data[i];
    }
  }
  return returnNum;
};

var addHorizontal = function(width, axisColor) {
  return "<hr align=\"left\" style=\"width:" + addSuffix(width, "px") + ";color:" + axisColor + ";background-color:" + axisColor + "\" class=\"horizontal\">";
};

// main function
var drawBarChart = function(data, options, element) {
  // variable declaration
  var elem;
  var defaultWidth = "100%";
  var defaultHeight = "100%";
  var numSpaces = data.length - 1;
  var outputString = "";
  var i;
  var optionsObj = {};
  var spacerWidth = 5;
  var fontColor = options.fontColor || "white";
  var barColors = options.barColors || [ "slateGrey" ];
  var axisColor = options.axisColor || "black";
  var labelColor = options.labelColor || "black";
  var valuePosition = options.valuePosition || "top";

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
  elemStyle.width = options.width ? addSuffix(options.width, "px") : defaultWidth;
  elemStyle.height = options.height ? addSuffix(options.height, "px") : defaultHeight;

  // add chart-container class to element
  elem.classList.add("chart-container");

  // determine element width
  var elemWidth = (stripSuffix(elemStyle.width, 2) - (numSpaces * spacerWidth)) / data.length;

  var maxDataValue = 0;

  // check what type of data has been passed in (plain array or nested array)
  if (data[0].length) {
    // generate html to draw barchart with labels
    var dataArray = [];
    for (i = 0; i < data.length; i++) {
      dataArray.push(data[i][0]);
    }
    maxDataValue = maxValue(dataArray);
    for (i = 0; i < data.length; i++) {
      if (i > 0) {
        // add spacer between elements
        outputString += addSpacer();
      }
      optionsObj = {
        width: elemWidth,
        height: data[i][0] / maxDataValue * (stripSuffix(elemStyle.height, 2) - 20),
        value: data[i][0],
        fontColor: fontColor,
        barColor: barColors[i % barColors.length],
        valuePosition: valuePosition
      };
      outputString += addBar(optionsObj);
    }
    // add horizontal line
    outputString += addHorizontal(options.width, axisColor);

    // add labels
    for (i = 0; i < data.length; i++) {
      if (i > 0) {
        // add spacer between elements
        outputString += addSpacer();
      }
      outputString += addLabel(data[i][1], elemWidth, labelColor);
    }

  } else {
    // generate html to draw barchart
    maxDataValue = maxValue(data);
    for (i = 0; i < data.length; i++) {
      if (i > 0) {
        // add spacer between elements
        outputString += addSpacer();
      }
      optionsObj = {
        width: elemWidth,
        height: data[i] / maxDataValue * stripSuffix(elemStyle.height, 2),
        value: data[i],
        fontColor: fontColor,
        barColor: barColors[i % barColors.length],
        valuePosition: valuePosition
      };
      outputString += addBar(optionsObj);
    }
  }

  // draw barchart
  elem.innerHTML = outputString;
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

    showYAxis - boolean, render y axis
    yAxisTicks - array of values for ticks to be placed at

    chartTitle - the title for the barchart
    titleFontSize - the font size of the title
    titleFontColor - the font color of the title
  }
*/
