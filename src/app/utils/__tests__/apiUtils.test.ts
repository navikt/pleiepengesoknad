import axios, { AxiosError } from 'axios';
import {
    getApiUrlByResourceType,
    isForbidden,
    isUnauthorized,
    multipartConfig,
    sendMultipartPostRequest
} from '../apiUtils';
import { ResourceType } from '../../types/ResourceType';

let axiosErrorMock: AxiosError;

const mockedApiUrl = 'mockedApiUrl';
jest.mock('./../envUtils.ts', () => {
    return { getEnvironmentVariable: () => mockedApiUrl };
});

describe('apiUtils', () => {
    beforeEach(() => {
        axiosErrorMock = {
            config: {},
            isAxiosError: false,
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

    describe('sendMultipartPostRequest', () => {
        it('should use axios to send a multipart post request', () => {
            const formData = new FormData();
            formData.set('foo', 'bar');
            sendMultipartPostRequest('nav.no', formData);
            expect(axios.post).toHaveBeenCalledWith('nav.no', formData, multipartConfig);
        });
    });

    describe('getApiUrlByResourceType', () => {
        it('should return correct URL for ResourceType.ARBEIDSGIVER', () => {
            expect(getApiUrlByResourceType(ResourceType.ARBEIDSGIVER)).toEqual(
                `${mockedApiUrl}/${ResourceType.ARBEIDSGIVER}`
            );
        });

        it('should return correct URL for ResourceType.BARN', () => {
            expect(getApiUrlByResourceType(ResourceType.BARN)).toEqual(`${mockedApiUrl}/${ResourceType.BARN}`);
        });

        it('should return correct URL for ResourceType.SEND_SØKNAD', () => {
            expect(getApiUrlByResourceType(ResourceType.SEND_SØKNAD)).toEqual(
                `${mockedApiUrl}/${ResourceType.SEND_SØKNAD}`
            );
        });

        it('should return correct URL for ResourceType.SØKER', () => {
            expect(getApiUrlByResourceType(ResourceType.SØKER)).toEqual(`${mockedApiUrl}/${ResourceType.SØKER}`);
        });

        it('should return correct URL for ResourceType.VEDLEGG', () => {
            expect(getApiUrlByResourceType(ResourceType.VEDLEGG)).toEqual(`${mockedApiUrl}/${ResourceType.VEDLEGG}`);
        });
    });
});
