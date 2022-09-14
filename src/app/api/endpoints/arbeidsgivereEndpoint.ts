import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { ISODate, ISODateToDate } from '@navikt/sif-common-utils';
import { AxiosError } from 'axios';
import { Arbeidsgiver, ArbeidsgiverType } from '../../types';
import api from '../api';
import { ApiEndpointPsb } from '../endpoints';

export type AAregArbeidsgiverRemoteData = {
    organisasjoner?: {
        organisasjonsnummer: string;
        navn: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
    /**
     privatarbeidsgiver?: {
         offentligIdent: string;
         navn: string;
         ansattFom?: ISODate;
         ansattTom?: ISODate;
     }[];
     */
    frilansoppdrag?: {
        type: string;
        organisasjonsnummer?: string;
        offentligIdent?: string;
        navn?: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
};

const mapAAregArbeidsgiverRemoteDataToArbeidsgiver = (data: AAregArbeidsgiverRemoteData): Arbeidsgiver[] => {
    const arbeidsgivere: Arbeidsgiver[] = [];
    data.organisasjoner?.forEach((a) => {
        arbeidsgivere.push({
            type: ArbeidsgiverType.ORGANISASJON,
            id: a.organisasjonsnummer,
            organisasjonsnummer: a.organisasjonsnummer,
            navn: a.navn || a.organisasjonsnummer,
        });
    });
    /**
     Privat arbeidsgiver er ikke tatt i bruk, og returnerers ikke fra backend enda
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
     */
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

const arbeidsgivereEndpoint = {
    fetch: async (fom: string, tom: string): Promise<RemoteData<AxiosError, Arbeidsgiver[]>> => {
        try {
            const { data } = await api.psb.get<AAregArbeidsgiverRemoteData>(
                ApiEndpointPsb.ARBEIDSGIVER,
                `fra_og_med=${fom}&til_og_med=${tom}`
            );
            return Promise.resolve(success(mapAAregArbeidsgiverRemoteDataToArbeidsgiver(data)));
        } catch (error) {
            return Promise.reject(failure(error));
        }
    },
};

export default arbeidsgivereEndpoint;
