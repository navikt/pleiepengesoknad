import { DateRange } from '@navikt/sif-common-formik/lib';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { extractArbeidsgivereArbeidsforholdSøknadsdata } from './extractArbeidsgivereArbeidsforholdSøknadsdata';
import { extractArbeidFrilansSøknadsdata } from './extractArbeidFrilansSøknadsdata';
import { extractArbeidSelvstendigSøknadsdata } from './extractArbeidSelvstendigSøknadsdata';
import { extractOpptjeningUtlandSøknadsdata } from './extractOpptjeningUtlandSøknadsdata';
import { extractUtenlandskNæringSøknadsdata } from './extractUtenlandskNæringSøknadsdata';

export const extractArbeidSøknadsdata = (
    values: SøknadFormData,
    søknadsperiode: DateRange
): ArbeidSøknadsdata | undefined => {
    const arbeidsgivere = extractArbeidsgivereArbeidsforholdSøknadsdata(values.ansatt_arbeidsforhold, søknadsperiode);
    const frilans = extractArbeidFrilansSøknadsdata(values.frilans, values.frilansoppdrag, søknadsperiode);
    const selvstendig = extractArbeidSelvstendigSøknadsdata(values.selvstendig, søknadsperiode);
    const opptjeningUtland = extractOpptjeningUtlandSøknadsdata(values);
    const utenlandskNæring = extractUtenlandskNæringSøknadsdata(values);

    if (!arbeidsgivere && !frilans && !selvstendig) {
        return undefined;
    }
    return {
        arbeidsgivere,
        frilans,
        selvstendig,
        opptjeningUtland,
        utenlandskNæring,
    };
};
