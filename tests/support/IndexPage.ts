import * as Command from 'leadfoot/Command';
import { IRequire } from 'dojo/loader';
import * as Promise from 'dojo/Promise';
import Element = require('leadfoot/Element');
import * as keys from 'intern/dojo/node!leadfoot/keys';

export class IndexPage {

    private static calendarDelay = 1000;

    constructor(private remote: Command<any>, options = { autoClose: false }) {
        const code = (autoClose: boolean, cb: Function) => {
            $('#multi-date-select').kendoMultiDateSelect({ autoClose });
            cb();
        };

        this.remote = remote
            .get((require as IRequire & NodeRequire).toUrl('../index.html'))
            .setFindTimeout(2500)
            .setPageLoadTimeout(5000)
            .executeAsync(code, [options.autoClose]);
    }

    public static day(day: number): Date {
        const today = new Date();

        return new Date(today.getFullYear(), today.getMonth(), day);
    }

    private static dateToString(date: Date): string {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    private static daySel(date: Date): string {
        return `[data-value="${date.getFullYear()}/${date.getMonth()}/${date.getDate()}"]`;
    }

    private static parseDates(dates: string): Date[] {
        return JSON.parse(dates).map((date: string) => new Date(date));
    }

    public selectDatesWithCode(dates: Date[]): Command<void> {
        const code = (stringDates: string[]) => {
            $('#multi-date-select')
                .data('kendoMultiDateSelect')
                .values(stringDates.map((date: string) => new Date(date)));
        };

        return this.remote
            .execute<void>(code, [dates]);
    }

    public selectDatesWithClicks(dates: Date[]): Command<void> {
        return dates.reduce(
            (command, date) => {
                return command.then<any>(() => this.remote
                    .findByCssSelector(IndexPage.daySel(date))
                    .then<void>(this.mouseClick)
                );
            },
            this.remote
        );
    }

    public openCalendar(): Command<void> {
        return this.remote
            .findById('multi-date-select')
            .then<void>(this.mouseClick)
            .sleep(IndexPage.calendarDelay);
    }

    public closeCalendar(): Command<void> {
        return this.remote
            .findById('outside')
            .then<void>(this.mouseClick)
            .sleep(IndexPage.calendarDelay);
    }

    public toggle() {
        const code = () => {
            $('#multi-date-select')
                .data('kendoMultiDateSelect')
                .toggle();
        };

        return this.remote
            .execute(code, [])
            .sleep(IndexPage.calendarDelay);
    }

    public limits(min: Date, max: Date): Command<void> {
        const code = (stringMin: string, stringMax: string) => {
            const widget = $('#multi-date-select')
                .data('kendoMultiDateSelect');

            widget.min(new Date(stringMin));
            widget.max(new Date(stringMax));
        };

        return this.remote
            .execute<void>(code, [min, max]);
    }

    public enable(enable: boolean): Command<void> {
        const code = (isEnabled: boolean) => {
            $('#multi-date-select')
                .data('kendoMultiDateSelect')
                .enable(isEnabled);
        };

        return this.remote
            .execute<void>(code, [enable]);
    }

    public readonly(readonly: boolean): Command<void> {
        const code = (isReadonly: boolean) => {
            $('#multi-date-select input').blur();

            $('#multi-date-select')
                .data('kendoMultiDateSelect')
                .readonly(isReadonly);
        };

        return this.remote
            .execute<void>(code, [readonly]);
    }

    public inputDatesInMultiSelect(dates: Date[]): Command<void> {
        const elemCommand = this.remote
            .findByCssSelector('#multi-date-select input');

        return dates.reduce(
            (command: Command<void>, date) => {
                return command.then<any>(() => elemCommand
                    .type([IndexPage.dateToString(date), keys.ENTER])
                );
            },
            elemCommand
        );
    };

    public inputBackspaceInMultiSelect(): Command<void> {
        return this.remote
            .findByCssSelector('#multi-date-select input')
            .type(keys.BACKSPACE);
    }

    public clickDateTagClose(dates: Date[]): Command<void> {
        const code = (stringDate: string) => {
            $(`span:contains(${kendo.toString(new Date(stringDate), 'd')}) + span span`).click();
        };

        return dates.reduce(
            (command, date) => {
                return command.then<any>(() => this.remote
                    .execute(code, [date])
                );
            },
            this.remote
        );
    }

    public isCalendarOpened(options = { delayed: false }): Command<boolean> {
        const code = () => {
            return $('.k-calendar-container').css('display') !== 'none';
        };

        return this.remote
            .sleep(options.delayed ? IndexPage.calendarDelay : 0)
            .execute(code, []);
    }

    public isEnabled(): Command<boolean> {
        return this.remote
            .findByCssSelector('#multi-date-select input')
            .isEnabled();
    }

    public multiSelectIsPresent(): Command<boolean> {
        const code = () => {
            const multiSelect = $('#multi-date-select')
                .data('kendoMultiDateSelect')
                .multiSelect();

            return multiSelect instanceof kendo.ui.MultiSelect;
        };

        return this.remote
            .execute(code, []);
    }

    public multiCalendarIsPresent(): Command<boolean> {
        const code = () => {
            const multiCalendar = $('#multi-date-select')
                .data('kendoMultiDateSelect')
                .multiCalendar();

            return multiCalendar instanceof kendoExt.MultiCalendar;
        };

        return this.remote
            .execute(code, []);
    }

    public multiDateSelectIsPresent(): Command<boolean> {
        const code = () => {
            const multiDateSelect = $('#multi-date-select')
                .data('kendoMultiDateSelect');

            return multiDateSelect instanceof kendoExt.MultiDateSelect;
        };

        return this.remote
            .execute(code, []);
    }

    public destroy(): Command<void> {
        const code = () => {
            $('#multi-date-select')
                .data('kendoMultiDateSelect')
                .destroy();
        };

        return this.remote
            .execute<void>(code, []);
    }

    public packedSelectedDates(): Command<Date[][]> {
        return this.remote
            .then(() => Promise.all([
                this.selectedDates().promise,
                this.calendarSelectedDates().promise,
                this.multiSelectSelectedDates().promise
            ]));
    }

    private calendarSelectedDates(): Command<Date[]> {
        const code = () => {
            const dates = $('td.k-state-selected > a')
                .get()
                .map((elem: HTMLElement) => new Date(elem.getAttribute('title') as string));

            return JSON.stringify(dates);
        };

        return this.remote
            .execute(code, [])
            .then(IndexPage.parseDates);
    }

    private multiSelectSelectedDates(): Command<Date[]> {
        const code = () => {
            const dates = $('.k-button > span:not(.k-select)')
                .get()
                .map((elem: HTMLElement) => new Date(elem.textContent as string));

            return JSON.stringify(dates);
        };

        return this.remote
            .execute(code, [])
            .then(IndexPage.parseDates);
    }

    private selectedDates(): Command<Date[]> {
        const code = () => {
            const dates = $('#multi-date-select')
                .data('kendoMultiDateSelect')
                .values()
                .map(date => new Date(date.getFullYear(), date.getMonth(), date.getDate()));

            return JSON.stringify(dates);
        };

        return this.remote
            .execute(code, [])
            .then(IndexPage.parseDates);
    }

    private mouseClick = (element: Element): Command<void> => {
        return this.remote
            .moveMouseTo(element)
            .clickMouseButton();
    }
}
