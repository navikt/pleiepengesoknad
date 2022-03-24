import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidSelvstendigSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidSelvstendigSøknadsdata = (
    formData: SøknadFormData,
    søknadsperiode: DateRange
): ArbeidSelvstendigSøknadsdata | undefined => {
    const { selvstendig } = formData;
    if (!selvstendig) {
        return undefined;
    }
    const arbeidsforhold = selvstendig.arbeidsforhold
        ? extractArbeidsforholdSøknadsdata(selvstendig.arbeidsforhold, søknadsperiode)
        : undefined;

    const virksomhet = selvstendig.virksomhet;

    if (!arbeidsforhold || !virksomhet || dayjs(virksomhet.fom).isAfter(søknadsperiode.to, 'day')) {
        return undefined;
    }

    return {
        arbeidsforhold,
        virksomhet,
        startdato: virksomhet.fom,
    };
};
