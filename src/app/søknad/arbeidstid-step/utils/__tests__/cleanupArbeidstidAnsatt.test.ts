import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ISODateToDate } from '@navikt/sif-common-utils';
import { cleanupArbeidstidAnsatt } from '../cleanupArbeidstidStep';

const periodeFromDateString = '2021-02-01';
const periodeToDateString = '2021-02-12';

const periode: DateRange = {
    from: ISODateToDate(periodeFromDateString),
    to: ISODateToDate(periodeToDateString),
};

describe('cleanupArbeidstidAnsatt', () => {
    it('går gjennom og cleaner alle arbeidsforhold', () => {
        const mockArbeidsforhold = [{}, {}, {}] as any;
        const result = cleanupArbeidstidAnsatt(mockArbeidsforhold, periode);
        expect(Object.keys(result).length).toBe(3);
    });
});
