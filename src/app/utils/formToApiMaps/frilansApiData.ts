import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { ArbeidsforholdType } from '../../types';
import { FrilansApiData, PleiepengesøknadApiData, TidEnkeltdagApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
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

    const arbeidsforhold = mapArbeidsforholdToApiData(
        frilans_arbeidsforhold,
        søknadsperiode,
        ArbeidsforholdType.FRILANSER
    );

    if (arbeidsforhold.historiskArbeid?.enkeltdager) {
        arbeidsforhold.historiskArbeid.enkeltdager = fjernArbeidstidUtenforPeriodeSomFrilanser(
            apiStringDateToDate(frilans_startdato),
            frilans_sluttdato ? apiStringDateToDate(frilans_sluttdato) : undefined,
            arbeidsforhold.historiskArbeid.enkeltdager
        );
    }

    if (arbeidsforhold.planlagtArbeid?.enkeltdager) {
        arbeidsforhold.planlagtArbeid.enkeltdager = fjernArbeidstidUtenforPeriodeSomFrilanser(
            apiStringDateToDate(frilans_startdato),
            frilans_sluttdato ? apiStringDateToDate(frilans_sluttdato) : undefined,
            arbeidsforhold.planlagtArbeid.enkeltdager
        );
    }

    const frilans: FrilansApiData = {
        startdato: frilans_startdato,
        jobberFortsattSomFrilans,
        arbeidsforhold,
        sluttdato: frilans_sluttdato,
    };

    return {
        _harHattInntektSomFrilanser: _harHattInntektSomFrilanser,
        frilans,
    };
};
