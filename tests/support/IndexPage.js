define([
    'require', 
    'intern/dojo/node!leadfoot/keys'
],
function (require, keys) {
    var delay = 250;

    function dateToString(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }

    function dateToCellSelector(date) {
        return '[data-value="' + date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + '"]';
    }

    function parseDates(dates) {
        return JSON.parse(dates).map(function (date) {
            return new Date(date);
        });
    }
    
    function IndexPage (remote) {
        this.remote = remote.get(require.toUrl('../../src/index.html'));
    }

    IndexPage.prototype = {
        setDates: function (dates) {
            return this.remote
                .execute(function (dates) {
                    $('#multiDateSelect')
                        .data('kendoMultiDateSelect')
                        .values(dates.map(function (d) { return new Date(d); }));    
                }, [dates])
                .sleep(delay);
        },

        openCalendar: function () {
            return this.remote
                .findById('multiDateSelect')
                    .click()
                    .end()
                .sleep(delay);
        },

        closeCalendar: function () {
            return this.remote
                .findById('outside')
                    .click()
                    .end()
                .sleep(delay);
        },

        toggle: function () {
            return this.remote
                .execute(function () {
                    $('#multiDateSelect')
                        .data('kendoMultiDateSelect')
                        .toggle();
                })
                .sleep(delay);
        },

        limits: function (min, max) {
            return this.remote
                .execute(function (min, max) {
                    var widget = $('#multiDateSelect')
                        .data('kendoMultiDateSelect');

                    widget.min(new Date(min));
                    widget.max(new Date(max));
                }, [min, max])
                .sleep(delay);
        },

        enable: function (enable) {
            return this.remote
                .execute(function (enable) {
                    $('#multiDateSelect')
                        .data('kendoMultiDateSelect')
                        .enable(enable);
                }, [enable])
                .sleep(delay);
        },

        readonly: function (readonly) {
            return this.remote
                .execute(function (readonly) {
                    $('#multiDateSelect')
                        .data('kendoMultiDateSelect')
                        .readonly(readonly);
                }, [readonly])
                .sleep(delay);
        },

        inputDateInMultiSelect: function (date) {
            return this.remote
                .findById('multiDateSelect')
                    .findByTagName('input')
                        .type([dateToString(date), keys.ENTER])
                        .end()
                    .end()
                .sleep(delay);
        },

        clickDateInCalendar: function (date) {
            return this.remote
                .findByCssSelector(dateToCellSelector(date))
                    .click()
                    .end()
                .sleep(delay);
        },

        inputBackspaceInMultiSelect: function () {
            return this.remote
                .findById('multiDateSelect')
                    .findByTagName('input')
                        .type(keys.BACKSPACE)
                        .end()
                    .end()
                .sleep(delay);
        },

        clickDateTagClose: function (date) {
            return this.remote
                .execute(function (date) {
                    return $('span:contains(' + kendo.toString(new Date(date), 'd') + ') + span').get(0);
                }, [date])
                .then(function (elem) {
                    return elem.click();
                })
                .sleep(delay);
        },
        
        calendarSelectedDates: function () {
            return this.remote
                .execute(function () {
                    var dates = $('td.k-state-selected > a')
                        .get()
                        .map(function (elem) {
                            return new Date(elem.getAttribute('title'));
                        });

                    return JSON.stringify(dates);
                })
                .then(parseDates);
        },

        multiSelectSelectedDates: function () {
            return this.remote
                .execute(function () {
                    var dates = $('span[unselectable="on"]:not(.k-select):not(.k-icon)')
                        .get()
                        .map(function (elem) {
                            return new Date(elem.innerText);
                        });

                    return JSON.stringify(dates);
                })
                .then(parseDates);
        },

        selectedDates: function () {
            return this.remote
                .execute(function () {
                    var dates = $('#multiDateSelect')
                        .data('kendoMultiDateSelect')
                        .values()
                        .map(function (date) {
                            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
                        });

                    return JSON.stringify(dates);   
                })
                .then(parseDates);
        },

        isCalendarOpened: function () {
            return this.remote
                .findByCssSelector('.k-calendar-container')
                    .isDisplayed();
        },

        isEnabled: function () {
            return this.remote
                .findById('multiDateSelect')
                    .findByTagName('input')
                        .isEnabled();
        }

    };

    return IndexPage;
});