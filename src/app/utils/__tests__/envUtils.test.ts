import { appIsRunningInDevEnvironment, getEnvironmentVariable } from '../envUtils';

describe('envUtils', () => {
    describe('getEnvironmentVariable', () => {
        it('should get environment variables from window.appSettings object from provided property name', () => {
            (window as any).appSettings = { someEnvVar: 1, someOtherEnvVar: 2 };
            expect(getEnvironmentVariable('someEnvVar')).toBe(1);
            expect(getEnvironmentVariable('someOtherEnvVar')).toBe(2);
        });
    });

    describe('appIsRunningInDevEnvironment', () => {
        it('should return true if process.env.NODE_ENV === "development"', () => {
            (process as any).env = { NODE_ENV: 'development' };
            expect(appIsRunningInDevEnvironment()).toBe(true);
        });

        it('should return false if process.env.NODE_ENV is set to something else than "development"', () => {
            (process as any).env = { NODE_ENV: undefined };
            expect(appIsRunningInDevEnvironment()).toBe(false);
            (process as any).env = { NODE_ENV: 'production' };
            expect(appIsRunningInDevEnvironment()).toBe(false);
        });
    });
});
