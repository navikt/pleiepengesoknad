import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';
import { FetchRecipe } from '../utils/fetcher/types';

export interface PersonResponse {
    etternavn: string;
    fornavn: string;
    mellomnavn: string;
    kjønn: string;
    fødselsnummer: string;
    myndig: boolean;
}

export const isPersonResponse = (input: any): input is PersonResponse => {
    // TODO: Implement
    return input !== undefined;
};

export const personResponseRecipe: FetchRecipe<PersonResponse> = {
    url: getApiUrlByResourceType(ResourceType.SØKER),
    typeguard: isPersonResponse,
};
