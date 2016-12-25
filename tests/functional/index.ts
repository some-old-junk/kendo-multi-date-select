import * as bdd from 'intern!bdd';
import * as expect from 'intern/chai!expect';
import { IndexPage } from '../support/IndexPage';
import * as Command from 'leadfoot/Command';

bdd.describe('multi date select', () => {
    let remote: Command<void>;

    bdd.before(function () {
        remote = this.remote;
    });

    bdd.it('readonly should control ability to change values', () => {
        const page = new IndexPage(remote);
        const date = IndexPage.day(15);

        return page.readonly(true)
            .then<void>(() => page.inputDatesInMultiSelect([date]))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([]);
                expect(calDates).to.eql([]);
                expect(selDates).to.eql([]);
            })
            .then<void>(() => page.readonly(false))
            .then<void>(() => page.inputDatesInMultiSelect([date]))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([date]);
                expect(calDates).to.eql([date]);
                expect(selDates).to.eql([date]);
            });
    });

    bdd.it('enable should control ability to change values', () => {
        const page = new IndexPage(remote);
        const date = IndexPage.day(15);

        return page.enable(true)
            .then<void>(() => page.inputDatesInMultiSelect([date]))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([date]);
                expect(calDates).to.eql([date]);
                expect(selDates).to.eql([date]);
            })
            .then<void>(() => page.enable(false))
            .then<void>(() => page.clickDateTagClose([date]))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([date]);
                expect(calDates).to.eql([date]);
                expect(selDates).to.eql([date]);
            });
    });

    bdd.it('should open and close calendar', () => {
        const page = new IndexPage(remote);

        return page.openCalendar()
            .then<boolean>(() => page.isCalendarOpened())
            .then(isOpened => {
                expect(isOpened).to.eql(true);
            })
            .then<void>(() => page.closeCalendar())
            .then<boolean>(() => page.isCalendarOpened())
            .then(isOpened => {
                expect(isOpened).to.eql(false);
            });
    });

    bdd.it('should open and close calendar with toggle', () => {
        const page = new IndexPage(remote);

        return page.toggle()
            .then<boolean>(() => page.isCalendarOpened())
            .then(isOpened => {
                expect(isOpened).to.eql(true);
            })
            .then<void>(() => page.toggle())
            .then<boolean>(() => page.isCalendarOpened())
            .then(isOpened => {
                expect(isOpened).to.eql(false);
            });
    });

    bdd.it('should take in account min and max values', () => {
        const page = new IndexPage(remote);
        const dates = [10, 15, 20].map(IndexPage.day);
        const min = IndexPage.day(12);
        const max = IndexPage.day(17);

        return page.openCalendar()
            .then<void>(() => page.selectDatesWithClicks(dates))
            .then<void>(() => page.limits(min, max))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([dates[1]]);
                expect(calDates).to.eql([dates[1]]);
                expect(selDates).to.eql([dates[1]]);
            })
            .then<void>(() => page.inputDatesInMultiSelect([dates[0]]))
            .then<void>(() => page.closeCalendar())
            .then<void>(() => page.inputDatesInMultiSelect([dates[2]]))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([dates[1]]);
                expect(calDates).to.eql([dates[1]]);
                expect(selDates).to.eql([dates[1]]);
            });
    });

    bdd.it('should add dates from calendar', () => {
        const page = new IndexPage(remote);
        const dates = [10, 15, 20].map(IndexPage.day);

        return page.openCalendar()
            .then<void>(() => page.selectDatesWithClicks(dates))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql(dates);
                expect(calDates).to.eql(dates);
                expect(selDates).to.eql(dates);
            });
    });

    bdd.it('should add dates with typing', () => {
        const page = new IndexPage(remote);
        const dates = [10, 15, 20].map(IndexPage.day);

        return page.inputDatesInMultiSelect(dates)
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql(dates);
                expect(calDates).to.eql(dates);
                expect(selDates).to.eql(dates);
            });
    });

    bdd.it('should add dates with api', () => {
        const page = new IndexPage(remote);
        const dates = [10, 15, 20].map(IndexPage.day);

        return page.selectDatesWithCode(dates)
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql(dates);
                expect(calDates).to.eql(dates);
                expect(selDates).to.eql(dates);
            });
    });

    bdd.it('should remove dates with api', () => {
        const page = new IndexPage(remote);
        const dates = [10, 15, 20].map(IndexPage.day);

        return page.selectDatesWithCode(dates)
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql(dates);
                expect(calDates).to.eql(dates);
                expect(selDates).to.eql(dates);
            })
            .then<void>(() => page.selectDatesWithCode([]))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([]);
                expect(calDates).to.eql([]);
                expect(selDates).to.eql([]);
            });
    });

    bdd.it('should remove dates from calendar', () => {
        const page = new IndexPage(remote);
        const dates = [10, 15, 20].map(IndexPage.day);

        return page.selectDatesWithCode(dates)
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql(dates);
                expect(calDates).to.eql(dates);
                expect(selDates).to.eql(dates);
            })
            .then<void>(() => page.openCalendar())
            .then<void>(() => page.selectDatesWithClicks(dates))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([]);
                expect(calDates).to.eql([]);
                expect(selDates).to.eql([]);
            });
    });

    bdd.it('should remove dates with typing', function () {
        const page = new IndexPage(remote);
        const dates = [10, 15, 20].map(IndexPage.day);

        if (this.parent.parent.name.indexOf('safari') === 0) {
            this.skip('can\'t use BACKSPACE in safaridriver');
        }

        return page.selectDatesWithCode(dates)
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql(dates);
                expect(calDates).to.eql(dates);
                expect(selDates).to.eql(dates);
            })
            .then<void>(() => page.inputBackspaceInMultiSelect())
            .then<void>(() => page.inputBackspaceInMultiSelect())
            .then<void>(() => page.inputBackspaceInMultiSelect())
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([]);
                expect(calDates).to.eql([]);
                expect(selDates).to.eql([]);
            });
    });

    bdd.it('should remove dates with "x"-icons', () => {
        const page = new IndexPage(remote);
        const dates = [10, 15, 20].map(IndexPage.day);

        return page.selectDatesWithCode(dates)
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql(dates);
                expect(calDates).to.eql(dates);
                expect(selDates).to.eql(dates);
            })
            .then<void>(() => page.clickDateTagClose(dates))
            .then<Date[][]>(() => page.packedSelectedDates())
            .then(([apiDates, calDates, selDates]) => {
                expect(apiDates).to.eql([]);
                expect(calDates).to.eql([]);
                expect(selDates).to.eql([]);
            });
    });
});
