import axios from 'axios';
import axiosConfig from '../../config/axiosConfig';
import { StepID } from '../../config/stepConfig';
import { ResourceType } from '../../types/ResourceType';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../../utils/apiUtils';
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

describe('api', () => {
    describe('getBarn', () => {
        it('should call axios.get with correct URL and axios config', () => {
            getBarn();
            expect(axios.get).toHaveBeenCalledWith(getApiUrlByResourceType(ResourceType.BARN), axiosConfig);
        });
    });

    describe('getSøker', () => {
        it('should call axios.get with correct URL and axios config', () => {
            getSøker();
            expect(axios.get).toHaveBeenCalledWith(getApiUrlByResourceType(ResourceType.SØKER), axiosConfig);
        });
    });

    describe('getArbeidsgiver', () => {
        it('should call axios.get with correct URL and axios config', () => {
            const date1 = 'some date';
            const date2 = 'some other date';
            getArbeidsgiver(date1, date2);
            const url = `${getApiUrlByResourceType(ResourceType.SØKER)}?fra_og_med=${date1}&til_og_med=${date2}`;
            expect(axios.get).toHaveBeenCalledWith(url, axiosConfig);
        });
    });

    describe('sendApplication', () => {
        it('should call axios.post with correct URL, specified api data and axios config', () => {
            const data = {} as any;
            sendApplication(data);
            expect(axios.post).toHaveBeenCalledWith(
                getApiUrlByResourceType(ResourceType.SEND_SØKNAD),
                data,
                axiosConfig
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
            expect(axios.post).toHaveBeenCalledWith(persistApiUrl, {}, axiosConfig);
        });
        // it('should call axios.put when formData is defined', () => {
        //     persist({}, stepId);
        //     expect(axios.put).toHaveBeenCalledWith(persistApiUrl, {}, axiosConfig);
        // });
    });
});
