import { getEnvironmentVariable } from './envUtils';

export const isDemoMode = (): boolean => {
    return getEnvironmentVariable('DEMO_MODE') === 'true';
};
