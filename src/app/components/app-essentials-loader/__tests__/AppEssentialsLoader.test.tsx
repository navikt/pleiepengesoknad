import * as React from 'react';
import { cleanup, render, waitForElement } from 'react-testing-library';
import AppEssentialsLoader from '../AppEssentialsLoader';

jest.mock('./../../../utils/envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar'
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

describe('<AppEssentialsLoader />', () => {
    beforeEach(() => {
        window.scroll = jest.fn();
        window.location.assign = jest.fn();
    });

    it('should show user a loading spinner initially', () => {
        const { getByTestId } = render(<AppEssentialsLoader contentLoadedRenderer={() => null} />);
        expect(getByTestId('spinner-element')).toBeTruthy();
    });

    it('should replace the loading spinner with contentRenderer() return value when getSøker has resolved', async () => {
        const stringContent = 'Some string content';
        const contentRenderer = () => <p>{stringContent}</p>;
        const { getByText, queryByTestId } = render(<AppEssentialsLoader contentLoadedRenderer={contentRenderer} />);
        expect(queryByTestId('spinner-element')).toBeTruthy();
        await waitForElement(() => getByText(stringContent));
        expect(getByText(stringContent)).toBeTruthy();
        expect(queryByTestId('spinner-element')).toBeNull();
    });

    afterAll(cleanup);
});
