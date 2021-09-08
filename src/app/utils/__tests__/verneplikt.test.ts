import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { visVernepliktSpørsmål } from '../../components/steps/arbeidsforholdStep/ArbeidsforholdStep';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

const periodeStart = new Date(2020, 0, 2);
const periodeSlutt = new Date(2020, 1, 2);
const datoIPeriode = new Date(2020, 0, 5);
const datoFørPeriode = new Date(2020, 0, 1);

const søknadsperiode: DateRange = { from: periodeStart, to: periodeSlutt };

export const formDataMock: Partial<PleiepengesøknadFormData> = {
    arbeidsforhold: [],
    frilans_harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    selvstendig_harHattInntektSomSN: YesOrNo.UNANSWERED,
};

describe('visVernepliktSpørsmål', () => {
    describe('skjuler spørsmål om verneplikt dersom', () => {
        it('ikke har besvart spørsmål om arbeidsgivere, frilanser og selvstendig næringdrivende', () => {
            expect(
                visVernepliktSpørsmål(
                    {
                        ...formDataMock,
                        arbeidsforhold: [
                            {
                                erAnsatt: YesOrNo.UNANSWERED,
                            },
                        ],
                        frilans_harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
                        selvstendig_harHattInntektSomSN: YesOrNo.UNANSWERED,
                    } as PleiepengesøknadFormData,
                    søknadsperiode
                )
            ).toBeFalsy();
        });
        it('søker har ansettesesforhold i hele søknadsperioden', () => {
            expect(
                visVernepliktSpørsmål(
                    {
                        ...formDataMock,
                        arbeidsforhold: [
                            {
                                erAnsatt: YesOrNo.YES,
                            },
                        ],
                        frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                        selvstendig_harHattInntektSomSN: YesOrNo.NO,
                    } as PleiepengesøknadFormData,
                    søknadsperiode
                )
            ).toBeFalsy();
        });
        it('søker har ansettesesforhold i deler av søknadsperioden', () => {
            expect(
                visVernepliktSpørsmål(
                    {
                        ...formDataMock,
                        arbeidsforhold: [
                            {
                                erAnsatt: YesOrNo.NO,
                                sluttdato: datepickerUtils.getDateStringFromValue(datoIPeriode),
                            },
                        ],
                        frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                        selvstendig_harHattInntektSomSN: YesOrNo.NO,
                    } as PleiepengesøknadFormData,
                    søknadsperiode
                )
            ).toBeFalsy();
        });
        it('søker har ikke ansettesesforhold i hele eller deler av søknadsperioden men er frilanser eller sn', () => {
            expect(
                visVernepliktSpørsmål(
                    {
                        ...formDataMock,
                        frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                        selvstendig_harHattInntektSomSN: YesOrNo.NO,
                    } as PleiepengesøknadFormData,
                    søknadsperiode
                )
            ).toBeFalsy();
        });
        it('søker er frilanser', () => {
            expect(
                visVernepliktSpørsmål(
                    { ...formDataMock, frilans_harHattInntektSomFrilanser: YesOrNo.YES } as PleiepengesøknadFormData,
                    søknadsperiode
                )
            ).toBeFalsy();
        });
        it('søker er selvstendig næringsdrivende', () => {
            expect(
                visVernepliktSpørsmål(
                    { ...formDataMock, selvstendig_harHattInntektSomSN: YesOrNo.YES } as PleiepengesøknadFormData,
                    søknadsperiode
                )
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
            expect(visVernepliktSpørsmål(formData, søknadsperiode)).toBeTruthy();
        });
        it('søker er ikke frilanser, er ikke selvstendig næringsdrivende, og har sluttet før søknadsperioden', () => {
            expect(
                visVernepliktSpørsmål(
                    {
                        ...formData,
                        arbeidsforhold: [
                            {
                                erAnsatt: YesOrNo.NO,
                                sluttdato: datepickerUtils.getDateStringFromValue(datoFørPeriode),
                            },
                        ],
                        selvstendig_harHattInntektSomSN: YesOrNo.NO,
                        frilans_harHattInntektSomFrilanser: YesOrNo.NO,
                    } as PleiepengesøknadFormData,
                    søknadsperiode
                )
            ).toBeTruthy();
        });
    });
});
