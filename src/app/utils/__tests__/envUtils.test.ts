import { getEnvironmentVariable } from '../envUtils';

describe('envUtils', () => {
    describe('getEnvironmentVariable', () => {
        it('should get environment variables from window.appSettings object from provided property name', () => {
            (window as any).appSettings = { someEnvVar: 1, someOtherEnvVar: 2 };
            expect(getEnvironmentVariable('someEnvVar')).toBe(1);
            expect(getEnvironmentVariable('someOtherEnvVar')).toBe(2);
        });
    });
});
