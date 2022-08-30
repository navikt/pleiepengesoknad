import { IntlShape } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormValues } from '../types/SøknadFormValues';
import {
    arbeidssituasjonStepIsValid,
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';
import { erAnsattISøknadsperiode } from './ansattUtils';
import { erFrilanserISøknadsperiode } from './frilanserUtils';

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

export const opplysningerOmBarnetStepAvailable = (formData: SøknadFormValues) => welcomingPageIsValid(formData);

export const opplysningerOmTidsromStepAvailable = (formData: SøknadFormValues) =>
    welcomingPageIsValid(formData) && opplysningerOmBarnetStepIsValid(formData);

export const arbeidssituasjonStepAvailable = (formData: SøknadFormValues) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData);

export const arbeidIPeriodeStepIsAvailable = (formData: SøknadFormValues) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const omsorgstilbudStepAvailable = (formData: SøknadFormValues) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const nattevåkOgBeredskapStepAvailable = (formData: SøknadFormValues) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    omsorgstilbudStepAvailable(formData);

export const medlemskapStepAvailable = (formData: SøknadFormValues) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const legeerklæringStepAvailable = (formData: SøknadFormValues) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    medlemskapStepIsValid(formData);

export const oppsummeringStepAvailable = (formData: SøknadFormValues) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    medlemskapStepIsValid(formData) &&
    legeerklæringStepIsValid();

export const skalBrukerSvarePåBeredskapOgNattevåk = (formValues?: SøknadFormValues): boolean => {
    return (
        formValues !== undefined &&
        formValues.omsorgstilbud !== undefined &&
        formValues.omsorgstilbud.erIOmsorgstilbud === YesOrNo.YES
    );
};

export const skalBrukerSvareArbeidstid = (søknadsperiode: DateRange, formValues: SøknadFormValues): boolean => {
    if (!formValues) {
        return false;
    }
    const erAnsatt = erAnsattISøknadsperiode(formValues.ansatt_arbeidsforhold);
    const erFrilanser = erFrilanserISøknadsperiode(søknadsperiode, formValues.frilans, formValues.frilansoppdrag);
    const erSelvstendig = formValues.selvstendig.harHattInntektSomSN === YesOrNo.YES;

    return erAnsatt || erFrilanser || erSelvstendig;
};
