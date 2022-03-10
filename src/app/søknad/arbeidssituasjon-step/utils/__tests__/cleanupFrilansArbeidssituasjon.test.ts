import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver, ArbeidsgiverType, JobberIPeriodeSvar } from '../../../../types';
import { FrilansFormData } from '../../../../types/FrilansFormData';
import { cleanupFrilansArbeidssituasjon } from '../cleanupArbeidssituasjonStep';

const søknadsperiode = ISODateRangeToDateRange('2021-01-02/2022-01-01');

const frilanserSluttetIPeriodeValues: FrilansFormData = {
    harHattInntektSomFrilanser: YesOrNo.YES,
    arbeidsforhold: {
        harFraværIPeriode: YesOrNo.NO,
        jobberNormaltTimer: '10',
        arbeidIPeriode: {
            jobberIPerioden: JobberIPeriodeSvar.JA,
        },
    },
    jobberFortsattSomFrilans: YesOrNo.NO,
    startdato: '2021-02-02',
    sluttdato: '2021-10-02',
};

const frilansoppdrag: Arbeidsgiver[] = [
    {
        type: ArbeidsgiverType.FRILANSOPPDRAG,
        id: '123',
        navn: 'Teest',
    },
];

describe('cleanupFrilansArbeidssituasjon', () => {
    describe('når bruker har frilansoppdrag', () => {
        it('beholder riktig informasjon når bruker har frilansoppdrag i søknadsperiode', () => {
            const result = cleanupFrilansArbeidssituasjon(
                søknadsperiode,
                {
                    ...frilanserSluttetIPeriodeValues,
                    jobberFortsattSomFrilans: YesOrNo.YES,
                },
                frilansoppdrag
            );
            expect(result.harHattInntektSomFrilanser).toBeUndefined();
            expect(result.jobberFortsattSomFrilans).toBeDefined();
            expect(result.arbeidsforhold).toBeDefined();
            expect(result.arbeidsforhold?.arbeidIPeriode).toBeDefined();
            expect(result.arbeidsforhold?.harFraværIPeriode).toBeDefined();
            expect(result.arbeidsforhold?.jobberNormaltTimer).toBeDefined();
            expect(result.startdato).toBeDefined();
            expect(result.sluttdato).toBeUndefined();
        });
        it('beholder riktig informasjon når bruker slutter som frilanser i søknadsperiode', () => {
            const result = cleanupFrilansArbeidssituasjon(
                søknadsperiode,
                {
                    ...frilanserSluttetIPeriodeValues,
                    harHattInntektSomFrilanser: YesOrNo.YES,
                    jobberFortsattSomFrilans: YesOrNo.NO,
                },
                frilansoppdrag
            );
            expect(result.harHattInntektSomFrilanser).toBeUndefined();
            expect(result.jobberFortsattSomFrilans).toBeDefined();
            expect(result.arbeidsforhold).toBeDefined();
            expect(result.arbeidsforhold?.arbeidIPeriode).toBeDefined();
            expect(result.arbeidsforhold?.harFraværIPeriode).toBeDefined();
            expect(result.arbeidsforhold?.jobberNormaltTimer).toBeDefined();
            expect(result.startdato).toBeDefined();
            expect(result.sluttdato).toBeDefined();
        });
        it('beholder riktig informasjon når bruker sluttet før søknadsperiode', () => {
            const result = cleanupFrilansArbeidssituasjon(
                søknadsperiode,
                {
                    ...frilanserSluttetIPeriodeValues,
                    harHattInntektSomFrilanser: YesOrNo.YES,
                    jobberFortsattSomFrilans: YesOrNo.NO,
                    sluttdato: '2021-01-01',
                },
                frilansoppdrag
            );
            expect(result.harHattInntektSomFrilanser).toBeUndefined();
            expect(result.jobberFortsattSomFrilans).toBeDefined();
            expect(result.arbeidsforhold).toBeUndefined();
            expect(result.startdato).toBeDefined();
            expect(result.sluttdato).toBeDefined();
        });
    });

    describe('når bruker ikke har frilansoppdrag', () => {
        it('fjerner alle unødvendig data når bruker ikke er frilanser', () => {
            const result = cleanupFrilansArbeidssituasjon(
                søknadsperiode,
                { ...frilanserSluttetIPeriodeValues, harHattInntektSomFrilanser: YesOrNo.NO },
                []
            );
            expect(result.harHattInntektSomFrilanser).toBeDefined();
            expect(result.jobberFortsattSomFrilans).toBeUndefined();
            expect(result.arbeidsforhold).toBeUndefined();
            expect(result.startdato).toBeUndefined();
            expect(result.sluttdato).toBeUndefined();
        });
        it('beholder riktig informasjon når bruker er frilanser i søknadsperiode', () => {
            const result = cleanupFrilansArbeidssituasjon(
                søknadsperiode,
                {
                    ...frilanserSluttetIPeriodeValues,
                    harHattInntektSomFrilanser: YesOrNo.YES,
                    jobberFortsattSomFrilans: YesOrNo.YES,
                },
                []
            );
            expect(result.harHattInntektSomFrilanser).toBeDefined();
            expect(result.jobberFortsattSomFrilans).toBeDefined();
            expect(result.arbeidsforhold).toBeDefined();
            expect(result.arbeidsforhold?.arbeidIPeriode).toBeDefined();
            expect(result.arbeidsforhold?.harFraværIPeriode).toBeDefined();
            expect(result.arbeidsforhold?.jobberNormaltTimer).toBeDefined();
            expect(result.startdato).toBeDefined();
            expect(result.sluttdato).toBeUndefined();
        });
        it('beholder riktig informasjon når bruker slutter som frilanser i søknadsperiode', () => {
            const result = cleanupFrilansArbeidssituasjon(
                søknadsperiode,
                {
                    ...frilanserSluttetIPeriodeValues,
                    harHattInntektSomFrilanser: YesOrNo.YES,
                    jobberFortsattSomFrilans: YesOrNo.NO,
                },
                []
            );
            expect(result.harHattInntektSomFrilanser).toBeDefined();
            expect(result.jobberFortsattSomFrilans).toBeDefined();
            expect(result.arbeidsforhold).toBeDefined();
            expect(result.arbeidsforhold?.arbeidIPeriode).toBeDefined();
            expect(result.arbeidsforhold?.harFraværIPeriode).toBeDefined();
            expect(result.arbeidsforhold?.jobberNormaltTimer).toBeDefined();
            expect(result.startdato).toBeDefined();
            expect(result.sluttdato).toBeDefined();
        });
        it('beholder riktig informasjon når bruker sluttet før søknadsperiode', () => {
            const result = cleanupFrilansArbeidssituasjon(
                søknadsperiode,
                {
                    ...frilanserSluttetIPeriodeValues,
                    harHattInntektSomFrilanser: YesOrNo.YES,
                    jobberFortsattSomFrilans: YesOrNo.NO,
                    sluttdato: '2021-01-01',
                },
                []
            );
            expect(result.harHattInntektSomFrilanser).toBeDefined();
            expect(result.jobberFortsattSomFrilans).toBeDefined();
            expect(result.arbeidsforhold).toBeUndefined();
            expect(result.startdato).toBeDefined();
            expect(result.sluttdato).toBeDefined();
        });
    });
});
