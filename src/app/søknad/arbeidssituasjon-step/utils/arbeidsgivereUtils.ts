import { FormikProps } from 'formik';
import { Arbeidsgiver, ArbeidsgiverType } from '../../../types';
import { Arbeidsforhold } from '../../../types/Arbeidsforhold';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import appSentryLogger from '../../../utils/appSentryLogger';

const erOrganisasjonElerPrivatArbeidsgiver = (a: Arbeidsgiver) =>
    a.type === ArbeidsgiverType.ORGANISASJON || a.type === ArbeidsgiverType.PRIVATPERSON;

const erFrilansoppdrag = (a: Arbeidsgiver) => a.type === ArbeidsgiverType.FRILANSOPPDRAG;

/**
 * Oppdaterer arbeidsforhold-liste i søknad når arbeideidsgivere for søknadsperiode
 * hentes på nytt. Fjerner arbeidsforhold som ikke har arbeidsgiver; f.eks. nårsøknadsperiode
 * endres og arbeidsgiver ikke eksisterer i den perioden. Oppretter nytt arbeidsforhold
 * dersom det er funnet en ny arbeidsgiver som allerede ikke var et arbeidsforhold.
 *
 * @param arbeidsgivere Arbeidsgivere hentet over api
 * @param arbeidsforhold Arbeidsforhold i søknaden
 * @returns Arbeidsforhold for @arbeidsgivere
 */
export const syncAnsattArbeidsforhold = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: Arbeidsforhold[] = []
): Array<Arbeidsforhold> => {
    const syncedArbeidsforhold: Arbeidsforhold[] = [];
    arbeidsgivere.forEach((arbeidsgiver) => {
        const forhold = arbeidsforhold.find((f) => f.arbeidsgiver.id === arbeidsgiver.id);
        if (!arbeidsgiver.navn) {
            appSentryLogger.logError(
                'Get arbeidsgiver: Manglende navn på organisasjon',
                `${JSON.stringify(arbeidsgiver)}`
            );
        }
        syncedArbeidsforhold.push({
            arbeidsgiver,
            ...forhold,
        });
    });
    return syncedArbeidsforhold;
};

/**
 * Oppdaterer SøknadFormData med nye arbeidsforhold etter at en har hentet
 * arbeidsgivere i søknadsperiode
 *
 * @param arbeidsgivere Arbeidsgivere i søknadsperioden
 * @param formikProps FormikProps for søknad
 */
export const oppdaterSøknadMedArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    { values, setFieldValue }: FormikProps<SøknadFormData>
) => {
    const ansattArbeidsforhold = syncAnsattArbeidsforhold(
        arbeidsgivere.filter(erOrganisasjonElerPrivatArbeidsgiver),
        values.ansatt_arbeidsforhold
    );
    setFieldValue(SøknadFormField.ansatt_arbeidsforhold, ansattArbeidsforhold);

    const frilansoppdrag = arbeidsgivere.filter(erFrilansoppdrag);
    setFieldValue(SøknadFormField.frilansoppdrag, frilansoppdrag);
};
