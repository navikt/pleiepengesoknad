import { RegistrerteBarn } from '../../types';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { initialValues, SøknadFormValues } from '../../types/SøknadFormValues';
import { extractArbeidFormValues } from './extractArbeidFormValues';
import { extractBarnFormValues } from './extractBarnFormValues';
import { extractMedlemsskapFormValues } from './extractMedlemsskapFormValues';
import { extractNattevåkOgBeredskapFormValues } from './extractNattevåkOgBeredskapFormValues';
import { extractOmsorgstilbudFormValues } from './extractOmsorgtilbudFormValues';
import { extractTidsromFormValues } from './extractTidsromFormValues';

export const getFormValuesFromInnsendtSøknad = (
    søknad: InnsendtSøknadInnhold,
    registrerteBarn: RegistrerteBarn[]
): SøknadFormValues | undefined => {
    if (registrerteBarn.length === 0) {
        return undefined;
    }
    const barnFormValues = extractBarnFormValues(søknad.barn, registrerteBarn);
    if (!barnFormValues) {
        return undefined;
    }

    const formValues: SøknadFormValues = {
        ...initialValues,
        harForståttRettigheterOgPlikter: true,
        harBekreftetOpplysninger: false,
        ...barnFormValues,
        ...extractTidsromFormValues(søknad),
        ...extractArbeidFormValues(søknad),
        ...extractOmsorgstilbudFormValues(søknad),
        ...extractNattevåkOgBeredskapFormValues(søknad),
        ...extractMedlemsskapFormValues(søknad.medlemskap),
    };
    return formValues;
};
