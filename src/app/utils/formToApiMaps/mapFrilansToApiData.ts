import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import {
    ArbeidsforholdApi,
    ArbeidsforholdType,
    FrilansApiData,
    PleiepengesøknadApiData,
} from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

type FrilansApiDataPart = Pick<PleiepengesøknadApiData, 'frilans' | 'harHattInntektSomFrilanser'>;

export const mapFrilansToApiData = (formData: PleiepengesøknadFormData): FrilansApiDataPart => {
    const {
        frilans_harHattInntektSomFrilanser,
        frilans_jobberFortsattSomFrilans,
        frilans_startdato,
        frilans_arbeidsforhold,
        frilans_sluttdato,
    } = formData;

    const harHattInntektSomFrilanser = frilans_harHattInntektSomFrilanser === YesOrNo.YES;

    if (harHattInntektSomFrilanser === false) {
        return {
            harHattInntektSomFrilanser,
        };
    }

    if (
        frilans_startdato === undefined ||
        frilans_jobberFortsattSomFrilans === undefined ||
        isYesOrNoAnswered(frilans_jobberFortsattSomFrilans) === false
    ) {
        throw new Error('mapFrilansToApiData - mangler frilansinformasjon');
    }

    const startdato = frilans_startdato;
    const jobberFortsattSomFrilans: boolean = frilans_jobberFortsattSomFrilans === YesOrNo.YES;
    const sluttdato = frilans_jobberFortsattSomFrilans === YesOrNo.NO ? frilans_sluttdato : undefined;
    if (frilans_jobberFortsattSomFrilans === YesOrNo.NO && sluttdato === undefined) {
        throw new Error('mapFrilansToApiData - jobber ikke lenger som frilanser, men sluttdato mangler');
    }
    const arbeidsforhold: ArbeidsforholdApi | undefined = frilans_arbeidsforhold
        ? mapArbeidsforholdToApiData(frilans_arbeidsforhold, ArbeidsforholdType.FRILANSER)
        : undefined;

    if (jobberFortsattSomFrilans === true && arbeidsforhold === undefined) {
        throw new Error('mapFrilansToApiData - mangler arbeidsforhold informasjon');
    }
    const frilans: FrilansApiData = {
        startdato,
        jobberFortsattSomFrilans,
        arbeidsforhold,
        sluttdato,
    };
    return {
        harHattInntektSomFrilanser,
        frilans,
    };
};
