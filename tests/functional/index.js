define([
    'intern!bdd',
    'intern/chai!expect',
    '../support/IndexPage'
], 
function (bdd, expect, IndexPage) {

    var datesToStrings = function (dates) {
        return dates.map(function (date) {
            return date.toString();
        });
    };

    var dateInCurrentMonth = function (day) {
        var today = new Date();

        return new Date(today.getFullYear(), today.getMonth(), day);
    };

    var checkDates = function (indexPage, expected) {
        console.log('expected', datesToStrings(expected).join(', '));

        return indexPage.selectedDates()
            .then(function (dates) {
                console.log('selected', datesToStrings(dates).join(', '));
                expect(datesToStrings(dates)).to.have.all.members(datesToStrings(expected));

                return indexPage.calendarSelectedDates();
            })
            .then(function (dates) {
                console.log('cal', datesToStrings(dates).join(', '));
                expect(datesToStrings(dates)).to.have.all.members(datesToStrings(expected));

                return indexPage.multiSelectSelectedDates();
            })
            .then(function (dates) {
                console.log('ms', datesToStrings(dates).join(', '));
                expect(datesToStrings(dates)).to.have.all.members(datesToStrings(expected));
            });
    };

    bdd.describe('index', function () {
        var indexPage;

        var testDates = [1, 10, 20].map(dateInCurrentMonth);

        bdd.before(function () {
            indexPage = new IndexPage(this.remote);
        });

        bdd.describe('misc api', function () {
            var min = dateInCurrentMonth(5);
            var max = dateInCurrentMonth(15);

            bdd.afterEach(function () {
                return indexPage.setDates([])
                    .then(function () {
                        return indexPage.limits(new Date(2000, 1, 1), new Date(2100, 1, 1));
                    })
                    .then(function () {
                        return indexPage.readonly(false);
                    })
                    .then(function () {
                        return indexPage.enable(true);
                    });
            });

            bdd.it('readonly', function () {

                return indexPage.readonly(true)
                    .then(function () {
                        return indexPage.inputDateInMultiSelect(testDates[1]);
                    })
                    .then(function () {
                        return checkDates(indexPage, []);
                    })
                    .then(function () {
                        return indexPage.readonly(false);
                    })
                    .then(function () {
                        return indexPage.inputDateInMultiSelect(testDates[1]);
                    })
                    .then(function () {
                        return checkDates(indexPage, [testDates[1]]);
                    });
            });

            bdd.it('open & close', function () {

                return indexPage.closeCalendar()
                    .then(function () {
                        return indexPage.isCalendarOpened();
                    })
                    .then(function (isOpened) {
                        expect(isOpened).to.be.false;

                        return indexPage.openCalendar();
                    })
                    .then(function () {
                        return indexPage.isCalendarOpened();
                    })
                    .then(function (isOpened) {
                        expect(isOpened).to.be.true;
                    });
            });

            bdd.it('enabled/disabled', function () {

                return indexPage.enable(false)
                    .then(function () {
                        return indexPage.isEnabled();
                    })
                    .then(function (enabled) {
                        expect(enabled).to.be.false;

                        return indexPage.enable(true);
                    })
                    .then(function () {
                        return indexPage.isEnabled();
                    })
                    .then(function (enabled) {
                        expect(enabled).to.be.true;
                    });
            });

            bdd.it('toggle', function () {
                var initial;

                return indexPage.isCalendarOpened()
                    .then(function (isOpened) {
                        initial = isOpened;

                        return indexPage.toggle();
                    })
                    .then(function () {
                        return indexPage.isCalendarOpened();
                    })
                    .then(function (isOpened) {
                        expect(isOpened).to.be.not.equal(initial);

                        return indexPage.toggle();
                    })
                    .then(function () {
                        return indexPage.isCalendarOpened();
                    })
                    .then(function (isOpened) {
                        expect(isOpened).to.be.equal(initial);
                    });
            });

            bdd.it('min & max', function () {

                return indexPage.openCalendar()
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[0]);
                    })
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[1]);
                    })
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[2]);
                    })
                    .then(function () {
                        return indexPage.limits(min, max);
                    })
                    .then(function () {
                        return checkDates(indexPage, [testDates[1]]);
                    })
                    .then(function () {
                        return indexPage.inputDateInMultiSelect(testDates[0]);
                    })
                    .then(function () {
                        return indexPage.closeCalendar();
                    })
                    .then(function () {
                        return indexPage.inputDateInMultiSelect(testDates[2]);
                    })
                    .then(function () {
                        return checkDates(indexPage, [testDates[1]]);
                    });
            });
        });

        bdd.describe('adding dates', function () {

            bdd.beforeEach(function () {
                return indexPage.setDates([]);
            });

            bdd.it('via calendar', function () {
                return indexPage.openCalendar()
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[0]);
                    })
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[1]);
                    })
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[2]);
                    })
                    .then(function () {
                        return checkDates(indexPage, testDates);
                    });
            });

            bdd.it('via typing', function () {
                return indexPage.inputDateInMultiSelect(testDates[0])
                    .then(function () {
                        return indexPage.inputDateInMultiSelect(testDates[1]);
                    })
                    .then(function () {
                        return indexPage.inputDateInMultiSelect(testDates[2]);
                    })
                    .then(function () {
                        return checkDates(indexPage, testDates);
                    });
            });
        });

        bdd.describe('removing dates', function () {

            bdd.beforeEach(function () {
                return indexPage.setDates(testDates);
            });

            bdd.it('via api', function () {
                return indexPage.setDates([])
                    .then(function () {
                        return checkDates(indexPage, []);
                    });
            })

            bdd.it('via calendar', function () {
                return indexPage.openCalendar()
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[0]);
                    })
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[1]);
                    })
                    .then(function () {
                        return indexPage.clickDateInCalendar(testDates[2]);
                    })
                    .then(function () {
                        return checkDates(indexPage, []);
                    });
            });

            bdd.it('via typing', function () {
                return indexPage.inputBackspaceInMultiSelect()
                    .then(function () {
                        return indexPage.inputBackspaceInMultiSelect();
                    })
                    .then(function () {
                        return indexPage.inputBackspaceInMultiSelect();
                    })
                    .then(function () {
                        return checkDates(indexPage, []);
                    });
            });

            bdd.it('via "x"-icons', function () {
                return indexPage.clickDateTagClose(testDates[0])
                    .then(function () {
                        return indexPage.clickDateTagClose(testDates[1]);
                    })
                    .then(function () {
                        return indexPage.clickDateTagClose(testDates[2]);
                    })
                    .then(function () {
                        return checkDates(indexPage, []);
                    });
            });
        });
    });
});