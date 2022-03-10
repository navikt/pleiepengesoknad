import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { visVernepliktSpørsmål } from '../visVernepliktSpørsmål';
import { ArbeidsgiverType } from '../../../../types/Arbeidsgiver';
import { Arbeidsforhold } from '../../../../types/Arbeidsforhold';

const defaultAnsattArbeidsforhold: Arbeidsforhold = {
    arbeidsgiver: {
        id: '123',
        navn: 'abc',
        type: ArbeidsgiverType.ORGANISASJON,
    },
};

describe('visVernepliktSpørsmål', () => {
    describe('skjuler spørsmål om verneplikt dersom', () => {
        it('søker har ikke besvart spørsmål om arbeidsgivere, frilanser og selvstendig næringdrivende', () => {
            const ansatt_arbeidsforhold = [
                {
                    ...defaultAnsattArbeidsforhold,
                    erAnsatt: YesOrNo.UNANSWERED,
                },
            ];
            const frilans = { harHattInntektSomFrilanser: YesOrNo.UNANSWERED };
            const selvstendig_harHattInntektSomSN = YesOrNo.UNANSWERED;
            const result = visVernepliktSpørsmål({
                ansatt_arbeidsforhold,
                frilans,
                selvstendig_harHattInntektSomSN,
            });
            expect(result).toBeFalsy();
        });
        it('søker er ansatt', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [{ ...defaultAnsattArbeidsforhold, erAnsatt: YesOrNo.YES }],
                    frilans: { harHattInntektSomFrilanser: YesOrNo.NO },
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                })
            ).toBeFalsy();
        });
        it('søker er ikke ansatt, men har ikke svart på sluttdato', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [
                        {
                            ...defaultAnsattArbeidsforhold,
                            erAnsatt: YesOrNo.NO,
                        },
                    ],
                    frilans: { harHattInntektSomFrilanser: YesOrNo.NO },
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                })
            ).toBeFalsy();
        });
        it('søker er ikke ansatt, men sluttet i perioden', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [
                        {
                            ...defaultAnsattArbeidsforhold,
                            erAnsatt: YesOrNo.NO,
                            sluttetFørSøknadsperiode: YesOrNo.NO,
                        },
                    ],
                    frilans: { harHattInntektSomFrilanser: YesOrNo.NO },
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                })
            ).toBeFalsy();
        });
        it('søker er ikke ansatt, men sluttet i perioden', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [
                        {
                            ...defaultAnsattArbeidsforhold,
                            erAnsatt: YesOrNo.NO,
                            sluttetFørSøknadsperiode: YesOrNo.NO,
                        },
                    ],
                    frilans: { harHattInntektSomFrilanser: YesOrNo.NO },
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                })
            ).toBeFalsy();
        });
        it('søker har ikke ansettesesforhold men er frilanser eller sn', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [],
                    frilans: { harHattInntektSomFrilanser: YesOrNo.YES },
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                })
            ).toBeFalsy();
        });
        it('søker er frilanser', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [],
                    frilans: { harHattInntektSomFrilanser: YesOrNo.YES },
                    selvstendig_harHattInntektSomSN: YesOrNo.UNANSWERED,
                })
            ).toBeFalsy();
        });
        it('søker er selvstendig næringsdrivende', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [],
                    frilans: { harHattInntektSomFrilanser: YesOrNo.NO },
                    selvstendig_harHattInntektSomSN: YesOrNo.YES,
                })
            ).toBeFalsy();
        });
    });
    describe('viser spørsmål om verneplikt dersom', () => {
        it('søker er ikke frilanser, er ikke selvstendig næringsdrivende, og har ingen arbeidsgivere', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [],
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                    frilans: {
                        harHattInntektSomFrilanser: YesOrNo.NO,
                    },
                })
            ).toBeTruthy();
        });
        it('søker er ikke frilanser, er ikke selvstendig næringsdrivende, og har sluttet før søknadsperioden', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [
                        {
                            ...defaultAnsattArbeidsforhold,
                            erAnsatt: YesOrNo.NO,
                            sluttetFørSøknadsperiode: YesOrNo.YES,
                        },
                    ],
                    selvstendig_harHattInntektSomSN: YesOrNo.NO,
                    frilans: { harHattInntektSomFrilanser: YesOrNo.NO },
                })
            ).toBeTruthy();
        });
    });
});
