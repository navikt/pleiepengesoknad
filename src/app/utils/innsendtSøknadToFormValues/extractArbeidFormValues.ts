import { YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    DateDurationMap,
    DurationWeekdays,
    ISODateToDate,
    ISODurationToDecimalDuration,
    ISODurationToMaybeDuration,
} from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType, TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import { ArbeidsforholdFormData, NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { ArbeidsgiverApiData, OrganisasjonArbeidsgiverApiData } from '../../types/søknad-api-data/arbeidsgiverApiData';
import { NormalarbeidstidApiData } from '../../types/søknad-api-data/normalarbeidstidApiData';
import {
    ArbeidIPeriodeApiData,
    ArbeidIPeriodeApiDataFasteDager,
    ArbeidIPeriodeApiDataProsent,
    ArbeidIPeriodeApiDataTimerPerUke,
    ArbeidIPeriodeApiDataVariert,
    TimerFasteDagerApiData,
} from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { booleanToYesOrNo } from '../booleanToYesOrNo';

type ArbeidFormValues = Pick<
    SøknadFormValues,
    | SøknadFormField.frilans
    | SøknadFormField.frilansoppdrag
    | SøknadFormField.ansatt_arbeidsforhold
    | SøknadFormField.opptjeningUtland
    | SøknadFormField.selvstendig
    | SøknadFormField.utenlandskNæring
    | SøknadFormField.harOpptjeningUtland
    | SøknadFormField.harUtenlandskNæring
>;

export const timerFasteDagerApiDataToDurationWeekdays = ({
    mandag,
    tirsdag,
    onsdag,
    torsdag,
    fredag,
}: TimerFasteDagerApiData): DurationWeekdays => {
    return {
        monday: mandag ? ISODurationToMaybeDuration(mandag) : undefined,
        tuesday: tirsdag ? ISODurationToMaybeDuration(tirsdag) : undefined,
        wednesday: onsdag ? ISODurationToMaybeDuration(onsdag) : undefined,
        thursday: torsdag ? ISODurationToMaybeDuration(torsdag) : undefined,
        friday: fredag ? ISODurationToMaybeDuration(fredag) : undefined,
    };
};

export const mapNormalarbeidstidApiDataToFormValues = (
    normalarbeidstid?: NormalarbeidstidApiData
): NormalarbeidstidFormData | undefined => {
    if (!normalarbeidstid) {
        return undefined;
    }
    if (normalarbeidstid.erLiktHverUke) {
        return {
            erLikeMangeTimerHverUke: YesOrNo.YES,
            arbeiderFastHelg: YesOrNo.NO,
            arbeiderHeltid: YesOrNo.YES,
            erFasteUkedager: YesOrNo.YES,
            timerFasteUkedager: timerFasteDagerApiDataToDurationWeekdays(normalarbeidstid.timerFasteDager),
        };
    }
    return {
        erLikeMangeTimerHverUke: YesOrNo.NO,
        timerPerUke: `${ISODurationToDecimalDuration(normalarbeidstid.timerPerUkeISnitt)}`.replace('.', ','),
        /** WhatTodo
         * lage støtte for at bruker får spørsmål om snitt er det samme

         */
    };
};

export const mapArbeidstidEnkeltdagerApiDataToFormValues = (
    arbeid: ArbeidIPeriodeApiDataVariert
): ArbeidIPeriodeFormData => {
    const enkeltdager: DateDurationMap = {};
    arbeid.enkeltdager.forEach((enkeltdag) => {
        const arbeidstid = ISODurationToMaybeDuration(enkeltdag.arbeidstimer.faktiskTimer);
        if (arbeidstid) {
            enkeltdager[enkeltdag.dato] = arbeidstid;
        }
    });
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        erLiktHverUke: YesOrNo.NO,
        enkeltdager,
    };
};

export const mapArbeidIPeriodeApiDataFasteDagerToFormValues = (
    arbeid: ArbeidIPeriodeApiDataFasteDager
): ArbeidIPeriodeFormData => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        erLiktHverUke: YesOrNo.YES,
        fasteDager: timerFasteDagerApiDataToDurationWeekdays(arbeid.fasteDager),
    };
};

export const mapArbeidIPeriodeApiDataTimerPerUkeToFormValues = (
    arbeid: ArbeidIPeriodeApiDataTimerPerUke
): ArbeidIPeriodeFormData => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        erLiktHverUke: YesOrNo.YES,
        timerEllerProsent: TimerEllerProsent.TIMER,
        timerPerUke: `${ISODurationToDecimalDuration(arbeid.timerPerUke)}`.replace('.', ','),
    };
};

export const mapArbeidIPeriodeApiDataProsentToFormValues = (
    arbeid: ArbeidIPeriodeApiDataProsent
): ArbeidIPeriodeFormData => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        erLiktHverUke: YesOrNo.YES,
        timerEllerProsent: TimerEllerProsent.PROSENT,
        prosentAvNormalt: `${arbeid.prosentAvNormalt}`.replace('.', ','),
    };
};

export const mapArbeidIPeriodeApiDataToFormValues = (
    arbeid?: ArbeidIPeriodeApiData
): ArbeidIPeriodeFormData | undefined => {
    if (!arbeid) {
        return undefined;
    }
    switch (arbeid.type) {
        case ArbeidIPeriodeType.arbeiderIkke:
        case ArbeidIPeriodeType.arbeiderVanlig:
            return {
                arbeiderIPerioden: arbeid.arbeiderIPerioden,
            };
        case ArbeidIPeriodeType.arbeiderEnkeltdager:
            return mapArbeidstidEnkeltdagerApiDataToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderFasteUkedager:
            return mapArbeidIPeriodeApiDataFasteDagerToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
            return mapArbeidIPeriodeApiDataProsentToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
            return mapArbeidIPeriodeApiDataTimerPerUkeToFormValues(arbeid);
    }
};

export const mapArbeidsgiverToFormValues = (arbeidsgiver: OrganisasjonArbeidsgiverApiData): ArbeidsforholdFormData => {
    const formValues: ArbeidsforholdFormData = {
        arbeidsgiver: {
            ...arbeidsgiver,
            id: arbeidsgiver.organisasjonsnummer,
            type: ArbeidsgiverType.ORGANISASJON,
            ansattFom: arbeidsgiver.ansattFom !== undefined ? ISODateToDate(arbeidsgiver.ansattFom) : undefined,
            ansattTom: arbeidsgiver.ansattTom !== undefined ? ISODateToDate(arbeidsgiver.ansattTom) : undefined,
        },
        erAnsatt: booleanToYesOrNo(arbeidsgiver.erAnsatt),
        sluttetFørSøknadsperiode: arbeidsgiver.erAnsatt ? YesOrNo.NO : YesOrNo.UNANSWERED,
        normalarbeidstid: mapNormalarbeidstidApiDataToFormValues(arbeidsgiver.arbeidsforhold?.normalarbeidstid),
        arbeidIPeriode: mapArbeidIPeriodeApiDataToFormValues(arbeidsgiver.arbeidsforhold?.arbeidIPeriode),
    };
    return formValues;
};

export const arbeidsgiverHarOrganisasjonsnummer = (a: ArbeidsgiverApiData): a is OrganisasjonArbeidsgiverApiData => {
    return a.organisasjonsnummer !== undefined;
};

export const extractArbeidFormValues = (søknad: InnsendtSøknadInnhold): ArbeidFormValues | undefined => {
    const ansatt_arbeidsforhold = søknad.arbeidsgivere
        .filter(arbeidsgiverHarOrganisasjonsnummer)
        .map((a) => mapArbeidsgiverToFormValues(a));

    return {
        ansatt_arbeidsforhold: ansatt_arbeidsforhold,
        frilans: { harHattInntektSomFrilanser: YesOrNo.NO },
        selvstendig: { harHattInntektSomSN: YesOrNo.NO },
        harOpptjeningUtland: YesOrNo.NO,
        harUtenlandskNæring: YesOrNo.NO,
        frilansoppdrag: [],
        opptjeningUtland: [],
        utenlandskNæring: [],
    };
};
