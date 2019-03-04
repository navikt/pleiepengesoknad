import * as React from 'react';
import { cleanup, render, waitForElement, wait } from 'react-testing-library';
import AppEssentialsLoader from '../AppEssentialsLoader';
import * as api from './../../../api/api';
import * as apiUtils from './../../../utils/apiUtils';
import routeConfig from '../../../config/routeConfig';
import Mock = jest.Mock;

jest.mock('./../../../utils/envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar'
    };
});

jest.mock('./../../../api/api', () => {
    return {
        getBarn: jest.fn().mockResolvedValue('barndata'),
        getSøker: jest.fn().mockResolvedValue('søkerdata')
    };
});

jest.mock('./../../../utils/apiUtils', () => {
    return {
        isForbidden: jest.fn(() => false),
        isUnauthorized: jest.fn(() => false)
    };
});

describe('<AppEssentialsLoader />', () => {
    beforeEach(() => {
        window.location.assign = jest.fn();
    });

    it('should show user a loading spinner initially', () => {
        const { getByTestId } = render(<AppEssentialsLoader contentLoadedRenderer={() => null} />);
        expect(getByTestId('spinner-element')).toBeTruthy();
    });

    it('should replace the loading spinner with contentRenderer() return value when getBarn and getSøker has resolved', async () => {
        const stringContent = 'Some string content';
        const contentRenderer = () => <p>{stringContent}</p>;
        const { getByText, queryByTestId } = render(<AppEssentialsLoader contentLoadedRenderer={contentRenderer} />);
        expect(queryByTestId('spinner-element')).toBeTruthy();
        expect(api.getBarn).toHaveBeenCalled();
        expect(api.getBarn).toHaveBeenCalled();
        await waitForElement(() => getByText(stringContent));
        expect(getByText(stringContent)).toBeTruthy();
        expect(queryByTestId('spinner-element')).toBeNull();
    });

    it('should redirect the user to an error page if getBarn or getSøker failed, but user is logged in', async () => {
        (api.getBarn as any) = jest.fn().mockRejectedValue('reject');
        render(<AppEssentialsLoader contentLoadedRenderer={() => null} />);
        await wait();
        expect(window.location.assign).toHaveBeenCalledWith(routeConfig.ERROR_PAGE_ROUTE);
        (api.getSøker as any) = jest.fn().mockRejectedValue('reject');
        render(<AppEssentialsLoader contentLoadedRenderer={() => null} />);
        await wait();
        expect(window.location.assign).toHaveBeenCalledWith(routeConfig.ERROR_PAGE_ROUTE);
    });

    it('should redirect the user to LOGIN_URL if getBarn or getSøker responds with forbidden or unauthorized', async () => {
        (apiUtils.isForbidden as Mock).mockImplementationOnce(() => true);
        render(<AppEssentialsLoader contentLoadedRenderer={() => null} />);
        await wait();
        expect(window.location.assign).toHaveBeenCalledWith('someEnvVar');
        (apiUtils.isUnauthorized as Mock).mockImplementationOnce(() => true);
        render(<AppEssentialsLoader contentLoadedRenderer={() => null} />);
        await wait();
        expect(window.location.assign).toHaveBeenCalledWith('someEnvVar');
    });

    afterAll(cleanup);
});
