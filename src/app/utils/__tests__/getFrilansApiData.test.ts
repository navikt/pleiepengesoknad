import { FrilansFormDataPart, Arbeidsgiver, ArbeidsgiverType } from './../../types/SøknadFormData';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { getFrilansApiData } from '../formToApiMaps/getFrilansApiData';

const frilansoppdrag: Arbeidsgiver[] = [
    {
        type: ArbeidsgiverType.FRILANSOPPDRAG,
        id: '123',
        navn: 'Teest',
    },
];

describe('getFrilansApiData', () => {
    const søknadsperiode: DateRange = ISODateRangeToDateRange('2021-01-01/2021-02-01');

    describe('når en ikke er frilanser i søknadsperioden', () => {
        const expectedResult = JSON.stringify({
            _harHattInntektSomFrilanser: false,
        });
        it('nå bruker svarer nei på om en er frilanser', () => {
            const result = getFrilansApiData(
                {
                    harHattInntektSomFrilanser: YesOrNo.NO,
                },
                søknadsperiode,
                frilansoppdrag
            );
            expect(JSON.stringify(result)).toEqual(expectedResult);
        });
        it('ikke er frilanser i perioden det søkes for', () => {
            const result = getFrilansApiData(
                {
                    harHattInntektSomFrilanser: YesOrNo.YES,
                    startdato: '2021-02-02',
                    sluttdato: '2021-03-02',
                },
                søknadsperiode,
                frilansoppdrag
            );
            expect(JSON.stringify(result)).toEqual(expectedResult);
        });
    });
    describe('når en er frilanser', () => {
        const formData: FrilansFormDataPart = {
            harHattInntektSomFrilanser: YesOrNo.YES,
            startdato: '2021-01-01',
            jobberFortsattSomFrilans: YesOrNo.YES,
        };
        it('returnerer riktig data når en er frilanser i perioden, og fortsatt er frilanser', () => {
            const result = getFrilansApiData(
                {
                    ...formData,
                },
                søknadsperiode,
                frilansoppdrag
            );
            expect(result._harHattInntektSomFrilanser).toBeTruthy();
            expect(result.frilans).toBeDefined();
            expect(result.frilans?.startdato).toBeDefined();
            expect(result.frilans?.jobberFortsattSomFrilans).toBeTruthy();
            expect(result.frilans?.sluttdato).toBeUndefined();
        });
        it('returnerer riktig data når en er frilanser i perioden, men har sluttet som frilanser', () => {
            const result = getFrilansApiData(
                {
                    ...formData,
                    jobberFortsattSomFrilans: YesOrNo.NO,
                    sluttdato: '2021-01-15',
                },
                søknadsperiode,
                frilansoppdrag
            );
            expect(result._harHattInntektSomFrilanser).toBeTruthy();
            expect(result.frilans).toBeDefined();
            expect(result.frilans?.startdato).toBeDefined();
            expect(result.frilans?.jobberFortsattSomFrilans).toBeFalsy();
            expect(result.frilans?.sluttdato).toBeDefined();
        });
    });
});
