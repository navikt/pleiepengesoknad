import { DateRange } from '@navikt/sif-common-formik/lib';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsgivereArbeidsforholdSøknadsdata } from './extractArbeidsgivereArbeidsforholdSøknadsdata';
import { extractArbeidFrilansSøknadsdata } from './extractArbeidFrilansSøknadsdata';
import { extractArbeidSelvstendigSøknadsdata } from './extractArbeidSelvstendigSøknadsdata';

export const extractArbeidSøknadsdata = (
    values: SøknadFormData,
    søknadsperiode: DateRange
): ArbeidSøknadsdata | undefined => {
    const arbeidsgivere = extractArbeidsgivereArbeidsforholdSøknadsdata(values.ansatt_arbeidsforhold, søknadsperiode);
    const frilans = extractArbeidFrilansSøknadsdata(values.frilans, values.frilansoppdrag, søknadsperiode);
    const selvstendig = extractArbeidSelvstendigSøknadsdata(values.selvstendig, søknadsperiode);

    if (!arbeidsgivere && !frilans && !selvstendig) {
        return undefined;
    }
    return {
        arbeidsgivere,
        frilans,
        selvstendig,
    };
};
