import * as IoTs from 'io-ts';
import { FetchRecipe } from '../utils/fetcher/types';
import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';
import { isString } from '@sif-common/core/utils/typeGuardUtils';
import { isDate } from 'moment';
import { apiStringDateToDate } from '@sif-common/core/utils/dateUtils';
import * as fetcher2 from '../utils/fetcher2/types';

export interface Barn {
    fornavn: string;
    etternavn: string;
    mellomnavn?: string;
    aktørId: string;
    fødselsdato: Date;
    harSammeAdresse?: boolean;
}

export function validateIfPresentOrReturnTrue<T>(value: any, validator: (value: any) => value is T): boolean {
    if (value !== undefined) {
        return validator(value);
    } else {
        return true;
    }
}

export const isBoolean = <U>(term: boolean | U): term is boolean => {
    return typeof term === 'boolean';
};

export const isBarn = (input: any): input is Barn =>
    input &&
    isString(input.fornavn) &&
    validateIfPresentOrReturnTrue<string>(input.mellomnavn, isString) &&
    isString(input.etternavn) &&
    isString(input.aktørId) &&
    isString(input.fødselsdato) &&
    isDate(apiStringDateToDate(input.fødselsdato)) &&
    validateIfPresentOrReturnTrue(input.harSammeAdresse, isBoolean);

export type ListeAvBarn = Barn[];

export const isListeAvBarn = (input: any): input is ListeAvBarn => {
    // TODO: Implementer type guard
    return input !== undefined;
};

export interface BarnResponse {
    barn: ListeAvBarn;
}

export const isBarnResponse = (input: any): input is BarnResponse =>
    input.barn &&
    Array.isArray(input.barn) &&
    input.barn
        .map((barn: any) => isBarn(barn))
        .reduce((prevValue: boolean, currentValue: boolean) => prevValue && currentValue, true);

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

export const fetcherBarnResponseRecipe: fetcher2.FetchRecipe<BarnResponse> = {
    url: getApiUrlByResourceType(ResourceType.BARN),
    typeguard: isBarnResponse,
};
