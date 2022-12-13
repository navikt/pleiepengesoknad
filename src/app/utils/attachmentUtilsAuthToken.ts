import { getEnvironmentVariable } from './envUtils';

export const getAttachmentURLFrontend = (url: string): string => {
    return url.replace(getEnvironmentVariable('API_URL'), getEnvironmentVariable('FRONTEND_VEDLEGG_URL'));
};

export const getAttachmentURLBackend = (url?: string): string => {
    if (url !== undefined) {
        return url.replace(getEnvironmentVariable('FRONTEND_VEDLEGG_URL'), getEnvironmentVariable('API_URL'));
    }
    return '';
};
