(function () {
    'use strict';

    var ui = kendo.ui;
    var Widget = ui.Widget;
    var extend = $.extend;
    var Popup = ui.Popup;
    var keys = kendo.keys;

    var navigateEvent = 'navigate';
    var changeEvent = 'change';
    var openEvent = 'open';
    var closeEvent = 'close';

    function removeTime(date) {
        var d = new Date(date);

        d.setMilliseconds(0);
        d.setSeconds(0);
        d.setMinutes(0);
        d.setHours(0);

        return d;
    }

    function isDateGreater(first, second) {
        return removeTime(first).getTime() > removeTime(second).getTime();
    }

    function isDateLesser(first, second) {
        return removeTime(first).getTime() < removeTime(second).getTime();
    }

    function isDatesEqual(first, second) {
        return removeTime(first).getTime() === removeTime(second).getTime();
    }

    var MultiDateSelect = Widget.extend({
        _multiSelect: null,
        _multiCalendar: null,
        _popup: null,

        init: function (element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that._initMultiSelect(element);
            that._initPopup(element);
            that._initCalendar(that._popup.element);

            that._updateDateInterval();
        },

        options: {
            name: 'MultiDateSelect',
            autoClose: true,
            popup: {},
            animation: {},
            enable: true,
            maxSelectedItems: null,
            placeholder: '',
            tagTemplate: '',
            values: null,
            footer: '',
            culture: '',
            format: 'M/d/yyyy',
            min: new Date(1900, 0, 1),
            max: new Date(2099, 11, 31),
            start: 'month',
            depth: 'month',
            month : {},
            dates: []
        },

        events: [
            navigateEvent,
            changeEvent,
            openEvent,
            closeEvent
        ],

        close: function () {
            this._popup.close();
        },

        open: function () {
            this._popup.open();
        },

        toggle: function () {
            if (this._popup.visible()) {
                this.close();

            } else {
                this.open();
            }
        },

        destroy: function () {
            this._multiSelect.wrapper
                .find('input')
                .off('keydown');

            this._popup.destroy();
            this._multiSelect.destroy();
            this._multiCalendar.destroy();
        },

        enable: function (enable) {
            this._multiSelect.enable(enable);
        },

        readonly: function (readonly) {
            this._multiSelect.readonly(readonly);
        },

        max: function (max) {
            if (max !== undefined) {
                this._multiCalendar.max(max);

                this._updateDateInterval();
            }

            return this._multiCalendar.max();
        },

        min: function (min) {
            if (min !== undefined) {
                this._multiCalendar.min(min);

                this._updateDateInterval();
            }

            return this._multiCalendar.min();
        },

        values: function (values) {
            var that = this;

            if (values !== undefined) {
                var min = that.min();
                var max = that.max();

                var vs = (values || []).filter(function (date) {
                    return !(
                        (min && isDateLesser(date, min))
                        || (max && isDateGreater(date, max))
                    );
                });

                that._multiCalendar.values(vs);
                that._updateMultiSelectValues(vs);

                that._multiCalendar.navigate(
                    vs.length ? vs[vs.length - 1] : new Date()
                );
            }

            return this._multiCalendar.values();
        },

        multiSelect: function () {
            return this._multiSelect;
        },

        multiCalendar: function () {
            return this._multiCalendar;
        },

        _initCalendar: function (parent) {
            var that = this;

            var options = that.options;

            var change = function () {
                that._updateMultiSelect();

                that.trigger(changeEvent);
            };

            var navigate = function () {
                that.trigger(navigateEvent);
            };

            that._multiCalendar = $('<div></div>')
                .appendTo(parent)
                .kendoMultiCalendar({
                    values: options.values,
                    footer: options.footer,
                    culture: options.culture,
                    min: options.min,
                    max: options.max,
                    start: options.start,
                    depth: options.depth,
                    month : options.month,
                    dates: options.dates,
                    maxSelectedItems: options.maxSelectedItems,
                    change: change,
                    navigate: navigate
                })
                .data('kendoMultiCalendar');

            kendo.calendar.makeUnselectable(
                that._multiCalendar.element
            );
        },

        _initPopup: function (anchor) {
            var that = this;
            var options = that.options;

            var open = function () {
                that.trigger(openEvent);
            };

            var close = function () {
                that.trigger(closeEvent);
            };

            that._popup = $('<div class="k-calendar-container"></div>')
                .appendTo(document.body)
                .kendoPopup(extend(
                    options.popup,
                    {
                        name: 'Popup',
                        animation: options.animation,
                        anchor: anchor,
                        open: open,
                        close: close
                    }
                ))
                .data('kendoPopup');
        },

        _initMultiSelect: function (parent) {
            var that = this;
            var options = that.options;

            options.tagTemplate = options.tagTemplate || function (data) {
                return kendo.toString(data, options.format);
            };

            var open = function (e) {
                e.preventDefault();

                that.open();
            };

            var change = function () {
                that._multiCalendar.values(that._multiSelect.value());

                that._popup.position();

                that.trigger(changeEvent);
            };

            that._multiSelect = $('<select multiple></select>')
                .appendTo(parent)
                .kendoMultiSelect({
                    dataSource: options.values,
                    value: options.values,
                    ignoreCase: false,
                    enable: options.enable,
                    maxSelectedItems: options.maxSelectedItems,
                    placeholder: options.placeholder,
                    tagTemplate: options.tagTemplate,
                    open: open,
                    change: change
                })
                .data('kendoMultiSelect');

            that._multiSelect._filterSource = function () {};
            that._multiSelect.search = function () {};

            that._multiSelect.wrapper
                .find('input')
                .on('keydown', function (e) {
                    var key = e.keyCode;
                    var inputValue = e.target.value;

                    if (key === keys.ENTER) {
                        var parsedDate = kendo.parseDate(
                            inputValue,
                            that.options.format
                        );

                        var values = that.values();

                        if (parsedDate
                            && parsedDate <= that.max()
                            && parsedDate >= that.min()
                            // && !values.some(function (v) {
                            //     return isDatesEqual(v, parsedDate);
                            // })
                        ) {
                            var dates = values.concat(parsedDate);

                            that._multiCalendar.values(dates);
                            that._updateMultiSelect();

                            that._multiCalendar.navigate(parsedDate);

                            that.trigger(changeEvent);
                        }
                    }
                });
        },

        _updateDateInterval: function () {
            this.values(this.values());
        },

        _updateMultiSelectValues: function (values) {
            this._multiSelect.setDataSource(values);
            this._multiSelect.value(values);

            if (this._popup.visible()) {
                this._popup.position();
            }
        },

        _updateMultiSelect: function () {
            this._updateMultiSelectValues(this._multiCalendar.values());

            if (this.options.autoClose) {
                this.close();
            }
        }
    });

    ui.plugin(MultiDateSelect);
}());
