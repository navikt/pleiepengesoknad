import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { visVernepliktSpørsmål } from '../../components/steps/arbeidssituasjon-step/ArbeidssituasjonStep';
import {
    ArbeidsforholdAnsatt,
    ArbeidsforholdSluttetNårSvar,
    PleiepengesøknadFormData,
} from '../../types/PleiepengesøknadFormData';

export const formDataMock: Partial<PleiepengesøknadFormData> = {
    ansatt_arbeidsforhold: [],
    frilans_harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    selvstendig_harHattInntektSomSN: YesOrNo.UNANSWERED,
};

const ansattArbeidsforhold: ArbeidsforholdAnsatt = {
    organisasjonsnummer: '123',
    navn: '123',
};

describe('visVernepliktSpørsmål', () => {
    describe('skjuler spørsmål om verneplikt dersom', () => {
        it('søker har ikke besvart spørsmål om arbeidsgivere, frilanser og selvstendig næringdrivende', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                ansatt_arbeidsforhold: [
                    {
                        ...ansattArbeidsforhold,
                        erAnsatt: YesOrNo.UNANSWERED,
                    },
                ],
                frilans_harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
                selvstendig_harHattInntektSomSN: YesOrNo.UNANSWERED,
            };
            expect(visVernepliktSpørsmål(data)).toBeFalsy();
        });
        it('søker er ansatt', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                ansatt_arbeidsforhold: [
                    {
                        ...ansattArbeidsforhold,
                        erAnsatt: YesOrNo.YES,
                    },
                ],
                frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                selvstendig_harHattInntektSomSN: YesOrNo.NO,
            };
            expect(visVernepliktSpørsmål(data)).toBeFalsy();
        });
        it('søker er ikke ansatt, men har ikke svart på sluttdato', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                ansatt_arbeidsforhold: [
                    {
                        ...ansattArbeidsforhold,
                        erAnsatt: YesOrNo.NO,
                    },
                ],
                frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                selvstendig_harHattInntektSomSN: YesOrNo.NO,
            };
            expect(visVernepliktSpørsmål(data)).toBeFalsy();
        });
        it('søker er ikke ansatt, men sluttet i perioden', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                ansatt_arbeidsforhold: [
                    {
                        ...ansattArbeidsforhold,
                        erAnsatt: YesOrNo.NO,
                        sluttetNår: ArbeidsforholdSluttetNårSvar.iSøknadsperiode,
                    },
                ],
                frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                selvstendig_harHattInntektSomSN: YesOrNo.NO,
            };
            expect(visVernepliktSpørsmål(data)).toBeFalsy();
        });
        it('søker er ikke ansatt, men sluttet i perioden', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                ansatt_arbeidsforhold: [
                    {
                        ...ansattArbeidsforhold,
                        erAnsatt: YesOrNo.NO,
                        sluttetNår: ArbeidsforholdSluttetNårSvar.iSøknadsperiode,
                    },
                ],
                frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                selvstendig_harHattInntektSomSN: YesOrNo.NO,
            };
            expect(visVernepliktSpørsmål(data)).toBeFalsy();
        });
        it('søker har ikke ansettesesforhold men er frilanser eller sn', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                selvstendig_harHattInntektSomSN: YesOrNo.NO,
            };
            expect(visVernepliktSpørsmål(data)).toBeFalsy();
        });
        it('søker er frilanser', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                frilans_harHattInntektSomFrilanser: YesOrNo.YES,
            };
            expect(visVernepliktSpørsmål(data)).toBeFalsy();
        });
        it('søker er selvstendig næringsdrivende', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                selvstendig_harHattInntektSomSN: YesOrNo.YES,
            };
            expect(visVernepliktSpørsmål(data)).toBeFalsy();
        });
    });
    describe('viser spørsmål om verneplikt dersom', () => {
        it('søker er ikke frilanser, er ikke selvstendig næringsdrivende, og har ingen arbeidsgivere', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                selvstendig_harHattInntektSomSN: YesOrNo.NO,
                frilans_harHattInntektSomFrilanser: YesOrNo.NO,
            } as PleiepengesøknadFormData;
            expect(visVernepliktSpørsmål(data)).toBeTruthy();
        });
        it('søker er ikke frilanser, er ikke selvstendig næringsdrivende, og har sluttet før søknadsperioden', () => {
            const data: Partial<PleiepengesøknadFormData> = {
                ...formDataMock,
                ansatt_arbeidsforhold: [
                    {
                        ...ansattArbeidsforhold,
                        erAnsatt: YesOrNo.NO,
                        sluttetNår: ArbeidsforholdSluttetNårSvar.førSøknadsperiode,
                    },
                ],
                selvstendig_harHattInntektSomSN: YesOrNo.NO,
                frilans_harHattInntektSomFrilanser: YesOrNo.NO,
            };
            expect(visVernepliktSpørsmål(data)).toBeTruthy();
        });
    });
});
