import axios from 'axios';
import axiosConfig from '../../config/axiosConfig';
import { StepID } from '../../søknad/søknadStepsConfig';
import { ResourceType } from '../../types/ResourceType';
import { axiosJsonConfig, getApiUrlByResourceType, sendMultipartPostRequest } from '../../utils/apiUtils';
import {
    deleteFile,
    getArbeidsgiver,
    getBarn,
    getPersistUrl,
    getSøker,
    persist,
    sendApplication,
    uploadFile,
} from '../api';

const mockedApiUrl = 'nav.no/api';
jest.mock('./../../utils/apiUtils', () => {
    return {
        getApiUrlByResourceType: jest.fn(() => mockedApiUrl),
        sendMultipartPostRequest: jest.fn(),
    };
});

jest.mock('./../../utils/featureToggleUtils', () => {
    return {
        isFeatureEnabled: jest.fn(() => false),
        Feature: {},
    };
});

describe('api', () => {
    describe('getBarn', () => {
        it('should call axios.get with correct URL and axios config', () => {
            getBarn();
            expect(axios.get).toHaveBeenCalledWith(getApiUrlByResourceType(ResourceType.BARN), axiosJsonConfig);
        });
    });

    describe('getSøker', () => {
        it('should call axios.get with correct URL and axios config', () => {
            getSøker();
            expect(axios.get).toHaveBeenCalledWith(getApiUrlByResourceType(ResourceType.SØKER), axiosJsonConfig);
        });
    });

    describe('getArbeidsgiver', () => {
        it('should call axios.get with correct URL and axios config', () => {
            const date1 = 'some date';
            const date2 = 'some other date';
            getArbeidsgiver(date1, date2);
            const url = `${getApiUrlByResourceType(ResourceType.SØKER)}?fra_og_med=${date1}&til_og_med=${date2}`;
            expect(axios.get).toHaveBeenCalledWith(url, axiosJsonConfig);
        });
    });

    describe('sendApplication', () => {
        it('should call axios.post with correct URL, specified api data and axios config', () => {
            const data = {} as any;
            sendApplication(data);
            expect(axios.post).toHaveBeenCalledWith(
                getApiUrlByResourceType(ResourceType.SEND_SØKNAD),
                data,
                axiosJsonConfig
            );
        });
    });

    describe('uploadFile', () => {
        it('should send a multipart request with the specified file in a FormData object', () => {
            const fileMock = new File([''], 'filename', { type: 'text/png' });
            uploadFile(fileMock);
            expect(sendMultipartPostRequest).toHaveBeenCalled();
        });
    });

    describe('deleteFile', () => {
        it('should call axios.delete on the specified url', () => {
            deleteFile(mockedApiUrl);
            expect(axios.delete).toHaveBeenCalledWith(mockedApiUrl, axiosConfig);
        });
    });

    describe('mellomlagring', () => {
        const stepId: StepID = 'fakeStepID' as any;
        const persistApiUrl = getPersistUrl(stepId);
        it('should call axios.post when no formData', () => {
            persist(undefined, stepId);
            expect(axios.post).toHaveBeenCalledWith(persistApiUrl, {}, axiosJsonConfig);
        });
    });
});
