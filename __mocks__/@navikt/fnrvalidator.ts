export enum FødselsnummerMockedValidity {
    VALID = 'valid',
    INVALID = 'invalid'
}

export const fnr = jest.fn((value: FødselsnummerMockedValidity) => {
    if (value === FødselsnummerMockedValidity.VALID) {
        return {
            status: FødselsnummerMockedValidity.VALID,
            reasons: []
        };
    } else {
        return {
            status: FødselsnummerMockedValidity.INVALID,
            reasons: ['reason']
        };
    }
});
