import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';
import { FetchRecipe } from '../utils/fetcher/types';

export interface Arbeidsgiver {
    navn: string;
    organisasjonsnummer: string;
}

export interface ArbeidsgiverResponse {
    organisasjoner: Arbeidsgiver[];
}

export const isArbeidsgiverResponse = (value: any): value is ArbeidsgiverResponse => {
    // TODO: Implement
    return true;
};

export const arbeidsgiverResponseRecipe = (fom: string, tom: string): FetchRecipe<ArbeidsgiverResponse> => ({
    url: `${getApiUrlByResourceType(ResourceType.ARBEIDSGIVER)}?fra_og_med=${fom}&til_og_med=${tom}`,
    typeguard: isArbeidsgiverResponse,
});
