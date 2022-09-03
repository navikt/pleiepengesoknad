import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { extractMedlemsskapFormValues } from '../extractMedlemsskapFormValues';

describe('extractMedlemsskapFormValues', () => {
    it('returnerer korrekt når det ikke har vært eller skal være noen utenlandsopphold', () => {
        const result = extractMedlemsskapFormValues({
            harBoddIUtlandetSiste12Mnd: false,
            skalBoIUtlandetNeste12Mnd: false,
            utenlandsoppholdNeste12Mnd: [],
            utenlandsoppholdSiste12Mnd: [],
        });
        expect(result.harBoddUtenforNorgeSiste12Mnd).toEqual(YesOrNo.NO);
        expect(result.skalBoUtenforNorgeNeste12Mnd).toEqual(YesOrNo.NO);
    });
    it('returnerer korrekt når det har vært utenlandsopphold siste 12 måneder', () => {
        const result = extractMedlemsskapFormValues({
            harBoddIUtlandetSiste12Mnd: true,
            skalBoIUtlandetNeste12Mnd: false,
            utenlandsoppholdSiste12Mnd: [
                { fraOgMed: '2020-01-01', tilOgMed: '2020-01-02', landkode: 'SWE', landnavn: 'Sverige' },
            ],
            utenlandsoppholdNeste12Mnd: [],
        });
        expect(result.harBoddUtenforNorgeSiste12Mnd).toEqual(YesOrNo.YES);
        expect(result.skalBoUtenforNorgeNeste12Mnd).toEqual(YesOrNo.NO);
        expect(dateToISODate(result.utenlandsoppholdSiste12Mnd[0].fom)).toEqual('2020-01-01');
        expect(dateToISODate(result.utenlandsoppholdSiste12Mnd[0].tom)).toEqual('2020-01-02');
        expect(result.utenlandsoppholdSiste12Mnd[0].landkode).toEqual('SWE');
        expect(result.utenlandsoppholdNeste12Mnd).toHaveLength(0);
    });
    it('returnerer korrekt når det skal være utenlandsopphold neste 12 måneder', () => {
        const result = extractMedlemsskapFormValues({
            harBoddIUtlandetSiste12Mnd: false,
            skalBoIUtlandetNeste12Mnd: true,
            utenlandsoppholdNeste12Mnd: [
                { fraOgMed: '2020-01-01', tilOgMed: '2020-01-02', landkode: 'SWE', landnavn: 'Sverige' },
            ],
            utenlandsoppholdSiste12Mnd: [],
        });
        expect(result.harBoddUtenforNorgeSiste12Mnd).toEqual(YesOrNo.NO);
        expect(result.skalBoUtenforNorgeNeste12Mnd).toEqual(YesOrNo.YES);
        expect(result.utenlandsoppholdNeste12Mnd).toHaveLength(1);
        expect(dateToISODate(result.utenlandsoppholdNeste12Mnd[0].fom)).toEqual('2020-01-01');
        expect(dateToISODate(result.utenlandsoppholdNeste12Mnd[0].tom)).toEqual('2020-01-02');
        expect(result.utenlandsoppholdNeste12Mnd[0].landkode).toEqual('SWE');
        expect(result.utenlandsoppholdSiste12Mnd).toHaveLength(0);
    });
});
