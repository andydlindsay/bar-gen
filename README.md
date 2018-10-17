# Bar-Gen
#### The no-library barchart generator

## About

Bar-Gen is a bar chart creation program that converts your data into attractive charts. Simple to use with many customizable features.

## Usage

Add ```bar-gen.js``` and ```bar-gen.css``` to your project folder.
Include them in your index page.
```
<head>
  <!-- Load bar-gen CSS -->
  <link rel="stylesheet" href="bar-gen.css">
</head>
<body>
  <!-- Load bar-gen script -->
  <script src="bar-gen.js"></script>
</body>
```
Make sure to load your own custom css and js files **after** you load the bar-gen files.

Call the bar chart generator using the ```drawBarChart``` function:
```
drawBarChart(dataArray, chartOptions, selectedElement);
```

* ```dataArray```
  * A nested array of values including the labels for the x-axis.
* ```chartOptions```
  * An object containing the various customizable aspects of the bar chart including chart title, font colors, axis colors, etc.
* ```selectedElement```
  * A DOM or jQuery element that the chart will be rendered into.

## Example usage

#### Javascript
```
var dataArray = [
  [ 10, "Monday" ],
  [ 14, "Tuesday" ],
  [ 12, "Wednesday" ],
  [ 19, "Thursday" ],
  [ 11, "Friday" ]
];
var chartOptions = {
  width: 500,
  height: 300,
  labelColor: "darkMagenta",
  yAxisTicks: [ 0, 5, 10, 15, 20 ],
  chartTitle: "Employees Who Showed Up For Work",
  titleFontSize: 24,
  spacerWidth: 3
};
drawBarChart(dataArray, chartOptions, document.getElementById("barchart"));
```

#### Output

![generated barchart](https://s3-us-west-2.amazonaws.com/andydlindsay-bar-gen/Screen+Shot+2018-10-15+at+9.52.45+PM.png)

## The *dataArray* parameter

The ```dataArray``` parameter must be a **nested** array containing the data for the chart as well as the labels for the x-axis. For example:
```
var dataArray = [
  [ 10, "Monday" ],
  [ 14, "Tuesday" ],
  [ 12, "Wednesday" ],
  [ 19, "Thursday" ],
  [ 11, "Friday" ]
];
```
Ensure that the first element in the nested array is the data value and the second is the x-axis label.

## The *chartOptions* object

Bar-gen has quite a few customizable options. Use the ```chartOptions``` object to pass these values into the function. All of the following customization options except ```width``` and ```height``` are optional.

Parameter | Optional | Summary | Default
--- | --- | --- | ---
```width``` | No | The total width (in pixels) of the element that the bar chart will be rendered into. The chart will not exceed this overall width and the width of the individual bar elements will be based on this value. | *None*
```height``` | No | The total height (in pixels) of the element that the bar chart will be rendered into. The chart will not exceed this overall height. The minimum height is 100. | *None*
```spacerWidth``` | Yes | The space (in pixels) between each bar element. | ```5```
```fontColor``` | Yes | The font color for the values that are displayed on the bar elements. | ```"white"```
```barColors``` | Yes | An array containing colors for the bar elements. If the number of colors in ```barColors``` is less than the total number of data points passed in, then the colors will repeat in the order they are stated. | ```[ "slateGrey" ]```
```axisColor``` | Yes | The color of the x and y axes. | ```"black"```
```labelColor``` | Yes | The color of the axes' labels. | ```"black"```
```valuePosition``` | Yes | The position within the bar element where the value will be displayed. Choices are ```top```, ```middle```, or ```bottom```. | ```"top"```
```yAxisTicks``` | Yes | An array showing where the ticks on the y-axis should be located. The y-axis will render to the larger of either the largest value in the ```yAxisTicks``` array or the largest value in the ```dataArray``` array. | *Generated based on 0, 20, 40, 60, 80, and 100% of the provided data*
```chartTitle``` | Yes | The title that appears above the rendered chart. | ```"Barchart Title"```
```titleFontSize``` | Yes | The font size (in pixels) of the title. | ```18```
```titleFontColor``` | Yes | The color of the title text. | ```"black"```
```xAxisHeight``` | Yes | The height (in pixels) of the x-axis. | ```20```
```showTooltips``` | Yes | A boolean value to display or hide tooltips for the chart. | ```false```
```yAxisWidth``` | Yes | The width (in pixels) of the y-axis. | ```40```
```axisBorderWidth``` | Yes | The width or thickness (in pixels) of the axes. | ```2```

## Known issues/bugs

* Does not show negative values

## Roadmap/upcoming features

* Generate multiple value (stacked) bar charts
* Handle negative values
* Specify non-zero starting point for y-axis

## External resources used

* resources list
