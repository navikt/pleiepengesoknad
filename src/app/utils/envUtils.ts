import { isFeatureEnabled, Feature } from './featureToggleUtils';

export const getEnvironmentVariable = (variableName: string) => (window as any).appSettings[variableName];

export const appIsRunningInDevEnvironment = () => process.env.NODE_ENV === 'development';

export const appIsRunningInDemoMode = () => isFeatureEnabled(Feature.DEMO_MODE);
