import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType } from '../../types';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdFormData';
import { FrilansFormData } from '../../types/FrilansFormData';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { SelvstendigFormData } from '../../types/SelvstendigFormData';
import { OrganisasjonArbeidsgiverApiData } from '../../types/søknad-api-data/arbeidsgiverApiData';
import { FrilansApiData } from '../../types/søknad-api-data/frilansApiData';
import { SelvstendigApiData } from '../../types/søknad-api-data/selvstendigApiData';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { booleanToYesOrNo } from '../booleanToYesOrNo';
import { arbeidsgiverHarOrganisasjonsnummer } from './extractFormValuesUtils';
import { mapArbeidIPeriodeApiDataToFormValues } from './mapArbeidIPeriodeToFormValues';
import { mapNormalarbeidstidApiDataToFormValues } from './mapNormalarbeidstidToFormValues';
import { mapOpptjeningIUtlandetApiDataToOpptjeningUtland } from './mapOpptjeningIUtlandetApiDataToOpptjeningUtland';
import { mapUtenlandskNæringApiDataToUtenlandskNæring } from './mapUtenlandskNæringApiDataToUtenlandskNæring';
import { mapVirksomhetApiDataToVirksomhet } from './mapVirksomhetApiDataToVirksomhet';

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

export const mapFrilanserToFormValues = (frilanser: FrilansApiData): FrilansFormData => {
    if (frilanser.harInntektSomFrilanser) {
        const erFortsattFrilanser = booleanToYesOrNo(frilanser.jobberFortsattSomFrilans);
        return {
            harHattInntektSomFrilanser: YesOrNo.YES,
            erFortsattFrilanser: booleanToYesOrNo(frilanser.jobberFortsattSomFrilans),
            startdato: frilanser.startdato,
            sluttdato: erFortsattFrilanser ? frilanser.sluttdato : '',
            arbeidsforhold: {
                arbeidIPeriode: mapArbeidIPeriodeApiDataToFormValues(frilanser.arbeidsforhold.arbeidIPeriode),
                normalarbeidstid: mapNormalarbeidstidApiDataToFormValues(frilanser.arbeidsforhold.normalarbeidstid),
                sluttetFørSøknadsperiode: YesOrNo.NO,
            },
        };
    }
    return {
        harHattInntektSomFrilanser: YesOrNo.NO,
    };
};

export const mapSelvstendigToFormValues = (selvstendig: SelvstendigApiData): SelvstendigFormData => {
    if (selvstendig.harInntektSomSelvstendig) {
        return {
            harHattInntektSomSN: YesOrNo.YES,
            harFlereVirksomheter: YesOrNo.NO /** ToDo: må diskuteres */,
            virksomhet: mapVirksomhetApiDataToVirksomhet(selvstendig.virksomhet),
            arbeidsforhold: {
                arbeidIPeriode: mapArbeidIPeriodeApiDataToFormValues(selvstendig.arbeidsforhold.arbeidIPeriode),
                normalarbeidstid: mapNormalarbeidstidApiDataToFormValues(selvstendig.arbeidsforhold.normalarbeidstid),
            },
        };
    }
    return {
        harHattInntektSomSN: YesOrNo.NO,
    };
};

export const extractArbeidFormValues = (søknad: InnsendtSøknadInnhold): ArbeidFormValues | undefined => {
    const ansatt_arbeidsforhold = søknad.arbeidsgivere
        .filter(arbeidsgiverHarOrganisasjonsnummer)
        .map((a) => mapArbeidsgiverToFormValues(a));

    return {
        ansatt_arbeidsforhold: ansatt_arbeidsforhold,
        frilans: mapFrilanserToFormValues(søknad.frilans),
        frilansoppdrag: [],
        selvstendig: mapSelvstendigToFormValues(søknad.selvstendigNæringsdrivende),
        harOpptjeningUtland: booleanToYesOrNo(søknad.opptjeningIUtlandet.length > 0),
        opptjeningUtland: søknad.opptjeningIUtlandet.map(mapOpptjeningIUtlandetApiDataToOpptjeningUtland),
        harUtenlandskNæring: booleanToYesOrNo(søknad.utenlandskNæring.length > 0),
        utenlandskNæring: søknad.utenlandskNæring.map(mapUtenlandskNæringApiDataToUtenlandskNæring),
    };
};
