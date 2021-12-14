import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../types';
import { FrilansApiData, SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../fortidFremtidUtils';
import { erFrilanserITidsrom } from '../frilanserUtils';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

export type FrilansApiDataPart = Pick<SøknadApiData, 'frilans' | '_harHattInntektSomFrilanser'>;

export const getFrilansApiData = (
    formData: SøknadFormData,
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
    const startdato = datepickerUtils.getDateFromDateString(frilans_startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    if (
        _harHattInntektSomFrilanser === false ||
        frilans_startdato === undefined ||
        startdato === undefined ||
        erFrilanserITidsrom(søknadsperiode, { frilansStartdato: startdato, frilansSluttdato: sluttdato }) === false
    ) {
        return {
            _harHattInntektSomFrilanser: false,
        };
    }

    const historiskPeriode = getHistoriskPeriode(søknadsperiode, søknadsdato);
    const planlagtPeriode = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    const frilanserPeriode = { frilansStartdato: startdato, frilansSluttdato: sluttdato };

    const arbeidsforhold = frilans_arbeidsforhold
        ? mapArbeidsforholdToApiData(
              frilans_arbeidsforhold,
              søknadsperiode,
              ArbeidsforholdType.FRILANSER,
              søknadsdato,
              { from: startdato, to: sluttdato }
          )
        : undefined;

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

    const frilans: FrilansApiData = {
        startdato: frilans_startdato,
        jobberFortsattSomFrilans: frilans_jobberFortsattSomFrilans === YesOrNo.YES,
        sluttdato: frilans_sluttdato,
        arbeidsforhold,
    };
    return {
        _harHattInntektSomFrilanser,
        frilans,
    };
};
