import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidssituasjonSelvstendigSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidssituasjonSelvstendigSøknadsdata = (
    formData: SøknadFormData,
    søknadsperiode: DateRange
): ArbeidssituasjonSelvstendigSøknadsdata | undefined => {
    const { selvstendig } = formData;
    if (!selvstendig) {
        return undefined;
    }
    const arbeidsforhold = extractArbeidsforholdSøknadsdata(selvstendig.arbeidsforhold);
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
