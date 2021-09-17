import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { visVernepliktSpørsmål } from '../../components/steps/arbeidsforhold-step/ArbeidsforholdStep';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

export const formDataMock: Partial<PleiepengesøknadFormData> = {
    arbeidsforhold: [],
    frilans_harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    selvstendig_harHattInntektSomSN: YesOrNo.UNANSWERED,
};

describe('visVernepliktSpørsmål', () => {
    describe('skjuler spørsmål om verneplikt dersom', () => {
        it('søker har ikke besvart spørsmål om arbeidsgivere, frilanser og selvstendig næringdrivende', () => {
            expect(
                visVernepliktSpørsmål({
                    ...formDataMock,
                    arbeidsforhold: [
                        {
                            erAnsatt: YesOrNo.UNANSWERED,
                        },
                    ],
                    frilans_harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
                    selvstendig_harHattInntektSomSN: YesOrNo.UNANSWERED,
                } as PleiepengesøknadFormData)
            ).toBeFalsy();
        });
        it('søker er ansatt', () => {
            expect(
                visVernepliktSpørsmål({
                    ...formDataMock,
                    arbeidsforhold: [
                        {
                            erAnsatt: YesOrNo.YES,
                        },
                    ],
                    frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                } as PleiepengesøknadFormData)
            ).toBeFalsy();
        });
        it('søker har ikke ansettesesforhold men er frilanser eller sn', () => {
            expect(
                visVernepliktSpørsmål({
                    ...formDataMock,
                    frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                } as PleiepengesøknadFormData)
            ).toBeFalsy();
        });
        it('søker er frilanser', () => {
            expect(
                visVernepliktSpørsmål({
                    ...formDataMock,
                    frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                } as PleiepengesøknadFormData)
            ).toBeFalsy();
        });
        it('søker er selvstendig næringsdrivende', () => {
            expect(
                visVernepliktSpørsmål({
                    ...formDataMock,
                    selvstendig_harHattInntektSomSN: YesOrNo.YES,
                } as PleiepengesøknadFormData)
            ).toBeFalsy();
        });
    });
    describe('viser spørsmål om verneplikt dersom', () => {
        const formData = {
            ...formDataMock,
            selvstendig_harHattInntektSomSN: YesOrNo.NO,
            frilans_harHattInntektSomFrilanser: YesOrNo.NO,
        } as PleiepengesøknadFormData;

        it('søker er ikke frilanser, er ikke selvstendig næringsdrivende, og har ingen arbeidsgivere', () => {
            expect(visVernepliktSpørsmål(formData)).toBeTruthy();
        });
        it('søker er ikke frilanser, er ikke selvstendig næringsdrivende, og har sluttet før søknadsperioden', () => {
            expect(
                visVernepliktSpørsmål({
                    ...formData,
                    arbeidsforhold: [
                        {
                            erAnsatt: YesOrNo.NO,
                        },
                    ],
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                    frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                } as PleiepengesøknadFormData)
            ).toBeTruthy();
        });
    });
});
