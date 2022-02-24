import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ISODate, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { FormikProps } from 'formik';
import { getArbeidsgiver } from '../../../api/api';
import { Arbeidsgiver, ArbeidsgiverType } from '../../../types/Arbeidsgiver';
import { Arbeidsforhold, SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import appSentryLogger from '../../../utils/appSentryLogger';
import { relocateToLoginPage } from '../../../utils/navigationUtils';

export type AAregArbeidsgiverRemoteData = {
    organisasjoner?: {
        organisasjonsnummer: string;
        navn: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
    privatarbeidsgiver?: {
        offentligIdent: string;
        navn: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
    frilansoppdrag?: {
        type: string;
        organisasjonsnummer?: string;
        offentligIdent?: string;
        navn?: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
};

export const syncArbeidsforhold = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: Arbeidsforhold[] = []
): Array<Arbeidsforhold> => {
    const syncedArbeidsforhold: Arbeidsforhold[] = [];
    arbeidsgivere.forEach((arbeidsgiver) => {
        const forhold = arbeidsforhold.find((f) => f.arbeidsgiver.id === arbeidsgiver.id);
        syncedArbeidsforhold.push({
            arbeidsgiver,
            ...forhold,
        });
    });
    return syncedArbeidsforhold;
};

const erOrganisasjonElerPrivatArbeidsgiver = (a: Arbeidsgiver) =>
    a.type === ArbeidsgiverType.ORGANISASJON || a.type === ArbeidsgiverType.PRIVATPERSON;

const updateArbeidsforholdFormField = (
    { values, setFieldValue }: FormikProps<SøknadFormData>,
    arbeidsgivere: Arbeidsgiver[]
) => {
    const ansattArbeidsforhold = syncArbeidsforhold(
        arbeidsgivere.filter(erOrganisasjonElerPrivatArbeidsgiver),
        values.ansatt_arbeidsforhold
    );
    if (ansattArbeidsforhold.length > 0) {
        setFieldValue(SøknadFormField.ansatt_arbeidsforhold, ansattArbeidsforhold);
    }
};

export const mapAAregArbeidsgiverRemoteDataToArbeidsiver = (data: AAregArbeidsgiverRemoteData): Arbeidsgiver[] => {
    const arbeidsgivere: Arbeidsgiver[] = [];
    data.organisasjoner?.forEach((a) => {
        arbeidsgivere.push({
            type: ArbeidsgiverType.ORGANISASJON,
            id: a.organisasjonsnummer,
            organisasjonsnummer: a.organisasjonsnummer,
            navn: a.navn,
        });
    });
    data.privatarbeidsgiver?.forEach((a) => {
        arbeidsgivere.push({
            type: ArbeidsgiverType.PRIVATPERSON,
            id: a.offentligIdent,
            offentligIdent: a.offentligIdent,
            navn: a.navn,
            ansattFom: a.ansattFom ? ISODateToDate(a.ansattFom) : undefined,
            ansattTom: a.ansattTom ? ISODateToDate(a.ansattTom) : undefined,
        });
    });
    data.frilansoppdrag?.forEach((a) => {
        arbeidsgivere.push({
            type: ArbeidsgiverType.FRILANSOPPDRAG,
            id: a.offentligIdent || a.organisasjonsnummer || 'ukjent',
            organisasjonsnummer: a.organisasjonsnummer,
            offentligIdent: a.offentligIdent,
            navn: a.navn || 'Frilansoppdrag',
            ansattFom: a.ansattFom ? ISODateToDate(a.ansattFom) : undefined,
            ansattTom: a.ansattTom ? ISODateToDate(a.ansattTom) : undefined,
        });
    });
    return arbeidsgivere;
};

export async function getArbeidsgivereRemoteData(
    fromDate: Date,
    toDate: Date,
    formikProps: FormikProps<SøknadFormData>
): Promise<Arbeidsgiver[]> {
    try {
        const response = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
        const arbeidsgivere = mapAAregArbeidsgiverRemoteDataToArbeidsiver(response.data);
        updateArbeidsforholdFormField(formikProps, arbeidsgivere);
        return Promise.resolve(arbeidsgivere);
    } catch (error: any) {
        if (apiUtils.isUnauthorized(error)) {
            relocateToLoginPage();
        } else {
            appSentryLogger.logApiError(error);
        }
        return Promise.reject([]);
    }
}
