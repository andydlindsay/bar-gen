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

// returns maximum value of passed array
var maxValue = function(data) {
  var returnNum = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i] > returnNum) {
      returnNum = data[i];
    }
  }
  return returnNum;
};

// add a spacer and horizontal line
var addHorizontal = function(width, styleObj) {
  return "<div style=\"width:" + addSuffix(styleObj.yAxisWidth, "px") + "\" class=\"y-axis-spacer\"></div><hr align=\"left\" style=\"height:" + addSuffix(styleObj.axisBorderWidth, "px") + ";width:" + addSuffix(width - styleObj.yAxisWidth, "px") + ";color:" + styleObj.axisColor + ";background-color:" + styleObj.axisColor + "\" class=\"horizontal inline-block\">";
};

var addTick = function(tickValue, maxDataValue, colors) {
  var top = addSuffix(Math.ceil(96 - ((tickValue / maxDataValue) * 100)), "%");
  var bottom = addSuffix(Math.round((tickValue / maxDataValue) * 100) - 3, "%");
  return "<span class=\"tick\" style=\"color:" + colors[1] + ";bottom:" + bottom + ";\">" + tickValue + " <span style=\"color:" + colors[0] + ";\">-</span></span>";
};

var addTitle = function(chartTitle, styleObj) {
  return "<div class=\"title\" style=\"margin-left:" + addSuffix(styleObj.yAxisWidth + 2, "px") + ";font-size:" + addSuffix(styleObj.titleFontSize, "px") + ";color:" + styleObj.titleFontColor + ";height:" + addSuffix((styleObj.titleFontSize + 10), "px") + ";\">" + chartTitle + "</div>";
};

// returns an array containing only the first value of each element in the passed array
var firstValue = function(inputArray) {
  var returnArray = [];
  for (var i = 0; i < inputArray.length; i++) {
    returnArray.push(inputArray[i][0]);
  }
  return returnArray;
};

// generate ticks for y axis based on data passed in
var generateTicks = function(data) {
  var maxVal = maxValue(data[0].length ? firstValue(data) : data);
  return [
    0,
    Math.round(0.2 * maxVal),
    Math.round(0.4 * maxVal),
    Math.round(0.6 * maxVal),
    Math.round(0.8 * maxVal),
    maxVal
  ];
};

// compares two arrays to determine the highest value
var compareArrays = function(array1, array2) {
  // determine if the arrays passed in are nested or not
  var procArray1 = array1[0].length ? firstValue(array1) : array1;
  var procArray2 = array2[0].length ? firstValue(array2) : array2;

  // determine the highest value in data array and compare to highest value in tick array
  return maxValue(procArray1) > maxValue(procArray2) ? maxValue(procArray1) : maxValue(procArray2);
};

// passed style object must contain element height, y axis width, x axis height, title area height, axis color, and label color
var addYAxis = function(yAxisTicks, maxDataValue, styleObj) {
  // define y axis div
  var returnString = "<div style=\"border-right-width:" + addSuffix(styleObj.axisBorderWidth, "px") + ";height:" + addSuffix((styleObj.height - styleObj.xAxisHeight - styleObj.titleAreaHeight), "px") + ";border-color:" + styleObj.axisColor + ";width:" + addSuffix(styleObj.yAxisWidth, "px") + "\" class=\"yaxis\">";

  // add ticks to y axis
  for (i = 0; i < yAxisTicks.length; i++) {
    returnString += addTick(yAxisTicks[i], maxDataValue, [ styleObj.axisColor, styleObj.labelColor ]);
  }

  // close y axis div and return
  return returnString += "</div>";
};

// passed style object must contain spacer width, bar width (elemWidth), element height, x axis height, title area height, font color, bar colors array, value position, and show tool tips boolean
var addBars = function(data, maxDataValue, styleObj) {
  var returnString = "";

  for (var i = 0; i < data.length; i++) {
    // build options object to pass to addBar()
    var optionsObj = {
      width: styleObj.elemWidth,
      height: data[i][0] / maxDataValue * (styleObj.height - styleObj.xAxisHeight - styleObj.titleAreaHeight),
      value: data[i][0],
      fontColor: styleObj.fontColor,
      barColor: styleObj.barColors[i % styleObj.barColors.length],
      valuePosition: styleObj.valuePosition,
      label: data[i][1],
      showTooltips: styleObj.showTooltips
    };
    // add spacer and bar
    returnString += addSpacer(styleObj.spacerWidth) + addBar(optionsObj);
  }

  return returnString;
};

// passed style object must include element width, y axis width, axis color, spacer width, and label color
var addXAxis = function(data, styleObj) {
  // add horizontal line
  var returnString = addHorizontal(styleObj.width, { yAxisWidth: styleObj.yAxisWidth, axisColor: styleObj.axisColor, axisBorderWidth: styleObj.axisBorderWidth });

  // add spacer to account for y axis
  returnString += "<div style=\"width:" + addSuffix(styleObj.yAxisWidth + 2, "px") + ";\" class=\"y-axis-spacer\"></div>";

  // add labels
  for (i = 0; i < data.length; i++) {
    // add spacer and label
    returnString += addSpacer(styleObj.spacerWidth) + addLabel(data[i][1], styleObj.elemWidth, styleObj.labelColor);
  }

  return returnString;
};

// main function
var drawBarChart = function(data, options, element) {
  // variable declaration
  var numSpaces = data.length;
  var spacerWidth = options.spacerWidth || 5;
  var fontColor = options.fontColor || "white";
  var barColors = options.barColors || [ "slateGrey" ];
  var axisColor = options.axisColor || "black";
  var labelColor = options.labelColor || "black";
  var valuePosition = options.valuePosition || "top";
  var yAxisTicks = options.yAxisTicks || generateTicks(data);
  var chartTitle = options.chartTitle || "Barchart Title";
  var titleFontSize = options.titleFontSize || 18;
  var titleFontColor = options.titleFontColor || "black";
  var xAxisHeight = options.xAxisHeight || 20;
  var titleAreaHeight = titleFontSize + 10;
  var showTooltips = options.showTooltips || false;
  var yAxisWidth = options.yAxisWidth || 40;
  var axisBorderWidth = options.axisBorderWidth || 2;

  // check what type of element was passed in; a jQuery element will have a length while an element selected by document.getElementById will not
  var elem = element.length ? element[0] : element;

  // define element styling
  elem.style.width = addSuffix(options.width, "px");
  elem.style.height = addSuffix(options.height, "px");

  // add chart-container class to element
  elem.classList.add("chart-container");

  // determine the width of each bar element
  var elemWidth = (options.width - (numSpaces * spacerWidth) - (yAxisWidth + axisBorderWidth)) / data.length;

  // determine maximum value for bar chart
  var maxDataValue = compareArrays(data, yAxisTicks);

  // add title
  var outputString = addTitle(chartTitle, { yAxisWidth: yAxisWidth, titleFontSize: titleFontSize, titleFontColor: titleFontColor });

  // add y axis
  outputString += addYAxis(yAxisTicks, maxDataValue, { axisBorderWidth: axisBorderWidth, height: options.height, xAxisHeight: xAxisHeight, yAxisWidth: yAxisWidth, titleAreaHeight: titleAreaHeight, axisColor: axisColor, labelColor: labelColor });

  // add bars
  outputString += addBars(data, maxDataValue, { axisBorderWidth: axisBorderWidth, spacerWidth: spacerWidth, elemWidth: elemWidth, height: options.height, xAxisHeight: xAxisHeight, titleAreaHeight: titleAreaHeight, fontColor: fontColor, barColors: barColors, valuePosition: valuePosition, showTooltips: showTooltips });

  // add x axis
  outputString += addXAxis(data, { axisBorderWidth: axisBorderWidth, width: options.width, yAxisWidth: yAxisWidth, axisColor: axisColor, spacerWidth: spacerWidth, elemWidth: elemWidth, labelColor: labelColor });

  // draw barchart
  elem.innerHTML = outputString;
};
