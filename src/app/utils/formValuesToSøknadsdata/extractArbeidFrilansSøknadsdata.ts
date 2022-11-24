import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { Arbeidsgiver } from '../../types';
import { FrilansFormData } from '../../types/FrilansFormData';
import { ArbeidFrilansSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getPeriodeSomFrilanserInnenforSøknadsperiode } from '../frilanserUtils';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidFrilansSøknadsdata = (
    frilans: FrilansFormData,
    frilansoppdrag: Arbeidsgiver[],
    søknadsperiode: DateRange
): ArbeidFrilansSøknadsdata | undefined => {
    const erFrilanser = frilans.harHattInntektSomFrilanser === YesOrNo.YES || frilansoppdrag.length > 0;

    /** Er ikke frilanser */
    if (!erFrilanser) {
        return {
            type: 'erIkkeFrilanser',
            erFrilanser: false,
        };
    }

    const startdato = datepickerUtils.getDateFromDateString(frilans.startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans.sluttdato);
    const aktivPeriode = startdato
        ? getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato, sluttdato)
        : undefined;
    const erFortsattFrilanser = frilans.erFortsattFrilanser === YesOrNo.YES;
    const arbeidsforhold = frilans.arbeidsforhold
        ? extractArbeidsforholdSøknadsdata(frilans.arbeidsforhold, ArbeidsforholdType.FRILANSER)
        : undefined;

    /** Er ikke lenger frilanser */
    if (startdato && sluttdato) {
        /** Sluttet før søknadsperiode */
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
        /** Sluttet i søknadsperiode */
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
    }

    if (erFortsattFrilanser && arbeidsforhold && startdato && aktivPeriode) {
        /** Er fortsatt frilanser */
        return {
            type: 'pågående',
            erFrilanser: true,
            harInntektISøknadsperiode: true,
            erFortsattFrilanser: true,
            startdato,
            aktivPeriode,
            arbeidsforhold,
        };
    }
    return undefined;
};
