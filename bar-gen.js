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
  var largestValue = maxValue(firstValue(data));
  var numZeroes = largestValue.toString().length - 2 < 0 ? 0 : largestValue.toString().length - 2;
  var maxVal = Math.ceil(largestValue / (5 * Math.pow(10, numZeroes))) * (5 * Math.pow(10, numZeroes));
  var returnArray = [];
  for (var i = 0; i <= 10; i += 2) {
    returnArray.push(Math.ceil(i / 10 * maxVal));
  }
  return returnArray;
};

// compares two arrays to determine the highest value
var compareArrays = function(array1, array2) {
  // determine if the arrays passed in are nested or not
  var procArray1 = array1[0].length ? firstValue(array1) : array1;
  var procArray2 = array2[0].length ? firstValue(array2) : array2;

  // determine the highest value between the arrays
  return maxValue(procArray1) > maxValue(procArray2) ? maxValue(procArray1) : maxValue(procArray2);
};

// calculate adjustment needed to make y-axis ticks line up
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

// initialize the options object
var initializeOptionObj = function(options, data) {
  var optionsObj = {
    width: 0,
    height: 0,
    spacerWidth: 2,
    fontColor: "white",
    barColors: [ "slateGrey" ],
    axisColor: "black",
    labelColor: "black",
    valuePosition: "top",
    yAxisTicks: generateTicks(data),
    chartTitle: "Chart",
    titleFontSize: 24,
    titleFontColor: "black",
    xAxisHeight: 20,
    showTooltips: false,
    yAxisWidth: 40,
    axisBorderWidth: 2,
    showAnimation: false
  };

  // loop through options object and overwrite optionsObj defaults
  for (var prop in options) {
    if (optionsObj.hasOwnProperty(prop)) {
      optionsObj[prop] = options[prop];
    }
  }

  // add calculations to options object
  optionsObj.titleAreaHeight = optionsObj.titleFontSize + 10;
  optionsObj.barAreaHeight = optionsObj.height - optionsObj.titleAreaHeight - optionsObj.xAxisHeight;

  return optionsObj;
};

// main function
var drawBarChart = function(data, options, element) {
  // variable declaration
  var numSpaces = data.length;
  var optionsObj = initializeOptionObj(options, data);
  var adjustment = calcAdjustment(optionsObj.barAreaHeight);
  var i = 0;

  // check what type of element was passed in; a jQuery element will have a length while an element selected by document.getElementById will not
  var $elem = element.length ? element : jQuery(element);

  // define element styling
  $elem.css({
    "width": optionsObj.width,
    "height": optionsObj.height
  });

  // add chart-container class to element
  $elem.addClass("chart-container");

  // determine the width of each bar element
  var elemWidth = (optionsObj.width - (numSpaces * optionsObj.spacerWidth) - (optionsObj.yAxisWidth + optionsObj.axisBorderWidth)) / data.length;

  // determine maximum value for bar chart
  var maxDataValue = compareArrays(data, optionsObj.yAxisTicks);

  // add title
  var $titleArea = $("<div>", { "class": "title" })
    .css({
      "margin-left": optionsObj.yAxisWidth + optionsObj.axisBorderWidth,
      "font-size": optionsObj.titleFontSize,
      "color": optionsObj.titleFontColor,
      "height": optionsObj.titleAreaHeight
    })
    .text(optionsObj.chartTitle);
  $elem.append($titleArea);

  // add y axis
  var $yAxis = $("<div>", { "class": "yaxis" })
    .css({
      "border-right-width": optionsObj.axisBorderWidth,
      "height": optionsObj.barAreaHeight,
      "border-color": optionsObj.axisColor,
      "width": optionsObj.yAxisWidth
    });
  for (i = 0; i < optionsObj.yAxisTicks.length; i++) {
    var bottom = ((optionsObj.yAxisTicks[i] / maxDataValue) * 100 - adjustment) + "%";
    var $tickMark = $("<span>")
      .css({
        "color": optionsObj.axisColor
      })
      .text("-");
    var $tick = $("<span>", { "class": "tick" })
      .css({
        "color": optionsObj.labelColor,
        "bottom": bottom
      })
      .text(optionsObj.yAxisTicks[i] + " ")
      .append($tickMark);
    $yAxis.append($tick);
  }
  $elem.append($yAxis);

  // add bars
  for (i = 0; i < data.length; i++) {
    var $bar = $("<div>", { "class": "bar-gen bar" })
      .css({
        "width": elemWidth,
        "height": data[i][0] / maxDataValue * optionsObj.barAreaHeight,
        "color": optionsObj.fontColor,
        "background-color": optionsObj.barColors[i % optionsObj.barColors.length]
      });
    if (optionsObj.showAnimation) {
      $bar.css({ "height": 0 })
        .animate({
          "height": "+=" + (data[i][0] / maxDataValue * optionsObj.barAreaHeight) + "px"
        }, "slow");
    }
    var $barValue = $("<span>", { "class": "bar-value " + optionsObj.valuePosition })
      .text(data[i][0]);
    $bar.append($barValue);
    if (optionsObj.showTooltips) {
      $bar.append($("<span>", { "class": "tooltiptext" })
        .text(data[i][1] + " - " + data[i][0]));
    }
    $elem.append(addSpacer(optionsObj.spacerWidth, "bar-gen spacer"), $bar);
  }

  // add x axis horizontal line
  var $horizontal = $("<hr>", { "class": "horizontal inline-block", "align": "left" })
    .css({
      "height": optionsObj.axisBorderWidth,
      "width": optionsObj.width - optionsObj.yAxisWidth,
      "color": optionsObj.axisColor,
      "background-color": optionsObj.axisColor
    });
  $elem.append(addSpacer(optionsObj.yAxisWidth, "y-axis-spacer"), $horizontal);

  // add x axis labels
  $elem.append(addSpacer(optionsObj.yAxisWidth + optionsObj.axisBorderWidth, "y-axis-spacer"));
  for (i = 0; i < data.length; i++) {
    var $label = $("<div>", { "class": "bar-gen label" })
      .css({
        "width": elemWidth,
        "color": optionsObj.labelColor
      })
      .text(data[i][1]);
    $elem.append(addSpacer(optionsObj.spacerWidth, "bar-gen spacer"), $label);
  }
};
