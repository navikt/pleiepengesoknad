import { FetchRecipe } from './types';

export interface PersonResponse {
    firstname: string;
    maybeAddress: string | null;
}

// This type guard is also inadequate
export const isPersonResponse = (input: any): input is PersonResponse => !!(input && input.firstname);

export const personRecipe: FetchRecipe<PersonResponse> = {
    url: 'insert/url',
    typeguard: isPersonResponse,
};
