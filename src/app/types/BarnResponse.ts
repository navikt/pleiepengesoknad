import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';
import { isString } from '@sif-common/core/utils/typeGuardUtils';
import { isDate } from 'moment';
import { apiStringDateToDate } from '@sif-common/core/utils/dateUtils';
import { FetchRecipe } from '../utils/fetcher/types';

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

export const barnResponseRecipe: FetchRecipe<BarnResponse> = {
    url: getApiUrlByResourceType(ResourceType.BARN),
    typeguard: isBarnResponse,
};
