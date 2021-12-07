import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getWeeksInDateRange } from '../common/dateRangeUtils';
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
});
