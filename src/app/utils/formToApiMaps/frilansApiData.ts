import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../types';
import { FrilansApiData, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { erFrilanserITidsrom } from '../frilanserUtils';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../tidsbrukUtils';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';
import { fjernArbeidstidUtenforPeriode } from './tidsbrukApiUtils';

export type FrilansApiDataPart = Pick<PleiepengesøknadApiData, 'frilans' | '_harHattInntektSomFrilanser'>;

export const getFrilansApiData = (
    formData: PleiepengesøknadFormData,
    søknadsperiode: DateRange,
    søknadsdato: Date
): FrilansApiDataPart => {
    const {
        frilans_harHattInntektSomFrilanser,
        frilans_jobberFortsattSomFrilans,
        frilans_startdato,
        frilans_arbeidsforhold,
        frilans_sluttdato,
    } = formData;

    const _harHattInntektSomFrilanser = frilans_harHattInntektSomFrilanser === YesOrNo.YES;

    if (_harHattInntektSomFrilanser === false) {
        return {
            _harHattInntektSomFrilanser: false,
        };
    }

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
        const frilanserPeriode = { frilansStartdato: startdato, frilansSluttdato: sluttdato };

        const arbeidsforhold = frilans_arbeidsforhold
            ? mapArbeidsforholdToApiData(
                  frilans_arbeidsforhold,
                  søknadsperiode,
                  ArbeidsforholdType.FRILANSER,
                  søknadsdato
              )
            : undefined;

        const historiskPeriode = getHistoriskPeriode(søknadsperiode, søknadsdato);
        const planlagtPeriode = getPlanlagtPeriode(søknadsperiode, søknadsdato);

        if (historiskPeriode && arbeidsforhold && erFrilanserITidsrom(historiskPeriode, frilanserPeriode) === false) {
            if (planlagtPeriode) {
                arbeidsforhold.historiskArbeid = { jobberIPerioden: JobberIPeriodeSvar.NEI };
            } else {
                arbeidsforhold.historiskArbeid = undefined;
            }
        }
        if (planlagtPeriode && arbeidsforhold && erFrilanserITidsrom(planlagtPeriode, frilanserPeriode) === false) {
            if (historiskPeriode) {
                arbeidsforhold.planlagtArbeid = { jobberIPerioden: JobberIPeriodeSvar.NEI };
            } else {
                arbeidsforhold.planlagtArbeid = undefined;
            }
        }

        if (arbeidsforhold?.historiskArbeid?.enkeltdager) {
            arbeidsforhold.historiskArbeid.enkeltdager = fjernArbeidstidUtenforPeriode(
                apiStringDateToDate(frilans_startdato),
                frilans_sluttdato ? apiStringDateToDate(frilans_sluttdato) : undefined,
                arbeidsforhold.historiskArbeid.enkeltdager
            );
        }

        if (arbeidsforhold?.planlagtArbeid?.enkeltdager) {
            arbeidsforhold.planlagtArbeid.enkeltdager = fjernArbeidstidUtenforPeriode(
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
