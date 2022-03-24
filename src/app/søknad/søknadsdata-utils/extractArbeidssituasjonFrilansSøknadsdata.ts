import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidssituasjonFrilansSøknadsdata } from '../../types/Søknadsdata';
import {
    getPeriodeSomFrilanserInnenforPeriode,
    harSvartErFrilanserEllerHarFrilansoppdrag,
} from '../../utils/frilanserUtils';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidssituasjonFrilansSøknadsdata = (
    formData: SøknadFormData,
    søknadsperiode: DateRange
): ArbeidssituasjonFrilansSøknadsdata | undefined => {
    const { frilans, frilansoppdrag } = formData;
    if (
        !frilans ||
        harSvartErFrilanserEllerHarFrilansoppdrag(frilans.harHattInntektSomFrilanser, frilansoppdrag) === false
    ) {
        return undefined;
    }

    const startdato = datepickerUtils.getDateFromDateString(frilans.startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans.sluttdato);
    const erFortsattFrilanser = frilans.jobberFortsattSomFrilans === YesOrNo.YES;
    const arbeidsforhold = extractArbeidsforholdSøknadsdata(frilans.arbeidsforhold);

    if (!startdato || !arbeidsforhold) {
        return undefined;
    }
    if (startdato && sluttdato && erFortsattFrilanser === false) {
        const periode = getPeriodeSomFrilanserInnenforPeriode(søknadsperiode, formData.frilans);
        if (periode === undefined) {
            return undefined;
        }
    }

    return {
        startdato,
        erFortsattFrilanser,
        sluttdato,
        arbeidsforhold,
    };
};
