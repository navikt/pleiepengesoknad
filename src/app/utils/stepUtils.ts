import { IntlShape } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../config/stepConfig';
import { VetOmsorgstilbud } from '../types';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import {
    arbeidssituasjonStepIsValid,
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';
import { erAnsattIPeriode } from './ansattUtils';
import { erFrilanserIPeriode } from './frilanserUtils';
import { getHistoriskPeriode, getPlanlagtPeriode } from './tidsbrukUtils';

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

export const opplysningerOmBarnetStepAvailable = (formData: PleiepengesøknadFormData) => welcomingPageIsValid(formData);

export const opplysningerOmTidsromStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) && opplysningerOmBarnetStepIsValid(formData);

export const arbeidssituasjonStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData);

export const arbeidsforholdIPeriodeStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const omsorgstilbudStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const nattevåkOgBeredskapStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    omsorgstilbudStepAvailable(formData);

export const medlemskapStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const legeerklæringStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    medlemskapStepIsValid(formData);

export const summaryStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    medlemskapStepIsValid(formData) &&
    legeerklæringStepIsValid();

export const skalBrukerSvarePåBeredskapOgNattevåk = (formValues?: PleiepengesøknadFormData): boolean => {
    const historiskOmsorgstilbud =
        formValues?.omsorgstilbud?.harBarnVærtIOmsorgstilbud === YesOrNo.YES &&
        formValues.omsorgstilbud.historisk !== undefined &&
        formValues.omsorgstilbud.historisk.enkeltdager !== undefined;

    const planlagtOmsorgstilbud =
        formValues?.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.YES &&
        formValues.omsorgstilbud.planlagt !== undefined &&
        formValues.omsorgstilbud.planlagt.vetHvorMyeTid === VetOmsorgstilbud.VET_ALLE_TIMER;

    return (
        formValues !== undefined &&
        formValues.omsorgstilbud !== undefined &&
        (historiskOmsorgstilbud || planlagtOmsorgstilbud)
    );
};

export const skalBrukerSvarePåHistoriskArbeid = (
    søknadsperiode: DateRange,
    formValues?: PleiepengesøknadFormData
): boolean => {
    if (!formValues) {
        return false;
    }
    const periode = getHistoriskPeriode(søknadsperiode, dateToday);
    return periode
        ? erAnsattIPeriode(periode, formValues.ansatt_arbeidsforhold) ||
              erFrilanserIPeriode(periode, formValues) ||
              formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES
        : false;
};

export const skalBrukerSvarePåPlanlagtArbeid = (
    søknadsperiode: DateRange,
    formValues?: PleiepengesøknadFormData
): boolean => {
    if (!formValues) {
        return false;
    }
    const periode = getPlanlagtPeriode(søknadsperiode, dateToday);
    return periode
        ? erAnsattIPeriode(periode, formValues.ansatt_arbeidsforhold) ||
              erFrilanserIPeriode(periode, formValues) ||
              formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES
        : false;
};
