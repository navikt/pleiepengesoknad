import { DateRange } from '@navikt/sif-common-formik/lib';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidssituasjonSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsgivereArbeidsforholdSøknadsdata } from './extractArbeidsgivereArbeidsforholdSøknadsdata';
import { extractArbeidssituasjonFrilansSøknadsdata } from './extractArbeidssituasjonFrilansSøknadsdata';
import { extractArbeidssituasjonSelvstendigSøknadsdata } from './extractArbeidssituasjonSelvstendigSøknadsdata';

export const extractArbeidssituasjonSøknadsdata = (
    values: SøknadFormData,
    søknadsperiode: DateRange
): ArbeidssituasjonSøknadsdata | undefined => {
    if (values) {
        return {
            arbeidsgivere: extractArbeidsgivereArbeidsforholdSøknadsdata(values),
            frilans: extractArbeidssituasjonFrilansSøknadsdata(values, søknadsperiode),
            selvstendig: extractArbeidssituasjonSelvstendigSøknadsdata(values, søknadsperiode),
        };
    }
    return undefined;
};
