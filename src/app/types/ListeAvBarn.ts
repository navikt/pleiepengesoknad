import * as IoTs from 'io-ts';
import { FetchRecipe } from '../utils/fetcher/types';
import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';

export interface Barn {
    fornavn: string;
    etternavn: string;
    mellomnavn?: string;
    aktørId: string;
    fødselsdato: Date;
    harSammeAdresse?: boolean;
}

export const isBarn = (input: any): input is Barn => {
    // TODO: Implementer type guard
    return input !== undefined;
};

export type ListeAvBarn = Barn[];

export const isListeAvBarn = (input: any): input is ListeAvBarn => {
    // TODO: Implementer type guard
    return input !== undefined;
};

export interface BarnResponse {
    barn: ListeAvBarn;
}

export const isBarnResponse = (input: any): input is BarnResponse => {
    // TODO: Implementer type guard
    return input !== undefined;
};

export const barnResponseValidator: IoTs.Type<BarnResponse> = new IoTs.Type<BarnResponse, BarnResponse, unknown>(
    'barnResponseType',
    isBarnResponse,
    (input: unknown, context: IoTs.Context) =>
        isBarnResponse(input) ? IoTs.success(input) : IoTs.failure(input, context),
    IoTs.identity
);

export const fetchBarnResponseRecipe: FetchRecipe<BarnResponse> = {
    url: getApiUrlByResourceType(ResourceType.BARN),
    validator: barnResponseValidator,
};
