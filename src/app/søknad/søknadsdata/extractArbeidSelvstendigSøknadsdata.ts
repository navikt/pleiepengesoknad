import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { SelvstendigFormData } from '../../types/SelvstendigFormData';
import { ArbeidSelvstendigSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidSelvstendigSøknadsdata = (
    selvstendig: SelvstendigFormData | undefined,
    søknadsperiode: DateRange
): ArbeidSelvstendigSøknadsdata | undefined => {
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
