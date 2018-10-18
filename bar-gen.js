/*
  drawBarChart - renders a bar chart into a DOM element.
  Accepts 3 arguments:
    data - the data for the bar chart.
    options - an object with options for the chart.
    element - a DOM or jQuery element that the chart will be rendered into.
*/

// helper functions
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
  var maxVal = maxValue(firstValue(data));
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

  // determine the highest value between the arrays
  return maxValue(procArray1) > maxValue(procArray2) ? maxValue(procArray1) : maxValue(procArray2);
};

// calculate adjustment needed to make ticks line up
// adjustment calculation derived using https://mycurvefit.com/
var calcAdjustment = function(barAreaHeight) {
  var a = 113.6504;
  var b = 1.071393;
  var c = 8.679851;
  var d = 0.2150284;
  return (a - d) / (1 + Math.pow(barAreaHeight / c, b));
};

// returns a jQuery div element with the provided class and width
var addSpacer = function(spacerWidth, classList) {
  return $("<div>", { "class": classList })
      .css({
        "width": spacerWidth
      });
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
  var barAreaHeight = options.height - titleAreaHeight - xAxisHeight;
  var adjustment = calcAdjustment(barAreaHeight);
  var i = 0;

  // check what type of element was passed in; a jQuery element will have a length while an element selected by document.getElementById will not
  var $elem = element.length ? element : jQuery(element);

  // define element styling
  $elem.css({
    "width": options.width,
    "height": options.height
  });

  // add chart-container class to element
  $elem.addClass("chart-container");

  // determine the width of each bar element
  var elemWidth = (options.width - (numSpaces * spacerWidth) - (yAxisWidth + axisBorderWidth)) / data.length;

  // determine maximum value for bar chart
  var maxDataValue = compareArrays(data, yAxisTicks);

  // add title
  var $titleArea = $("<div>", { "class": "title" })
    .css({
      "margin-left": yAxisWidth + axisBorderWidth,
      "font-size": titleFontSize,
      "color": titleFontColor,
      "height": titleAreaHeight
    })
    .text(chartTitle);
  $elem.append($titleArea);

  // add y axis
  var $yAxis = $("<div>", { "class": "yaxis" })
    .css({
      "border-right-width": axisBorderWidth,
      "height": barAreaHeight,
      "border-color": axisColor,
      "width": yAxisWidth
    });
  for (i = 0; i < yAxisTicks.length; i++) {
    var bottom = ((yAxisTicks[i] / maxDataValue) * 100 - adjustment) + "%";
    var $tickMark = $("<span>")
      .css({
        "color": axisColor
      })
      .text("-");
    var $tick = $("<span>", { "class": "tick" })
      .css({
        "color": labelColor,
        "bottom": bottom
      })
      .text(yAxisTicks[i] + " ")
      .append($tickMark);
    $yAxis.append($tick);
  }
  $elem.append($yAxis);

  // add bars
  for (i = 0; i < data.length; i++) {
    var $bar = $("<div>", { "class": "bar-gen bar" })
      .css({
        "width": elemWidth,
        "height": data[i][0] / maxDataValue * barAreaHeight,
        "color": fontColor,
        "background-color": barColors[i % barColors.length]
      });
    var $barValue = $("<span>", { "class": "bar-value " + valuePosition })
      .text(data[i][0]);
    $bar.append($barValue);
    if (showTooltips) {
      $bar.append($("<span>", { "class": "tooltiptext" })
        .text(data[i][1] + " - " + data[i][0]));
    }
    $elem.append(addSpacer(spacerWidth, "bar-gen spacer"), $bar);
  }

  // add x axis horizontal line
  var $horizontal = $("<hr>", { "class": "horizontal inline-block", "align": "left" })
    .css({
      "height": axisBorderWidth,
      "width": options.width - yAxisWidth,
      "color": axisColor,
      "background-color": axisColor
    });
  $elem.append(addSpacer(yAxisWidth, "y-axis-spacer"), $horizontal);

  // add x axis labels
  $elem.append(addSpacer(yAxisWidth + axisBorderWidth, "y-axis-spacer"));
  for (i = 0; i < data.length; i++) {
    var $label = $("<div>", { "class": "bar-gen label" })
      .css({
        "width": elemWidth,
        "color": labelColor
      })
      .text(data[i][1]);
    $elem.append(addSpacer(spacerWidth, "bar-gen spacer"), $label);
  }
};
