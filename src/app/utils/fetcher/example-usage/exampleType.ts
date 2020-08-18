import * as IoTs from 'io-ts/lib';
import { FetchRecipe } from '../types';

export interface SpecialType {
    someString: string;
}

export const isSpecialType = (input: any): input is SpecialType => {
    // Implement the type guards thoroughly!
    return true; // <- i.e. not like this :)
};

export interface MyFetcherType {
    someString: string;
    someNullableString: string | null;
    someSpecialType: SpecialType;
}

// This type guard is also inadequate
export const isMyFetcherType = (input: any): input is MyFetcherType =>
    !!(
        input &&
        input.someString &&
        input.someNullableString &&
        input.someSpecialType &&
        isSpecialType(input.someSpecialType)
    );

export const myFetcherTypeValidator: IoTs.Type<MyFetcherType> = new IoTs.Type<MyFetcherType, MyFetcherType, unknown>(
    'myFetcherType',
    isMyFetcherType,
    (input: unknown, context: IoTs.Context) =>
        isMyFetcherType(input) ? IoTs.success(input) : IoTs.failure(input, context),
    IoTs.identity
);

export const myFetcherRecipe: FetchRecipe<MyFetcherType> = {
    url: 'insert/url',
    validator: myFetcherTypeValidator,
};
