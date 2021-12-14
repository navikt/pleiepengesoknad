import { IntlShape } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import {
    arbeidssituasjonStepIsValid,
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';
import { erAnsattISøknadsperiode } from './ansattUtils';
import { erFrilanserIPeriode } from './frilanserUtils';
import { getHistoriskPeriode, getPlanlagtPeriode } from './fortidFremtidUtils';

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        stepIndicatorLabel: intlHelper(intl, conf.stepIndicatorLabel),
        nextButtonLabel: conf.nextButtonLabel ? intlHelper(intl, conf.nextButtonLabel) : undefined,
        nextButtonAriaLabel: conf.nextButtonAriaLabel ? intlHelper(intl, conf.nextButtonAriaLabel) : undefined,
    };
};

export const opplysningerOmBarnetStepAvailable = (formData: SøknadFormData) => welcomingPageIsValid(formData);

export const opplysningerOmTidsromStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) && opplysningerOmBarnetStepIsValid(formData);

export const arbeidssituasjonStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData);

export const arbeidsforholdIPeriodeStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const omsorgstilbudStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const nattevåkOgBeredskapStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    omsorgstilbudStepAvailable(formData);

export const medlemskapStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const legeerklæringStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    medlemskapStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    medlemskapStepIsValid(formData) &&
    legeerklæringStepIsValid();

export const skalBrukerSvarePåBeredskapOgNattevåk = (formValues?: SøknadFormData): boolean => {
    const historiskOmsorgstilbud =
        formValues?.omsorgstilbud?.harBarnVærtIOmsorgstilbud === YesOrNo.YES &&
        formValues.omsorgstilbud.historisk !== undefined &&
        formValues.omsorgstilbud.historisk.enkeltdager !== undefined;

    const planlagtOmsorgstilbud =
        formValues?.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.YES &&
        formValues.omsorgstilbud.planlagt !== undefined;

    return (
        formValues !== undefined &&
        formValues.omsorgstilbud !== undefined &&
        (historiskOmsorgstilbud || planlagtOmsorgstilbud)
    );
};

export const skalBrukerSvarePåHistoriskArbeid = (
    søknadsperiode: DateRange,
    søknadsdato: Date,
    formValues?: SøknadFormData
): boolean => {
    if (!formValues) {
        return false;
    }
    const periode = getHistoriskPeriode(søknadsperiode, søknadsdato);
    return periode
        ? erAnsattISøknadsperiode(formValues.ansatt_arbeidsforhold) ||
              erFrilanserIPeriode(periode, formValues) ||
              formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES
        : false;
};

export const skalBrukerSvarePåPlanlagtArbeid = (
    søknadsperiode: DateRange,
    søknadsdato: Date,
    formValues?: SøknadFormData
): boolean => {
    if (!formValues) {
        return false;
    }
    const periode = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    return periode
        ? erAnsattISøknadsperiode(formValues.ansatt_arbeidsforhold) ||
              erFrilanserIPeriode(periode, formValues) ||
              formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES
        : false;
};
