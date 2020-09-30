import { History } from 'history';
import { navigateTo } from '../navigationUtils';

const historyMock: Partial<History> = {
    push: jest.fn(),
};

jest.mock('./../envUtils.ts', () => {
    return { getEnvironmentVariable: () => '' };
});

describe('navigationUtils', () => {
    describe('navigateTo', () => {
        it('should navigate user to the provided route', () => {
            const route = '/someRoute';
            navigateTo(route, historyMock as History);
            expect(historyMock.push).toHaveBeenCalledWith(route);
        });
    });
});
