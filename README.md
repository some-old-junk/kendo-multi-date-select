kendo-multi-date-select
=========
[![npm version](https://badge.fury.io/js/kendo-multi-date-select.svg)](https://badge.fury.io/js/kendo-multi-date-select)
[![Build Status](https://travis-ci.org/iyegoroff/kendo-multi-date-select.svg?branch=master)](https://travis-ci.org/iyegoroff/kendo-multi-date-select)
[![Coverage Status](https://coveralls.io/repos/github/iyegoroff/kendo-multi-date-select/badge.svg?branch=master)](https://coveralls.io/github/iyegoroff/kendo-multi-date-select?branch=master)
[![devDependency Status](https://david-dm.org/iyegoroff/kendo-multi-date-select/dev-status.svg)](https://david-dm.org/iyegoroff/kendo-multi-date-select#info=devDependencies)
[![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/kendo-multi-date-select)

This plugin is a composition of Kendo UI MultiSelect and [kendo-multi-calendar](https://www.npmjs.com/package/kendo-multi-calendar).

This widget is designed for multiple dates selection from drop-down calendar the same way as drop-down list items are selected with MultiSelect. [Demo](http://iyegoroff.github.io/kendo-multi-date-select/)

## Installation

```bash
$ npm i kendo-multi-date-select
```

kendo-multi-date-select.min.js script should be included in your project along with <strong>kendo-multi-calendar.min.js</strong> and kendo-ui-core or kendo-ui.

## Usage

```javascript
$("#multiDateSelect").kendoMultiDateSelect({
    // specify configuration and event handlers here
});
```

## Reference

### Configuration
___

##### autoClose
`boolean` (default: true)<br/>If true calendar will be closed on date selection.

##### popup 
`Object` (default: {})<br/>Options for calendar popup initialization.

##### animation 
`Object | false` (default: {})<br/>Options for calendar popup animation.

##### enable 
`boolean` (default: true)<br/>If false user input won't be allowed.

##### maxSelectedItems 
`number` (default: null)<br/>Defines the limit of selected items unless null.

##### placeholder
`string` (default: '')<br/>Placeholder for empty input.

##### tagTemplate 
`string | ((data: Date) => string)` (default: '')<br/>Template for rendering tags, if not specified 'format' option will be used to render tags.

##### format
`string` (default: 'M/d/yyyy')<br/>Defines format for parsing user input and displaying tags if 'tagTemplate' option is not specified.

##### values
`Date[]` (default: null)<br/>Initial selected dates.

##### footer
`string | false | ((data: Date) => string)` (default: '')<br/>Template for rendering calendar footer.
 
##### culture 
`string` (default: '')<br/>Calendar culture ('en-US', 'de-DE', etc.).

##### min
`Date` (default: new Date(1900, 0, 1))<br/>Minimum date that can be selected.

##### max
`Date` (default: new Date(2099, 11, 31))<br/>Maximum date that can be selected.

##### start
`string` (default: 'month')<br/>Specifies calendar start view.

##### depth
`string` (default: 'month')<br/>Specifies calendar navigation depth.

##### month
`Object` (default: {})<br/>Specifies calendar templates for the cells.
 
##### dates 
`Date[]` (default: [])<br/>Special calendar dates, which will be passed to month template.

### Methods
___

##### close
`() => void`<br/>Closes calendar popup.

##### open
`() => void`<br/>Opens calendar popup.

##### toggle
`() => void`<br/>Toggles calendar popup.

##### destroy
`() => void`<br/>Destroys the widget with underlying calendar and multi-select widgets.

##### enable
`(enable: boolean) => void`<br/>Enables or disables multi-select.
 
##### readonly
`(enable: boolean) => void`<br/>Changes multi-select 'readonly' state.

##### min
`(min: Date) => Date`<br/>Gets/sets the min value of the calendar.

##### max
`(max: Date) => Date`<br/>Gets/sets the max value of the calendar.

##### values
`(values: Date[]) => Date[]`<br/>Gets/sets selected values.

##### multiSelect
`() => MultiSelect`<br/>Gets underlying multi-select widget.

##### multiCalendar
`() => MultiCalendar`<br/>Gets underlying calendar widget.

### Events
___

##### navigate
Fires when calendar view is changed.

##### change
Fires when the selected dates are changed.

##### open
Fires when calendar popup opens.

##### close
Fires when calendar popup closes.

## Tests

Tested with Intern.js.

## Contributing

Add tests for any new or changed functionality.

