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

var addSpacer = function(width) {
  return "<div style=\"width:" + addSuffix(width, "px") + ";\" class=\"bar-gen spacer\"></div>";
};

// passed options object must include width, height, value, valuePosition, label, and fontColor
var addBar = function(options) {
  var returnString = "<div style=\"width:" + addSuffix(options.width, "px") + ";height:" + addSuffix(options.height, "px") + ";color:" +  options.fontColor + ";background-color:" + options.barColor + ";\" class=\"bar-gen bar\"><span class=\"bar-value " + options.valuePosition + "\">" + options.value + "</span>";
  returnString += options.showTooltips ? "<span class=\"tooltiptext\">" + options.label + " - " + options.value + "</span>" : "";
  return returnString + "</div>";
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

var addHorizontal = function(width, axisColor, showYAxis) {
  if (showYAxis) {
    return "<div class=\"y-axis-spacer\"></div><hr align=\"left\" style=\"width:" + addSuffix(width - 50, "px") + ";color:" + axisColor + ";background-color:" + axisColor + "\" class=\"horizontal inline-block\">";
  } else {
    return "<hr align=\"left\" style=\"width:" + addSuffix(width, "px") + ";color:" + axisColor + ";background-color:" + axisColor + "\" class=\"horizontal\">";
  }
};

var addTick = function(tickValue, maxDataValue, colors) {
  // colors = [ axisColor, labelColor ]
  var top = Math.round(96 - ((tickValue / maxDataValue) * 100)) + "%";
  return "<span class=\"tick\" style=\"color:" + colors[1] + ";top:" + top + ";\">" + tickValue + " <span style=\"color:" + colors[0] + ";\">-</span></span>";
};

var addTitle = function(chartTitle, titleFontSize, titleFontColor) {
  return "<div class=\"title\" style=\"font-size:" + addSuffix(titleFontSize, "px") + ";color:" + titleFontColor + ";height:" + addSuffix((titleFontSize + 10), "px") + ";\">" + chartTitle + "</div>";
};

// main function
var drawBarChart = function(data, options, element) {
  // variable declaration
  var elem;
  var defaultWidth = "100%";
  var defaultHeight = "100%";
  var numSpaces = options.showYAxis ? data.length : data.length - 1;
  var outputString = "";
  var i;
  var optionsObj = {};
  var elemWidth = 0;
  var spacerWidth = options.spacerWidth || 5;
  var fontColor = options.fontColor || "white";
  var barColors = options.barColors || [ "slateGrey" ];
  var axisColor = options.axisColor || "black";
  var labelColor = options.labelColor || "black";
  var valuePosition = options.valuePosition || "top";
  var showYAxis = options.showYAxis || false;
  var yAxisTicks = options.yAxisTicks || [];
  var chartTitle = options.chartTitle || "Barchart Title";
  var titleFontSize = options.titleFontSize || 18;
  var titleFontColor = options.titleFontColor || "black";
  var xAxisHeight = 20;
  var titleAreaHeight = titleFontSize + 10;
  var showTooltips = options.showTooltips || false;

  // check what type of element was passed in; a jQuery element will have a length while an element selected by document.getElementById will not
  elem = element.length ? element[0] : element;

  // define element styling
  var elemStyle = elem.style;
  elemStyle.width = options.width ? addSuffix(options.width, "px") : defaultWidth;
  elemStyle.height = options.height ? addSuffix(options.height, "px") : defaultHeight;

  // add chart-container class to element
  elem.classList.add("chart-container");

  // determine element width
  if (showYAxis) {
    elemWidth = (stripSuffix(elemStyle.width, 2) - (numSpaces * spacerWidth) - 52) / data.length;
  } else {
    elemWidth = (stripSuffix(elemStyle.width, 2) - (numSpaces * spacerWidth)) / data.length;
  }

  var maxDataValue = 0;

  // check what type of data has been passed in (plain array or nested array)
  if (data[0].length) {
    // add title
    outputString += addTitle(chartTitle, titleFontSize, titleFontColor);

    // generate html to draw barchart with labels
    var dataArray = [];
    for (i = 0; i < data.length; i++) {
      dataArray.push(data[i][0]);
    }
    maxDataValue = maxValue(dataArray);
    if (showYAxis) {
      outputString += "<div style=\"height:" + addSuffix((stripSuffix(elemStyle.height, 2) - xAxisHeight - titleAreaHeight), "px") + ";border-color:" + axisColor + ";\" class=\"yaxis\">";

      // check if tick locations have been specified
      if (yAxisTicks.length === 0) {
        // no tick locations have been specified
        yAxisTicks = [
          Math.round(0.25 * maxDataValue),
          Math.round(0.5 * maxDataValue),
          Math.round(0.75 * maxDataValue)
        ];
      }

      // add ticks to y axis
      for (i = 0; i < yAxisTicks.length; i++) {
        outputString += addTick(yAxisTicks[i], maxDataValue, [ axisColor, labelColor ]);
      }

      outputString += "</div>";
    }
    for (i = 0; i < data.length; i++) {
      if (i > 0 || showYAxis) {
        // add spacer between elements
        outputString += addSpacer(spacerWidth);
      }
      optionsObj = {
        width: elemWidth,
        height: data[i][0] / maxDataValue * (stripSuffix(elemStyle.height, 2) - xAxisHeight - titleAreaHeight),
        value: data[i][0],
        fontColor: fontColor,
        barColor: barColors[i % barColors.length],
        valuePosition: valuePosition,
        label: data[i][1],
        showTooltips: showTooltips
      };
      outputString += addBar(optionsObj);
    }
    // add horizontal line
    outputString += addHorizontal(options.width, axisColor, showYAxis);

    // add labels
    if (showYAxis) {
      outputString += "<div style=\"width:52px;\" class=\"y-axis-spacer\"></div>";
    }
    for (i = 0; i < data.length; i++) {
      if (i > 0 || showYAxis) {
        // add spacer between elements
        outputString += addSpacer(spacerWidth);
      }
      outputString += addLabel(data[i][1], elemWidth, labelColor);
    }

  } else {
    // generate html to draw barchart
    maxDataValue = maxValue(data);
    for (i = 0; i < data.length; i++) {
      if (i > 0) {
        // add spacer between elements
        outputString += addSpacer(spacerWidth);
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
