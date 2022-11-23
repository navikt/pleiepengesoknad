import { DateRange } from '@navikt/sif-common-formik/lib';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { ArbeidSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { extractArbeidsgivereArbeidsforholdSøknadsdata } from './extractArbeidsgivereArbeidsforholdSøknadsdata';
import { extractArbeidSelvstendigSøknadsdata } from './extractArbeidSelvstendigSøknadsdata';
import { extractOpptjeningUtlandSøknadsdata } from './extractOpptjeningUtlandSøknadsdata';
import { extractUtenlandskNæringSøknadsdata } from './extractUtenlandskNæringSøknadsdata';
import { extractFrilansOppdragArbeidsforholdSøknadsdata } from './extractFrilansOppdragArbeidsforholdSøknadsdat';
import { extractNyFrilansArbeidsforholdSøknadsdata } from './extractNyFrilansArbeidsforholdSøknadsdata';

export const extractArbeidSøknadsdata = (
    values: SøknadFormValues,
    søknadsperiode: DateRange
): ArbeidSøknadsdata | undefined => {
    const arbeidsgivere = extractArbeidsgivereArbeidsforholdSøknadsdata(values.ansatt_arbeidsforhold);
    const registrerteFrilansoppdrag = extractFrilansOppdragArbeidsforholdSøknadsdata(
        values.frilansoppdrag,
        søknadsperiode
    );
    const nyttFrilansoppdrag = extractNyFrilansArbeidsforholdSøknadsdata(
        values.nyttFrilansoppdrag,
        values.erFrilanserIPeriode,
        søknadsperiode
    );
    const selvstendig = extractArbeidSelvstendigSøknadsdata(values.selvstendig, søknadsperiode);
    const opptjeningUtland = extractOpptjeningUtlandSøknadsdata(values);
    const utenlandskNæring = extractUtenlandskNæringSøknadsdata(values);

    if (!arbeidsgivere && !selvstendig && !nyttFrilansoppdrag && !registrerteFrilansoppdrag) {
        return undefined;
    }
    return {
        arbeidsgivere,
        frilansOppdrag: registrerteFrilansoppdrag,
        nyFrilans: nyttFrilansoppdrag,
        selvstendig,
        opptjeningUtland,
        utenlandskNæring,
    };
};
