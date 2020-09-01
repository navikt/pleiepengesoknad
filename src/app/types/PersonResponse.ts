import * as IoTs from 'io-ts';
import { FetchRecipe } from '../utils/fetcher/types';
import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';
import * as fetcher2 from '../utils/fetcher2/types';

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

export const personResponseValidator: IoTs.Type<PersonResponse> = new IoTs.Type<
    PersonResponse,
    PersonResponse,
    unknown
>(
    'personResponseType',
    isPersonResponse,
    (input: unknown, context: IoTs.Context) =>
        isPersonResponse(input) ? IoTs.success(input) : IoTs.failure(input, context),
    IoTs.identity
);

export const fetchPersonResponseRecipe: FetchRecipe<PersonResponse> = {
    url: getApiUrlByResourceType(ResourceType.SØKER),
    validator: personResponseValidator,
};

export const fetcherPersonResponseRecipe: fetcher2.FetchRecipe<PersonResponse> = {
    url: getApiUrlByResourceType(ResourceType.SØKER),
    typeguard: isPersonResponse,
};
