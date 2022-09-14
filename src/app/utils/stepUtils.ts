import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { StepID } from '../søknad/søknadStepsConfig';
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

export const isStepAvailable = (formValues: SøknadFormValues, stepID: StepID) => {
    switch (stepID) {
        case StepID.OPPLYSNINGER_OM_BARNET:
            return welcomingPageIsValid(formValues);
        case StepID.TIDSROM:
            return welcomingPageIsValid(formValues) && opplysningerOmBarnetStepIsValid(formValues);
        case StepID.ARBEIDSSITUASJON:
            return (
                welcomingPageIsValid(formValues) &&
                opplysningerOmBarnetStepIsValid(formValues) &&
                opplysningerOmTidsromStepIsValid(formValues)
            );
        case StepID.ARBEIDSTID:
            return (
                welcomingPageIsValid(formValues) &&
                opplysningerOmBarnetStepIsValid(formValues) &&
                opplysningerOmTidsromStepIsValid(formValues) &&
                arbeidssituasjonStepIsValid()
            );
        case StepID.OMSORGSTILBUD:
            return (
                welcomingPageIsValid(formValues) &&
                opplysningerOmBarnetStepIsValid(formValues) &&
                opplysningerOmTidsromStepIsValid(formValues) &&
                arbeidssituasjonStepIsValid()
            );
        case StepID.NATTEVÅK_OG_BEREDSKAP:
            return (
                welcomingPageIsValid(formValues) &&
                opplysningerOmBarnetStepIsValid(formValues) &&
                opplysningerOmTidsromStepIsValid(formValues) &&
                arbeidssituasjonStepIsValid()
            );
        case StepID.MEDLEMSKAP:
            return (
                welcomingPageIsValid(formValues) &&
                opplysningerOmBarnetStepIsValid(formValues) &&
                opplysningerOmTidsromStepIsValid(formValues) &&
                arbeidssituasjonStepIsValid()
            );
        case StepID.LEGEERKLÆRING:
            return (
                welcomingPageIsValid(formValues) &&
                opplysningerOmBarnetStepIsValid(formValues) &&
                opplysningerOmTidsromStepIsValid(formValues) &&
                arbeidssituasjonStepIsValid() &&
                medlemskapStepIsValid(formValues)
            );
        case StepID.SUMMARY:
            return (
                welcomingPageIsValid(formValues) &&
                opplysningerOmBarnetStepIsValid(formValues) &&
                opplysningerOmTidsromStepIsValid(formValues) &&
                arbeidssituasjonStepIsValid() &&
                medlemskapStepIsValid(formValues) &&
                legeerklæringStepIsValid()
            );
    }
};

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
