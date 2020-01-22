import * as React from 'react';
import { cleanup, render, waitForElement } from '@testing-library/react';
import AppEssentialsLoader from '../AppEssentialsLoader';
import IntlProvider from '../../../components/intl-provider/IntlProvider';

jest.mock('./../../../utils/envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
        appIsRunningInDemoMode: () => false
    };
});

jest.mock('./../../../utils/featureToggleUtils', () => {
    return {
        isFeatureEnabled: () => false,
        Feature: {}
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

const renderWrappedInIntlProvider = (child: React.ReactNode) =>
    render(
        <IntlProvider locale="nb" onError={() => null}>
            {child}
        </IntlProvider>
    );

describe('<AppEssentialsLoader />', () => {
    beforeEach(() => {
        window.scroll = jest.fn();
        window.location.assign = jest.fn();
    });

    it('should show user a loading spinner initially and should then replace the loading spinner with contentRenderer() return value when getSøker has resolved', async () => {
        const stringContent = 'Some string content';
        const contentRenderer = () => <p>{stringContent}</p>;
        const { getByText, queryByTestId } = renderWrappedInIntlProvider(
            <AppEssentialsLoader contentLoadedRenderer={contentRenderer} />
        );
        expect(queryByTestId('spinner-element')).toBeTruthy();
        await waitForElement(() => getByText(stringContent));
        expect(getByText(stringContent)).toBeTruthy();
        expect(queryByTestId('spinner-element')).toBeNull();
    });

    afterAll(cleanup);
});
