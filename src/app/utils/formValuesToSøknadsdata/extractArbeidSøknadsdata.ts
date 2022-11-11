import { DateRange } from '@navikt/sif-common-formik/lib';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { ArbeidSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { extractArbeidsgivereArbeidsforholdSøknadsdata } from './extractArbeidsgivereArbeidsforholdSøknadsdata';
import { extractArbeidSelvstendigSøknadsdata } from './extractArbeidSelvstendigSøknadsdata';
import { extractOpptjeningUtlandSøknadsdata } from './extractOpptjeningUtlandSøknadsdata';
import { extractUtenlandskNæringSøknadsdata } from './extractUtenlandskNæringSøknadsdata';
import { extractFrilansOppdragArbeidsforholdSøknadsdata } from './extractFrilansOppdragArbeidsforholdSøknadsdata';
import { extractNyFrilansArbeidsforholdSøknadsdata } from './extractNyFrilansArbeidsforholdSøknadsdata';

export const extractArbeidSøknadsdata = (
    values: SøknadFormValues,
    søknadsperiode: DateRange
): ArbeidSøknadsdata | undefined => {
    const arbeidsgivere = extractArbeidsgivereArbeidsforholdSøknadsdata(values.ansatt_arbeidsforhold);
    const frilansOppdrag = extractFrilansOppdragArbeidsforholdSøknadsdata(values.frilansoppdrag, søknadsperiode);
    const nyFrilans = extractNyFrilansArbeidsforholdSøknadsdata(
        values.nyfrilansoppdrag,
        values.erFrilanserIPeriode,
        søknadsperiode
    );
    const selvstendig = extractArbeidSelvstendigSøknadsdata(values.selvstendig, søknadsperiode);
    const opptjeningUtland = extractOpptjeningUtlandSøknadsdata(values);
    const utenlandskNæring = extractUtenlandskNæringSøknadsdata(values);

    if (!arbeidsgivere && !selvstendig && !nyFrilans && !frilansOppdrag) {
        return undefined;
    }
    return {
        arbeidsgivere,
        frilansOppdrag,
        nyFrilans,
        selvstendig,
        opptjeningUtland,
        utenlandskNæring,
    };
};
