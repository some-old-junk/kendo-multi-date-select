namespace kendoExt {
  export interface MultiDateSelectOptions {
    autoClose?: boolean;
    enable?: boolean;
    maxSelectedItems?: number;
    cleanSelectedItemsOnTodayClick?: boolean;
    placeholder?: string;
    tagTemplate?: string;
    values?: Date[];
    footer?: string;
    culture?: string;
    format?: string;
    min?: Date;
    max?: Date;
    start?: CalendarDepth;
    depth?: CalendarDepth;
    month?: Object;
    dates?: Date[];
  }

  export class MultiDateSelect extends kendo.ui.Widget {
    static navigateEvent = 'navigate';
    static changeEvent = 'change';
    static openEvent = 'open';
    static closeEvent = 'close';

    private _multiSelect: kendo.ui.MultiSelect;
    private _multiCalendar: any;
    private _popup: kendo.ui.Popup;

    constructor(element: Element | JQuery | string, options?: MultiDateSelectOptions) {
      super(element as Element, options);

      this.initMultiSelect(element);
      this.initPopup(element);
      this.initCalendar(this._popup.element);

      this.updateDateInterval();
    }

    private static removeTime(date: Date): Date {
      const d = new Date(date.toString());

      d.setMilliseconds(0);
      d.setSeconds(0);
      d.setMinutes(0);
      d.setHours(0);

      return d;
    }

    private static isDateGreater(first: Date, second: Date): boolean {
      return (
        MultiDateSelect.removeTime(first).getTime() > MultiDateSelect.removeTime(second).getTime()
      );
    }

    private static isDateLesser(first: Date, second: Date): boolean {
      return (
        MultiDateSelect.removeTime(first).getTime() < MultiDateSelect.removeTime(second).getTime()
      );
    }

    public open() {
      this._popup.open();
    }

    public close() {
      this._popup.close();
    }

    public toggle() {
      if (this._popup.visible()) {
        this.close();
      } else {
        this.open();
      }
    }

    public destroy() {
      this._multiSelect.wrapper.find('input').off('keydown');

      this._popup.destroy();
      this._multiSelect.destroy();
      this._multiCalendar.destroy();

      super.destroy();
    }

    public enable(enable: boolean) {
      if (!enable) {
        this.close();
      }

      this._multiSelect.enable(enable);
    }

    public readonly(readonly: boolean) {
      if (readonly) {
        this.close();
      }

      this._multiSelect.readonly(readonly);
    }

    public max(max?: Date): Date {
      if (max !== undefined) {
        this._multiCalendar.max(max);

        this.updateDateInterval();
      }

      return this._multiCalendar.max();
    }

    public min(min?: Date): Date {
      if (min !== undefined) {
        this._multiCalendar.min(min);

        this.updateDateInterval();
      }

      return this._multiCalendar.min();
    }

    public value(values?: Date[]): Date[] {
      return this.values(values);
    }

    public values(values?: Date[]): Date[] {
      if (values !== undefined) {
        const min = this.min();
        const max = this.max();

        const vs = values
          .filter(
            (date: Date) =>
              !(
                (min && MultiDateSelect.isDateLesser(date, min)) ||
                (max && MultiDateSelect.isDateGreater(date, max))
              )
          );

        this._multiCalendar.values(vs);
        this.updateMultiSelectValues(vs);

        if (vs.length) {
          this._multiCalendar.navigate(vs[vs.length - 1]);
        }
      }

      return this._multiSelect.value();
    }

    public multiSelect(): kendo.ui.MultiSelect {
      return this._multiSelect;
    }

    public multiCalendar(): MultiCalendar {
      return this._multiCalendar;
    }

    private initMultiSelect(parent: Element | JQuery | string) {
      const options = this.options;
      const defaultTemplate = ((data: Date) => kendo.toString(data, options.format));

      options.tagTemplate = options.tagTemplate || defaultTemplate;

      const open = (e: kendo.ui.MultiSelectOpenEvent) => {
        e.preventDefault();

        this.open();
      };

      const change = () => {
        this._multiCalendar.values(this._multiSelect.value());

        this._popup.position();

        this.trigger(MultiDateSelect.changeEvent);
      };

      this._multiSelect = $('<select multiple></select>')
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

      (this._multiSelect as any)._filterSource = () => ({});
      this._multiSelect.search = () => ({});

      this._multiSelect.wrapper.find('input').on('keydown', (e: JQueryKeyEventObject) => {
        const key = e.keyCode;
        const inputValue = (e.target as any).value;

        if (key === kendo.keys.ENTER) {
          const parsedDate = kendo.parseDate(inputValue, options.format);
          const values = this.values();

          if (parsedDate && parsedDate <= this.max() && parsedDate >= this.min()) {
            const dates = values.concat(parsedDate);

            this._multiCalendar.values(dates);
            this.updateMultiSelect();

            this._multiCalendar.navigate(parsedDate);

            this.trigger(MultiDateSelect.changeEvent);
          }
        }
      });
    }

    private initPopup(parent: Element | JQuery | string) {
      const open = () => this.trigger(MultiDateSelect.openEvent);
      const close = () => this.trigger(MultiDateSelect.closeEvent);

      this._popup = $('<div class="k-calendar-container"></div>')
        .appendTo(document.body)
        .kendoPopup({
          ...this.options.popup,
          ...{
            name: 'Popup',
            animation: this.options.animation,
            anchor: parent,
            open: open,
            close: close
          }
        })
        .data('kendoPopup');
    }

    private initCalendar(parent: Element | JQuery | string) {
      const options = this.options;

      const change = () => {
        this.updateMultiSelect();

        this.trigger(MultiDateSelect.changeEvent);
      };

      const navigate = () => this.trigger(MultiDateSelect.navigateEvent);

      this._multiCalendar = $('<div></div>')
        .appendTo(parent)
        .kendoMultiCalendar({
          values: options.values,
          footer: options.footer,
          culture: options.culture,
          min: options.min,
          max: options.max,
          start: options.start,
          depth: options.depth,
          month: options.month,
          dates: options.dates,
          maxSelectedItems: options.maxSelectedItems,
          cleanSelectedItemsOnTodayClick: options.cleanSelectedItemsOnTodayClick,
          change: change,
          navigate: navigate
        })
        .data('kendoMultiCalendar');

      (kendo as any).calendar.makeUnselectable(this._multiCalendar.element);
    }

    private updateDateInterval() {
      this.values(this.values());
    }

    private updateMultiSelectValues(values: Date[]) {
      this._multiSelect.setDataSource(values as any);
      this._multiSelect.value(values);

      if (this._popup.visible()) {
        this._popup.position();
      }
    }

    private updateMultiSelect() {
      this.updateMultiSelectValues(this._multiCalendar.values());

      if (this.options.autoClose) {
        this.close();
      }
    }
  }

  MultiDateSelect.fn = MultiDateSelect.prototype;
  MultiDateSelect.fn.options = {
    ...kendo.ui.Widget.fn.options,
    ...{
      name: 'MultiDateSelect',
      autoClose: true,
      popup: {},
      animation: {},
      enable: true,
      maxSelectedItems: null,
      cleanSelectedItemsOnTodayClick: true,
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
      month: {},
      dates: []
    }
  };
  MultiDateSelect.fn.events = [
    MultiDateSelect.navigateEvent,
    MultiDateSelect.changeEvent,
    MultiDateSelect.openEvent,
    MultiDateSelect.closeEvent
  ];

  kendo.ui.plugin(MultiDateSelect);
}

interface JQuery {
  kendoMultiDateSelect(options?: kendoExt.MultiDateSelectOptions): JQuery;
  data(key: 'kendoMultiDateSelect'): kendoExt.MultiDateSelect;
}
