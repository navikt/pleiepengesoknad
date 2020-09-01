import * as fetcher2 from '../utils/fetcher2/types';
import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';

export interface Arbeidsgiver {
    navn: string;
    organisasjonsnummer: string;
}

export interface ArbeidsgiverResponse {
    organisasjoner: Arbeidsgiver[]
}

export const isArbeidsgiverResponse = (value: any): value is ArbeidsgiverResponse => {
    // TODO: Implement
    return true;
}

export const fetcherArbeidsgiverResponseRecipe: fetcher2.FetchRecipe<ArbeidsgiverResponse> = {
    url: getApiUrlByResourceType(ResourceType.ARBEIDSGIVER),
    typeguard: isArbeidsgiverResponse,
}

