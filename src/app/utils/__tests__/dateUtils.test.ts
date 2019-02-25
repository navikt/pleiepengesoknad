import { date3YearsAgo, formatDate, isMoreThan3YearsAgo, prettifyDate } from '../dateUtils';
const moment = require('moment');

const mockedDate = moment('20111031', 'YYYYMMDD').toDate();

describe('dateUtils', () => {
    describe('formatDate', () => {
        it('should format provided date on correct format for API', () => {
            expect(formatDate(mockedDate)).toEqual('2011-10-31');
        });
    });

    describe('prettifyDate', () => {
        it('should format provided date in a readable format', () => {
            expect(prettifyDate(mockedDate)).toEqual('31.10.2011');
        });
    });

    describe('isMoreThan3YearsAgo', () => {
        it('should return true if date is more than 3 years back in time', () => {
            const dateMoreThan3YearsAgo = date3YearsAgo.clone();
            dateMoreThan3YearsAgo.subtract(1, 'day');
            expect(isMoreThan3YearsAgo(dateMoreThan3YearsAgo.toDate())).toBe(true);
        });

        it('should return false if date is less or equal to date 3 years ago ', () => {
            expect(isMoreThan3YearsAgo(date3YearsAgo)).toBe(false);
            expect(isMoreThan3YearsAgo(moment().toDate())).toBe(false);
        });
    });
});
