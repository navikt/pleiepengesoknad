import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { skalSpørreOmOmsorgstilbudPerMåned, MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA } from '../omsorgstilbudUtils';

const sameMonthDateRangeShort: DateRange = {
    from: new Date(2021, 5, 1),
    to: new Date(2021, 5, 6),
};
const sameMonthDateRange: DateRange = {
    from: new Date(2021, 5, 1),
    to: new Date(2021, 5, 15),
};
const twoMonthsDateRange: DateRange = {
    from: new Date(2021, 5, 1),
    to: new Date(2021, 6, 1),
};

describe('omsorgstilbudUtils', () => {
    describe('skalSpørreOmOmsorgstilbudPerMåned', () => {
        it('returns false when all days are within same month and less than 6 days', () => {
            expect(skalSpørreOmOmsorgstilbudPerMåned(sameMonthDateRangeShort)).toBeFalsy();
        });
        it(`returns false when all days are below ${MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA}`, () => {
            expect(
                skalSpørreOmOmsorgstilbudPerMåned({
                    ...sameMonthDateRange,
                    to: dayjs(sameMonthDateRange.from).add(MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA, 'days').toDate(),
                })
            ).toBeFalsy();
        });
        it(`returns true when number of days are more than  ${MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA}`, () => {
            expect(
                skalSpørreOmOmsorgstilbudPerMåned({
                    ...sameMonthDateRange,
                    to: dayjs(sameMonthDateRange.from)
                        .add(MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA + 1, 'days')
                        .toDate(),
                })
            ).toBeTruthy();
        });
        it(`returns true if days spans more than one month`, () => {
            expect(skalSpørreOmOmsorgstilbudPerMåned(twoMonthsDateRange)).toBeTruthy();
        });
    });
});
