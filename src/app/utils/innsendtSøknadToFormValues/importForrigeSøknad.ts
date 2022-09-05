import { RegistrerteBarn } from '../../types';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { initialValues, SøknadFormValues } from '../../types/SøknadFormValues';
import { extractArbeidFormValues } from './extractArbeidFormValues';
import { extractBarnFormValues } from './extractBarnFormValues';
import { extractMedlemsskapFormValues } from './extractMedlemsskapFormValues';
import { extractNattevåkOgBeredskapFormValues } from './extractNattevåkOgBeredskapFormValues';
import { extractOmsorgstilbudFormValues } from './extractOmsorgtilbudFormValues';
import { extractTidsromFormValues } from './extractTidsromFormValues';

export enum ForrigeSøknadImportEndringType {
    'endretBostedUtland' = 'endretBostedUtland',
}

export type ForrigeSøknadImportEndring = {
    type: ForrigeSøknadImportEndringType;
};

export const importForrigeSøknad = (
    søknad: InnsendtSøknadInnhold,
    registrerteBarn: RegistrerteBarn[]
): { endringer: ForrigeSøknadImportEndring[]; formValues: SøknadFormValues } | undefined => {
    if (registrerteBarn.length === 0) {
        return undefined;
    }
    try {
        const barnFormValues = extractBarnFormValues(søknad.barn, registrerteBarn);
        if (!barnFormValues) {
            return undefined;
        }

        const medlemsskap = extractMedlemsskapFormValues(søknad.medlemskap);

        const formValues: SøknadFormValues = {
            ...initialValues,
            harForståttRettigheterOgPlikter: true,
            harBekreftetOpplysninger: false,
            ...barnFormValues,
            ...extractTidsromFormValues(søknad),
            ...extractArbeidFormValues(søknad),
            ...extractOmsorgstilbudFormValues(søknad),
            ...extractNattevåkOgBeredskapFormValues(søknad),
            ...medlemsskap.formValues,
        };
        return { formValues, endringer: [...medlemsskap.endringer] };
    } catch (e) {
        console.error(`getFormValuesFromInnsendtSøknad feilet: ${e}`);
        return undefined;
    }
};
