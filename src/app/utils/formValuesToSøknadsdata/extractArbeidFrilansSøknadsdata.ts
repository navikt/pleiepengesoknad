import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
// import { Arbeidsgiver } from '../../types';
import { FrilansFormData, FrilansTyper } from '../../types/FrilansFormData';
import { ArbeidFrilansSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getPeriodeSomFrilanserInnenforSøknadsperiode, kunStyrevervUtenNormalArbeidstid } from '../frilanserUtils';
import { extractArbeidsforholdFrilansSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidFrilansSøknadsdata = (
    frilans: FrilansFormData,
    // frilansoppdrag: Arbeidsgiver[],
    søknadsperiode: DateRange
): ArbeidFrilansSøknadsdata | undefined => {
    const erFrilanser = frilans.harHattInntektSomFrilanser === YesOrNo.YES;

    /** Er ikke frilanser */
    if (!erFrilanser) {
        return {
            type: 'erIkkeFrilanser',
            erFrilanser: false,
        };
    }

    //TODO
    if (frilans.frilansTyper === undefined) {
        return undefined;
    }

    if (kunStyrevervUtenNormalArbeidstid(frilans.frilansTyper, frilans.misterHonorarStyreverv)) {
        return {
            type: 'pågåendeKunStyreverv',
            erFrilanser: true,
            frilansType: [FrilansTyper.STYREVERV],
            misterHonorar: YesOrNo.NO,
        };
    }

    const startdato = datepickerUtils.getDateFromDateString(frilans.startdato);
    // const sluttdato = datepickerUtils.getDateFromDateString(frilans.sluttdato);
    const aktivPeriode = startdato
        ? getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato)
        : undefined;
    // const erFortsattFrilanser = frilans.erFortsattFrilanser === YesOrNo.YES;
    const arbeidsforhold = frilans.arbeidsforhold
        ? extractArbeidsforholdFrilansSøknadsdata(frilans.arbeidsforhold, ArbeidsforholdType.FRILANSER)
        : undefined;

    /** Er ikke lenger frilanser */
    /* if (startdato && sluttdato) {
        /** Sluttet før søknadsperiode
        if (!arbeidsforhold || !aktivPeriode) {
            return {
                type: 'avsluttetFørSøknadsperiode',
                erFrilanser: false,
                harInntektISøknadsperiode: false,
                erFortsattFrilanser: false,
                startdato,
                sluttdato,
            };
        }
         Sluttet i søknadsperiode
        return {
            type: 'avsluttetISøknadsperiode',
            erFrilanser: true,
            aktivPeriode,
            harInntektISøknadsperiode: true,
            erFortsattFrilanser: false,
            startdato,
            sluttdato,
            arbeidsforhold,
        };
    }*/

    if (arbeidsforhold && startdato && aktivPeriode) {
        /** Er fortsatt frilanser */
        return {
            type: 'pågående',
            erFrilanser: true,
            frilansType: frilans.frilansTyper,
            misterHonorar: frilans.frilansTyper.some((type) => type === FrilansTyper.STYREVERV)
                ? frilans.misterHonorarStyreverv
                : undefined,
            startdato,
            aktivPeriode,
            arbeidsforhold,
        };
    }
    return undefined;
};
