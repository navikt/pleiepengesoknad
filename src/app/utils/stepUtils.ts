import { IntlShape } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
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
import { skalBrukerOppgiArbeidstidSomFrilanser } from './frilanserUtils';
import { erSNISøknadsperiode } from './selvstendigUtils';

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

export const arbeidIPeriodeStepIsAvailable = (formData: SøknadFormData) =>
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

export const oppsummeringStepAvailable = (formData: SøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    medlemskapStepIsValid(formData) &&
    legeerklæringStepIsValid();

export const skalBrukerSvarePåBeredskapOgNattevåk = (formValues?: SøknadFormData): boolean => {
    return (
        formValues !== undefined &&
        formValues.omsorgstilbud !== undefined &&
        (formValues.omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.YES ||
            formValues.omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.YES)
    );
};

export const skalBrukerSvarePåArbeidstid = (søknadsperiode: DateRange, formValues: SøknadFormData): boolean => {
    if (!formValues) {
        return false;
    }
    const erAnsatt = erAnsattISøknadsperiode(formValues.ansatt_arbeidsforhold);
    const erFrilanser = skalBrukerOppgiArbeidstidSomFrilanser(formValues.frilans);
    const erSelvstendig = erSNISøknadsperiode(søknadsperiode, formValues.selvstendig);

    return erAnsatt || erFrilanser || erSelvstendig;
};
