import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { visVernepliktSpørsmål } from '../visVernepliktSpørsmål';
import { ArbeidsgiverType } from '../../../../types/Arbeidsgiver';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilanserMedOppdragFormValues,
} from '../../../../types/ArbeidsforholdFormValues';
import { FrilanserOppdragIPeriodenApi } from 'app/types/søknad-api-data/frilansOppdragApiData';

const defaultAnsattArbeidsforhold: ArbeidsforholdFormValues = {
    arbeidsgiver: {
        id: '123',
        navn: 'abc',
        type: ArbeidsgiverType.ORGANISASJON,
    },
    normalarbeidstid: {},
};

const defaultFrilansArbeidsforhold: ArbeidsforholdFrilanserMedOppdragFormValues = {
    arbeidsgiver: {
        id: '12345',
        navn: 'abc',
        type: ArbeidsgiverType.FRILANSOPPDRAG,
    },
    normalarbeidstid: {},
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
            const frilansoppdrag = [defaultFrilansArbeidsforhold];
            const nyfrilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues[] = [];
            const selvstendig__harHattInntektSomSN = YesOrNo.UNANSWERED;
            const result = visVernepliktSpørsmål({
                ansatt_arbeidsforhold,
                frilansoppdrag,
                nyfrilansoppdrag,
                selvstendig: {
                    harHattInntektSomSN: selvstendig__harHattInntektSomSN,
                },
            });
            expect(result).toBeFalsy();
        });
        it('søker er ansatt', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [{ ...defaultAnsattArbeidsforhold, erAnsatt: YesOrNo.YES }],
                    frilansoppdrag: [],
                    nyfrilansoppdrag: [],
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.NO,
                    },
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
                    frilansoppdrag: [],
                    nyfrilansoppdrag: [],
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.NO,
                    },
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
                    frilansoppdrag: [],
                    nyfrilansoppdrag: [],
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.NO,
                    },
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
                    frilansoppdrag: [],
                    nyfrilansoppdrag: [],
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.NO,
                    },
                })
            ).toBeFalsy();
        });
        it('søker har ikke ansettesesforhold men er frilanser eller sn', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [],
                    frilansoppdrag: [
                        { ...defaultFrilansArbeidsforhold, frilansOppdragIPerioden: FrilanserOppdragIPeriodenApi.JA },
                    ],
                    nyfrilansoppdrag: [],
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.NO,
                    },
                })
            ).toBeFalsy();
        });
        it('søker er frilanser', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [],
                    frilansoppdrag: [
                        { ...defaultFrilansArbeidsforhold, frilansOppdragIPerioden: FrilanserOppdragIPeriodenApi.JA },
                    ],
                    nyfrilansoppdrag: [],
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.UNANSWERED,
                    },
                })
            ).toBeFalsy();
        });
        it('søker er selvstendig næringsdrivende', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [],
                    frilansoppdrag: [],
                    nyfrilansoppdrag: [],
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.YES,
                    },
                })
            ).toBeFalsy();
        });
    });
    describe('viser spørsmål om verneplikt dersom', () => {
        it('søker er ikke frilanser, er ikke selvstendig næringsdrivende, og har ingen arbeidsgivere', () => {
            expect(
                visVernepliktSpørsmål({
                    ansatt_arbeidsforhold: [],
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.NO,
                    },
                    frilansoppdrag: [],
                    nyfrilansoppdrag: [],
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
                    selvstendig: {
                        harHattInntektSomSN: YesOrNo.NO,
                    },
                    frilansoppdrag: [],
                    nyfrilansoppdrag: [],
                })
            ).toBeTruthy();
        });
    });
});
