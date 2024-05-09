/* eslint-disable no-case-declarations */

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

type Mapped<
    N extends number,
    Result extends Array<number> = [],
> =
    (Result['length'] extends N
        ? Result[number]
        : Mapped<N, [...Result, Result['length']]>
    )
type IntRange<F extends number, T extends number> = Exclude<Mapped<T>, Mapped<F>>

type MonthType = IntRange<1,13> // 1.. 12;

interface NewDateOptions {
    year?: number
    month?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
}

/**
 * Classe manipuladora de Data. Baseado no DateTime do C#.
 * Essa classe tenta replicar algumas funcionalidades da classe análoga do C#, como adicionar tempo e retornar novas classes.
 * - Feito por DCHEN
 */
export default class DateTimeTS {

    mainDate: Date = new Date();
    minDate: Date = new Date(0);
    maxDate: Date = new Date("9999-12-31T23:59+0000");
    
    constructor()
    constructor(date: string);
    constructor(date: Date);
    constructor(year: number, month: number, day: number);
    constructor(year: number, month: number, day: number, hour: number, minute: number, second: number);
    constructor(...args: (string | number | Date)[]) {
        switch (args.length) {
            case 0:
                this.mainDate = this.minDate;
                break;
            case 1:
                if (args[0] instanceof Date) {
                    this.mainDate = args[0];
                }
                if (typeof args[0] === "string") {
                    //const utcRegex = new RegExp("\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+|)(?:Z|(?:\+|\-)(?:\d{2}):?(?:\d{2}))");
                    //const date = <string>args[0];
                    //if (utcRegex.test(date)) {
                    //};
                    this.mainDate = new Date(Date.parse(args[0]));
                }
                break;
            case 3:
                const year3 = <number>args[0];
                const month3 = <MonthType>args[1];
                const day3 = <number>args[2];
                if (
                    year3 >= 0 && year3 <= 9999 &&
                    month3 >= 1 && month3 <= 12 &&
                    day3 >= 0 &&
                    (day3 <= DaysOnMonth[month3]) ||
                    (day3 <= DaysOnMonthLeap[month3])
                )
                    this.mainDate = new Date(year3, month3, day3);
                break;
            case 6:
                const year6 = <number>args[0];
                const month6 = <MonthType>args[1];
                const day6 = <number>args[2];
                const hour6 = <number>args[3];
                const minute6 = <MonthType>args[4];
                const second6 = <number>args[5];
                if (
                    year6 >= 0 && year6 <= 9999 &&
                    month6 >= 1 && month6 <= 12 &&
                    day6 >= 0 &&
                    (day6 <= DaysOnMonth[month6]) ||
                    (day6 <= DaysOnMonthLeap[month6]) &&
                    hour6 >= 0 && hour6 <= 24 &&
                    minute6 >= 0 && minute6 <= 59 &&
                    second6 >= 0 && second6 <= 59
                )
                    this.mainDate = new Date(year6, month6, day6, hour6, minute6, second6);
                break;
        }
        return this;
    }

    SetDateNow() {
        this.mainDate = new Date(Date.now())
        return this;
    }

    SetDate(date: Date) {
        this.mainDate = date;
    }

    SetYear(year: number) {
        this.mainDate.setFullYear(year);
        return this;
    }
    SetMonth(month: number) {
        this.mainDate.setMonth(month);
        return this;
    }
    SetDay(day: number) {
        this.mainDate.setDate(day);
        return this;
    }
    SetHour(hour: number) {
        this.mainDate.setHours(hour);
        return this;
    }
    SetMinute(minute: number) {
        this.mainDate.setMinutes(minute);
        return this;
    }
    SetSecond(second: number) {
        this.mainDate.setSeconds(second);
        return this;
    }
    SetTime(time: number): number {
        return this.mainDate.setTime(time);
    }

    /**
     * Função que retorna o Ano da Data.
     * @returns Ano da Data. YYYY
     */
    GetYear(): number {
        return this.mainDate.getFullYear();
    }
    /**
     * Função que retorna o Mês da Data.
     * @returns Mês da Data. 0-11
     */
    GetMonth(): number {
        return this.mainDate.getMonth();
    }
    /**
     * Função que retorna o Dia da Data.
     * @returns Dia da Data 1-31
     */
    GetDay(): number {
        return this.mainDate.getDate();
    }
    /**
     * Função que retorna a Hora da Data.
     * @returns Hora da Data 0-23
     */
    GetHour(): number {
        return this.mainDate.getHours();
    }
    /**
     * Função que retorna o Minuto da Data.
     * @returns Minuto da Data 0-59
     */
    GetMinute(): number {
        return this.mainDate.getMinutes();
    }
    /**
     * Função que retorna os Segundos da Data.
     * @returns Segundos da Data 0-59
     */
    GetSecond(): number {
        return this.mainDate.getSeconds();
    }
    /**
     * Função que retorna o Tempo, que é o número utilizado para determina a Data.
     * @returns Número que determina a Data (Tempo em milisegundos desde 01/01/1970 00:00:00)
     */
    GetTime(): number {
        return this.mainDate.getTime();
    }

    /**
     * Função Privada que cria retorna um novo Date. 
     * Utilizado para retornar um novo DateTimeTS quando um tempo for adicionado com Add.
     * @param oldDate - Data Antiga/Atual base que será adicionada tempo.
     * @param opt - Opções de data a serem adicionadas.
     * @returns Novo Date
     */
    private AddNewDate(oldDate: Date, opt: NewDateOptions): Date {
        const newDate = new Date(oldDate.getTime());

        if (opt.year) newDate.setFullYear(newDate.getFullYear() + opt.year);
        if (opt.month) newDate.setMonth(newDate.getMonth() + opt.month);
        if (opt.day) newDate.setDate(newDate.getDate() + opt.day);
        if (opt.hour) newDate.setHours(newDate.getHours() + opt.hour);
        if (opt.minute) newDate.setMinutes(newDate.getMinutes() + opt.minute);
        if (opt.second) newDate.setSeconds(newDate.getSeconds() + opt.second);

        return newDate;
    }

    /**
     * Função que adiciona X anos à data relacionada. Essa função cria e retorna um novo DateTimeTS.
     * @param years - Deslocamento em Anos.
     * @returns DateTimeTS
     */
    AddYears(years: number): DateTimeTS {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { year: years }));
    }

    /**
     * Função que adiciona X meses à data relacionada. Essa função cria e retorna um novo DateTimeTS.
     * @param months - Deslocamento em Meses.
     * @returns DateTimeTS
     */
    AddMonths(months: number): DateTimeTS {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { month: months }));
    }

    /**
     * Função que adiciona X dias à data relacionada. Essa função cria e retorna um novo DateTimeTS.
     * @param days - Deslocamento em Dias.
     * @returns DateTimeTS
     */
    AddDays(days: number): DateTimeTS {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { day: days }));
    }

    /**
     * Função que adiciona X horas à data relacionada. Essa função cria e retorna um novo DateTimeTS.
     * @param hours - Deslocamento em Horas.
     * @returns DateTimeTS
     */
    AddHours(hours: number): DateTimeTS {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { hour: hours }));
    }

    /**
     * Função que adiciona X minutos à data relacionada. Essa função cria e retorna um novo DateTimeTS.
     * @param minutes - Deslocamento em Minutos.
     * @returns DateTimeTS
     */
    AddMinutes(minutes: number): DateTimeTS {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { minute: minutes }));
    }

    /**
     * Função que adiciona X segundos à data relacionada. Essa função cria e retorna um novo DateTimeTS.
     * @param seconds - Deslocamento em Segundos.
     * @returns DateTimeTS
     */
    AddSeconds(seconds: number): DateTimeTS {
        return new DateTimeTS(this.AddNewDate(this.mainDate, { second: seconds }));
    }

    static Compare(date1: Date | DateTimeTS | string, date2: Date | DateTimeTS | string ): number {
        const convertToNumber = (d: Date | DateTimeTS | string): number => {
            if (d instanceof Date) return d.getTime();
            if (d instanceof DateTimeTS) return d.GetTime();
            if (typeof d === "string") return Date.parse(d);
            return 0;
        }
        const dateNumber1: number = convertToNumber(date1);
        const dateNumber2: number = convertToNumber(date2);

        if (dateNumber1 == dateNumber2) return 0;
        if (dateNumber1 > dateNumber2) return 1;
        else return -1;
    }

    CompareTo(date: Date | DateTimeTS): number {
        return DateTimeTS.Compare(this.mainDate, date);
    }

    ToDateInput(): string {
        return this.ToDateTemplate("YYYY-MM-DD");
    }

    ToUTCString(): string {
        return this.mainDate.toUTCString();
    }

    ToDateTemplate(templateStr: string): string {
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

    DaysInMonth(): number {
        if (this.IsLeapYear()) {
            return DaysOnMonth[<MonthType>(this.GetMonth() + 1)];
        } else {
            return DaysOnMonthLeap[<MonthType>(this.GetMonth() + 1)];
        }
    }
    IsLeapYear(): boolean {
        const year = this.mainDate.getFullYear();
        return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
    }
}