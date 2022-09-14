import axios from 'axios';
import { ResourceType } from '../../types';
import { axiosConfigPsb } from '../api';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../utils/apiUtils';

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};

export const deleteFile = (url: string) => axios.delete(url, axiosConfigPsb);
