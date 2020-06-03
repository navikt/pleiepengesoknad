export const getEnvironmentVariable = (variableName: string) => (window as any).appSettings[variableName];

export const appIsRunningInDevEnvironment = () => process.env.NODE_ENV === 'development';
