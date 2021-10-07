import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import { ArbeidsforholdType } from '../../types';
import { FrilansApiData, PleiepengesøknadApiData, TidEnkeltdagApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { erFrilanserITidsrom } from '../frilanserUtils';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

type FrilansApiDataPart = Pick<PleiepengesøknadApiData, 'frilans' | '_harHattInntektSomFrilanser'>;

const fjernArbeidstidUtenforPeriodeSomFrilanser = (
    fom: Date | undefined,
    tom: Date | undefined,
    arbeidstid?: TidEnkeltdagApiData[]
): TidEnkeltdagApiData[] | undefined => {
    if (!arbeidstid || (!fom && !tom)) {
        return arbeidstid;
    }
    return arbeidstid.filter((dag) => {
        const dato = apiStringDateToDate(dag.dato);
        if (fom && dayjs(dato).isBefore(fom)) {
            return false;
        }
        if (tom && dayjs(dato).isAfter(tom)) {
            return false;
        }
        return true;
    });
};

export const getFrilansApiData = (
    formData: PleiepengesøknadFormData,
    søknadsperiode: DateRange
): FrilansApiDataPart => {
    const {
        frilans_harHattInntektSomFrilanser,
        frilans_jobberFortsattSomFrilans,
        frilans_startdato,
        frilans_arbeidsforhold,
        frilans_sluttdato,
    } = formData;

    const _harHattInntektSomFrilanser = frilans_harHattInntektSomFrilanser === YesOrNo.NO;
    const jobberFortsattSomFrilans: boolean = frilans_jobberFortsattSomFrilans === YesOrNo.YES;
    const startdato = datepickerUtils.getDateFromDateString(frilans_startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    if (frilans_startdato === undefined) {
        console.error('getFrilansApiData - frilans_startdato === undefined');
        return {
            _harHattInntektSomFrilanser: false,
        };
    }

    if (
        startdato &&
        erFrilanserITidsrom(søknadsperiode, { frilansStartdato: startdato, frilansSluttdato: sluttdato })
    ) {
        const arbeidsforhold = frilans_arbeidsforhold
            ? mapArbeidsforholdToApiData(frilans_arbeidsforhold, søknadsperiode, ArbeidsforholdType.FRILANSER)
            : undefined;

        if (arbeidsforhold?.historiskArbeid?.enkeltdager) {
            arbeidsforhold.historiskArbeid.enkeltdager = fjernArbeidstidUtenforPeriodeSomFrilanser(
                apiStringDateToDate(frilans_startdato),
                frilans_sluttdato ? apiStringDateToDate(frilans_sluttdato) : undefined,
                arbeidsforhold.historiskArbeid.enkeltdager
            );
        }

        if (arbeidsforhold?.planlagtArbeid?.enkeltdager) {
            arbeidsforhold.planlagtArbeid.enkeltdager = fjernArbeidstidUtenforPeriodeSomFrilanser(
                apiStringDateToDate(frilans_startdato),
                frilans_sluttdato ? apiStringDateToDate(frilans_sluttdato) : undefined,
                arbeidsforhold.planlagtArbeid.enkeltdager
            );
        }
        const frilans: FrilansApiData = {
            startdato: frilans_startdato,
            jobberFortsattSomFrilans,
            sluttdato: frilans_sluttdato,
            arbeidsforhold,
        };
        return {
            _harHattInntektSomFrilanser,
            frilans,
        };
    } else {
        return {
            _harHattInntektSomFrilanser,
        };
    }
};
