import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { Arbeidsgiver } from '../../types';
import { FrilansFormData } from '../../types/FrilansFormData';
import { ArbeidFrilansSøknadsdata, ArbeidFrilansSøknadsdataType } from '../../types/søknadsdata/Søknadsdata';
import { getPeriodeSomFrilanserInnenforSøknadsperiode } from '../frilanserUtils';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidFrilansSøknadsdata = (
    frilans: FrilansFormData,
    frilansoppdrag: Arbeidsgiver[],
    søknadsperiode: DateRange
): ArbeidFrilansSøknadsdata | undefined => {
    const erFrilanser = frilans.erFrilanserIPerioden === YesOrNo.YES || frilansoppdrag.length > 0;

    /** Er ikke frilanser */
    if (!erFrilanser) {
        return {
            type: ArbeidFrilansSøknadsdataType.erIkkeFrilanser,
            erFrilanser: false,
        };
    }

    const mottarFosterhjemsgodtgjørelse = frilans.fosterhjemsgodtgjørelse_mottar === YesOrNo.YES;
    const harAndreOppdragEnnFosterhjemsgodtgjørelse =
        mottarFosterhjemsgodtgjørelse == false
            ? undefined
            : frilans.fosterhjemsgodtgjørelse_harFlereOppdrag === YesOrNo.YES;

    if (mottarFosterhjemsgodtgjørelse && harAndreOppdragEnnFosterhjemsgodtgjørelse === false) {
        return {
            type: ArbeidFrilansSøknadsdataType.kunFosterhjemsgodtgjørelse,
            erFrilanser: true,
            mottarFosterhjemsgodtgjørelse: true,
            harAndreOppdragEnnFosterhjemsgodtgjørelse: false,
        };
    }

    const startdato = datepickerUtils.getDateFromDateString(frilans.startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans.sluttdato);
    const aktivPeriode = startdato
        ? getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato, sluttdato)
        : undefined;
    const erFortsattFrilanser = frilans.erFortsattFrilanser === YesOrNo.YES;
    const arbeidsforhold = frilans.arbeidsforhold
        ? extractArbeidsforholdSøknadsdata(
              frilans.arbeidsforhold,
              søknadsperiode,
              ArbeidsforholdType.FRILANSER,
              aktivPeriode
          )
        : undefined;

    if (startdato && sluttdato && erFortsattFrilanser === false) {
        /** Sluttet før søknadsperiode */
        if (!arbeidsforhold || !aktivPeriode) {
            return {
                type: ArbeidFrilansSøknadsdataType.avsluttetFørSøknadsperiode,
                erFrilanser: false,
                harInntektISøknadsperiode: false,
                erFortsattFrilanser: false,
                startdato,
                sluttdato,
            };
        }
        /** Sluttet i søknadsperiode */
        return {
            type: ArbeidFrilansSøknadsdataType.avsluttetISøknadsperiode,
            erFrilanser: true,
            aktivPeriode,
            harInntektISøknadsperiode: true,
            erFortsattFrilanser: false,
            startdato,
            sluttdato,
            arbeidsforhold,
            mottarFosterhjemsgodtgjørelse,
            harAndreOppdragEnnFosterhjemsgodtgjørelse,
        };
    }

    if (erFortsattFrilanser && arbeidsforhold && startdato && aktivPeriode) {
        /** Er fortsatt frilanser */
        return {
            type: ArbeidFrilansSøknadsdataType.pågående,
            erFrilanser: true,
            harInntektISøknadsperiode: true,
            erFortsattFrilanser: true,
            startdato,
            aktivPeriode,
            arbeidsforhold,
            mottarFosterhjemsgodtgjørelse,
            harAndreOppdragEnnFosterhjemsgodtgjørelse,
        };
    }
    return undefined;
};
