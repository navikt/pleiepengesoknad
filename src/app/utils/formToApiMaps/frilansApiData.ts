import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeidsforholdType } from '../../types';
import { FrilansApiData, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

type FrilansApiDataPart = Pick<PleiepengesøknadApiData, 'frilans' | '_harHattInntektSomFrilanser'>;

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

    const _harHattInntektSomFrilanser = frilans_harHattInntektSomFrilanser === YesOrNo.YES;

    if (_harHattInntektSomFrilanser === false) {
        return {
            _harHattInntektSomFrilanser,
        };
    }

    if (
        frilans_startdato === undefined ||
        frilans_jobberFortsattSomFrilans === undefined ||
        isYesOrNoAnswered(frilans_jobberFortsattSomFrilans) === false ||
        frilans_arbeidsforhold === undefined
    ) {
        throw new Error('mapFrilansToApiData - mangler arbeidsinformasjon om frilans');
    }

    const jobberFortsattSomFrilans: boolean = frilans_jobberFortsattSomFrilans === YesOrNo.YES;
    if (jobberFortsattSomFrilans === false && frilans_sluttdato === undefined) {
        throw new Error('mapFrilansToApiData - jobber ikke lenger som frilanser, men sluttdato mangler');
    }

    const frilans: FrilansApiData = {
        startdato: frilans_startdato,
        jobberFortsattSomFrilans,
        arbeidsforhold: mapArbeidsforholdToApiData(
            frilans_arbeidsforhold,
            søknadsperiode,
            ArbeidsforholdType.FRILANSER
        ),
        sluttdato: frilans_sluttdato,
    };

    return {
        _harHattInntektSomFrilanser: _harHattInntektSomFrilanser,
        frilans,
    };
};
