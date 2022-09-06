import { RegistrerteBarn } from '../../types';
import { SøknadsimportEndring } from '../../types/ImportertSøknad';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { initialValues, SøknadFormValues } from '../../types/SøknadFormValues';
import { extractArbeidFormValues } from './extractArbeidFormValues';
import { findRegistrertBarnISøknad } from './findRegistrertBarnISøknad';
import { extractMedlemsskapFormValues } from './extractMedlemsskapFormValues';
import { extractNattevåkOgBeredskapFormValues } from './extractNattevåkOgBeredskapFormValues';
import { extractOmsorgstilbudFormValues } from './extractOmsorgtilbudFormValues';
import { extractTidsromFormValues } from './extractTidsromFormValues';

export const importerSøknad = (
    søknad: InnsendtSøknadInnhold,
    registrerteBarn: RegistrerteBarn[]
): { endringer: SøknadsimportEndring[]; formValues: SøknadFormValues; registrertBarn: RegistrerteBarn } | undefined => {
    if (registrerteBarn.length === 0) {
        return undefined;
    }
    try {
        const barnISøknad = findRegistrertBarnISøknad(søknad.barn, registrerteBarn);
        if (!barnISøknad) {
            return undefined;
        }

        const medlemsskap = extractMedlemsskapFormValues(søknad.medlemskap);

        const formValues: SøknadFormValues = {
            ...initialValues,
            harForståttRettigheterOgPlikter: true,
            harBekreftetOpplysninger: false,
            barnetSøknadenGjelder: barnISøknad.aktørId,
            ...extractTidsromFormValues(søknad),
            ...extractArbeidFormValues(søknad),
            ...extractOmsorgstilbudFormValues(søknad),
            ...extractNattevåkOgBeredskapFormValues(søknad),
            ...medlemsskap.formValues,
        };
        return { formValues, endringer: [...medlemsskap.endringer], registrertBarn: barnISøknad };
    } catch (e) {
        console.error(`getFormValuesFromInnsendtSøknad feilet: ${e}`);
        return undefined;
    }
};
