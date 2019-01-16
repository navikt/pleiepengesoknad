import { AxiosError } from 'axios';
import { isForbidden, isUnauthorized } from '../apiHelper';

let axiosErrorMock: AxiosError;

jest.mock('./../envHelper.ts', () => {
    return { getEnvironmentVariable: () => 'mockedApiUrl' };
});

describe('apiHelper', () => {
    beforeEach(() => {
        axiosErrorMock = {
            config: {},
            name: '',
            message: '',
            response: { status: 200, data: {}, statusText: '', headers: [], config: {} }
        };
    });

    describe('isForbidden', () => {
        it('should return true if response.status is 403', () => {
            axiosErrorMock.response!.status = 403;
            expect(isForbidden(axiosErrorMock)).toBe(true);
        });

        it('should return false if response status is not 403', () => {
            axiosErrorMock.response!.status = 200;
            expect(isForbidden(axiosErrorMock)).toBe(false);
            axiosErrorMock.response = undefined;
            expect(isForbidden(axiosErrorMock)).toBe(false);
        });
    });

    describe('isUnauthorized', () => {
        it('should return true if response.status is 401', () => {
            axiosErrorMock.response!.status = 401;
            expect(isUnauthorized(axiosErrorMock)).toBe(true);
        });

        it('should return false if response status is not 401', () => {
            axiosErrorMock.response!.status = 200;
            expect(isUnauthorized(axiosErrorMock)).toBe(false);
            axiosErrorMock.response = undefined;
            expect(isUnauthorized(axiosErrorMock)).toBe(false);
        });
    });
});
