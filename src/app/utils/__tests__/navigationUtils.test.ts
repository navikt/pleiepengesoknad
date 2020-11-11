import { History } from 'history';
import routeConfig from '../../config/routeConfig';
import { navigateTo, navigateToErrorPage, userIsCurrentlyOnErrorPage } from '../navigationUtils';

const historyMock: Partial<History> = {
    push: jest.fn(),
};

jest.mock('./../envUtils.ts', () => {
    return { getEnvironmentVariable: () => '' };
});

// hacky workaround for this issue, which actually seems to be an issue
// with jsdom (not jest):
// https://github.com/facebook/jest/issues/5124
const setWindowLocationPathname = (pathname: string | undefined) => {
    const windowLocation = JSON.stringify(window.location);
    delete (window as any).location;
    Object.defineProperty(window, 'location', {
        value: { ...JSON.parse(windowLocation), pathname },
        configurable: true,
    });
};

describe('navigationUtils', () => {
    describe('navigateTo', () => {
        it('should navigate user to the provided route', () => {
            const route = '/someRoute';
            navigateTo(route, historyMock as History);
            expect(historyMock.push).toHaveBeenCalledWith(route);
        });
    });

    describe('navigateToErrorPage', () => {
        it('should navigate user to the path specified by routeConfig.ERROR_PAGE_ROUTE', () => {
            navigateToErrorPage(historyMock as History);
            expect(historyMock.push).toHaveBeenCalledWith(routeConfig.ERROR_PAGE_ROUTE);
        });
    });

    describe('userIsCurrentlyOnErrorPage', () => {
        it('should return true if current window.location.pathname is equal to routeConfig.ERROR_PAGE_ROUTE', () => {
            setWindowLocationPathname(routeConfig.ERROR_PAGE_ROUTE);
            expect(userIsCurrentlyOnErrorPage()).toBe(true);
        });

        it('should return false if current window.location.pathname is not equal to routeConfig.ERROR_PAGE_ROUTE', () => {
            setWindowLocationPathname(undefined);
            expect(userIsCurrentlyOnErrorPage()).toBe(false);
            setWindowLocationPathname('/foobar');
            expect(userIsCurrentlyOnErrorPage()).toBe(false);
        });
    });
});
