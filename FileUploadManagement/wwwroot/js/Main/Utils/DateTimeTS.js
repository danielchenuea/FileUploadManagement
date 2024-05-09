const DaysOnMonth = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
};
const DaysOnMonthLeap = {
    1: 31,
    2: 29,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
};
export default class DateTimeTS {
    constructor(...args) {
        this.mainDate = new Date();
        this.minDate = new Date(0);
        this.maxDate = new Date("9999-12-31T23:59+0000");
        switch (args.length) {
            case 0:
                this.mainDate = this.minDate;
                break;
            case 1:
                if (args[0] instanceof Date) {
                    this.mainDate = args[0];
                }
                if (typeof args[0] === "string") {
                    this.mainDate = new Date(Date.parse(args[0]));
                }
                break;
            case 3:
                const year3 = args[0];
                const month3 = args[1];
                const day3 = args[2];
                if (year3 >= 0 && year3 <= 9999 &&
                    month3 >= 1 && month3 <= 12 &&
                    day3 >= 0 &&
                    (day3 <= DaysOnMonth[month3]) ||
                    (day3 <= DaysOnMonthLeap[month3]))
                    this.mainDate = new Date(year3, month3, day3);
                break;
            case 6:
                const year6 = args[0];
                const month6 = args[1];
                const day6 = args[2];
                const hour6 = args[3];
                const minute6 = args[4];
                const second6 = args[5];
                if (year6 >= 0 && year6 <= 9999 &&
                    month6 >= 1 && month6 <= 12 &&
                    day6 >= 0 &&
                    (day6 <= DaysOnMonth[month6]) ||
                    (day6 <= DaysOnMonthLeap[month6]) &&
                        hour6 >= 0 && hour6 <= 24 &&
                        minute6 >= 0 && minute6 <= 59 &&
                        second6 >= 0 && second6 <= 59)
                    this.mainDate = new Date(year6, month6, day6, hour6, minute6, second6);
                break;
        }
        return this;
    }
    SetDateNow() {
        this.mainDate = new Date(Date.now());
        return this;
    }
    SetDate(date) {
        this.mainDate = date;
    }
    SetYear(year) {
        this.mainDate.setFullYear(year);
        return this;
    }
    SetMonth(month) {
        this.mainDate.setMonth(month);
        return this;
    }
    SetDay(day) {
        this.mainDate.setDate(day);
        return this;
    }
    SetHour(hour) {
        this.mainDate.setHours(hour);
        return this;
    }
    SetMinute(minute) {
        this.mainDate.setMinutes(minute);
        return this;
    }
    SetSecond(second) {
        this.mainDate.setSeconds(second);
        return this;
    }
    SetTime(time) {
        return this.mainDate.setTime(time);
    }
    GetYear() {
        return this.mainDate.getFullYear();
    }
    GetMonth() {
        return this.mainDate.getMonth();
    }
    GetDay() {
        return this.mainDate.getDate();
    }
    GetHour() {
        return this.mainDate.getHours();
    }
    GetMinute() {
        return this.mainDate.getMinutes();
    }
    GetSecond() {
        return this.mainDate.getSeconds();
    }
    GetTime() {
        return this.mainDate.getTime();
    }
    AddNewDate(oldDate, opt) {
        const newDate = new Date(oldDate.getTime());
        if (opt.year)
            newDate.setFullYear(newDate.getFullYear() + opt.year);
        if (opt.month)
            newDate.setMonth(newDate.getMonth() + opt.month);
        if (opt.day)
            newDate.setDate(newDate.getDate() + opt.day);
        if (opt.hour)
            newDate.setHours(newDate.getHours() + opt.hour);
        if (opt.minute)
            newDate.setMinutes(newDate.getMinutes() + opt.minute);
        if (opt.second)
            newDate.setSeconds(newDate.getSeconds() + opt.second);
        return newDate;
    }
    AddYears(years) {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { year: years }));
    }
    AddMonths(months) {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { month: months }));
    }
    AddDays(days) {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { day: days }));
    }
    AddHours(hours) {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { hour: hours }));
    }
    AddMinutes(minutes) {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { minute: minutes }));
    }
    AddSeconds(seconds) {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { second: seconds }));
    }
    static Compare(date1, date2) {
        const convertToNumber = (d) => {
            if (d instanceof Date)
                return d.getTime();
            if (d instanceof DateTimeTS)
                return d.GetTime();
            if (typeof d === "string")
                return Date.parse(d);
            return 0;
        };
        const dateNumber1 = convertToNumber(date1);
        const dateNumber2 = convertToNumber(date2);
        if (dateNumber1 == dateNumber2)
            return 0;
        if (dateNumber1 > dateNumber2)
            return 1;
        else
            return -1;
    }
    CompareTo(date) {
        return DateTimeTS.Compare(this.mainDate, date);
    }
    ToDateInput() {
        return this.ToDateTemplate("YYYY-MM-DD");
    }
    ToUTCString() {
        return this.mainDate.toUTCString();
    }
    ToDateTemplate(templateStr) {
        const fullYear = this.GetYear().toString();
        const shortYear = this.GetYear().toString().slice(2);
        const month = (this.GetMonth() + 1).toString().padStart(2, "0");
        const day = this.GetDay().toString().padStart(2, "0");
        const hour = this.GetHour().toString().padStart(2, "0");
        const minute = this.GetMinute().toString().padStart(2, "0");
        const second = this.GetSecond().toString().padStart(2, "0");
        return templateStr
            .replace("YYYY", fullYear)
            .replace("YY", shortYear)
            .replace("MM", month)
            .replace("DD", day)
            .replace("hh", hour)
            .replace("mm", minute)
            .replace("ss", second);
    }
    DaysInMonth() {
        if (this.IsLeapYear()) {
            return DaysOnMonth[(this.GetMonth() + 1)];
        }
        else {
            return DaysOnMonthLeap[(this.GetMonth() + 1)];
        }
    }
    IsLeapYear() {
        const year = this.mainDate.getFullYear();
        return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0));
    }
}
