import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    getDatesInMonthOutsideDateRange,
    getNumberOfDaysInDateRange,
    getWeeksInDateRange,
} from '../common/dateRangeUtils';
import { dateToISODate, ISODateToDate } from '../common/isoDateUtils';

describe('dateRangeUtils', () => {
    describe('getWeeksInDateRange', () => {
        it('returnerer 1 når det perioden er innenfor én uke', () => {
            const dateRange: DateRange = {
                from: ISODateToDate('2021-01-04'),
                to: ISODateToDate('2021-01-10'),
            };
            const result = getWeeksInDateRange(dateRange);
            expect(getWeeksInDateRange(dateRange).length).toBe(1);
            expect(dateToISODate(result[0].from)).toEqual('2021-01-04');
            expect(dateToISODate(result[0].to)).toEqual('2021-01-10');
        });
        it('returnerer 2 når det daperioden er søndag til påfølgende søndag', () => {
            const dateRange: DateRange = {
                from: ISODateToDate('2021-01-03'),
                to: ISODateToDate('2021-01-10'),
            };
            const result = getWeeksInDateRange(dateRange);
            expect(getWeeksInDateRange(dateRange).length).toBe(2);
            expect(dateToISODate(result[0].from)).toEqual('2021-01-03');
            expect(dateToISODate(result[0].to)).toEqual('2021-01-03');
            expect(dateToISODate(result[1].from)).toEqual('2021-01-04');
            expect(dateToISODate(result[1].to)).toEqual('2021-01-10');
        });
        it('returnerer 3 når det perioden er søndag til påfølgende søndag', () => {
            const dateRange: DateRange = {
                from: ISODateToDate('2021-01-03'),
                to: ISODateToDate('2021-01-11'),
            };
            const result = getWeeksInDateRange(dateRange);
            expect(getWeeksInDateRange(dateRange).length).toBe(3);
            expect(dateToISODate(result[0].from)).toEqual('2021-01-03');
            expect(dateToISODate(result[0].to)).toEqual('2021-01-03');
            expect(dateToISODate(result[1].from)).toEqual('2021-01-04');
            expect(dateToISODate(result[1].to)).toEqual('2021-01-10');
            expect(dateToISODate(result[2].from)).toEqual('2021-01-11');
            expect(dateToISODate(result[2].to)).toEqual('2021-01-11');
        });
    });
    describe('getNumberOfDaysInDateRange', () => {
        describe('Når en teller med helgedager', () => {
            it('returnerer 1 når det er samme fra og til dato', () => {
                const result = getNumberOfDaysInDateRange({
                    from: ISODateToDate('2021-02-01'),
                    to: ISODateToDate('2021-02-01'),
                });
                expect(result).toBe(1);
            });
            it('returnerer 2 når til-dato er dagen etter fra-dato', () => {
                const result = getNumberOfDaysInDateRange({
                    from: ISODateToDate('2021-02-01'),
                    to: ISODateToDate('2021-02-02'),
                });
                expect(result).toBe(2);
            });
            it('returnerer 3 når til-dato er to dager etter fra-dato', () => {
                const result = getNumberOfDaysInDateRange({
                    from: ISODateToDate('2021-02-01'),
                    to: ISODateToDate('2021-02-03'),
                });
                expect(result).toBe(3);
            });
        });
        describe('når en ekskluderer helgedager', () => {
            it('returnerer 1 når det er fredag + helg', () => {
                const result = getNumberOfDaysInDateRange(
                    {
                        from: ISODateToDate('2021-02-05'),
                        to: ISODateToDate('2021-02-06'),
                    },
                    true
                );
                const result2 = getNumberOfDaysInDateRange(
                    {
                        from: ISODateToDate('2021-02-05'),
                        to: ISODateToDate('2021-02-07'),
                    },
                    true
                );
                expect(result).toBe(1);
                expect(result2).toBe(1);
            });
            it('returnerer 2 når det er fredag + helg + mandag', () => {
                const result = getNumberOfDaysInDateRange(
                    {
                        from: ISODateToDate('2021-02-05'),
                        to: ISODateToDate('2021-02-08'),
                    },
                    true
                );
                expect(result).toBe(2);
            });
        });
    });
    describe('getDatesInMonthOutsideDateRange', () => {
        it('returnerer alle dager i måned før fra-dato i periode', () => {
            const result = getDatesInMonthOutsideDateRange(ISODateToDate('2021-01-01'), {
                from: ISODateToDate('2021-01-04'),
                to: ISODateToDate('2021-01-31'),
            });
            expect(dateToISODate(result[0])).toEqual('2021-01-01');
            expect(dateToISODate(result[1])).toEqual('2021-01-02');
            expect(dateToISODate(result[2])).toEqual('2021-01-03');
        });
        it('returnerer alle dager i måned etter til-dato i periode', () => {
            const result = getDatesInMonthOutsideDateRange(ISODateToDate('2021-01-01'), {
                from: ISODateToDate('2021-01-01'),
                to: ISODateToDate('2021-01-28'),
            });
            expect(dateToISODate(result[0])).toEqual('2021-01-29');
            expect(dateToISODate(result[1])).toEqual('2021-01-30');
            expect(dateToISODate(result[2])).toEqual('2021-01-31');
        });
        it('returnerer alle dager i måned etter til-dato i periode når perioden er kun den første dagen i måneden', () => {
            const result = getDatesInMonthOutsideDateRange(ISODateToDate('2021-01-01'), {
                from: ISODateToDate('2021-01-01'),
                to: ISODateToDate('2021-01-01'),
            });
            expect(dateToISODate(result[0])).toEqual('2021-01-02');
        });
    });
});
