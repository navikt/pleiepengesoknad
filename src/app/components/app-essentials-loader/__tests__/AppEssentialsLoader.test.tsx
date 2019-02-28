import * as React from 'react';
import { cleanup, render, waitForElement } from 'react-testing-library';
import AppEssentialsLoader from '../AppEssentialsLoader';
import * as api from './../../../api/api';

jest.mock('./../../../utils/envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVarValue'
    };
});

jest.mock('./../../../api/api', () => {
    return {
        getBarn: jest.fn().mockResolvedValue('barndata'),
        getSøker: jest.fn().mockResolvedValue('søkerdata')
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
        expect(queryByTestId('spinner-element')).not.toBeNull();
        expect(api.getBarn).toHaveBeenCalled();
        expect(api.getBarn).toHaveBeenCalled();
        await waitForElement(() => getByText(stringContent));
        expect(getByText(stringContent)).toBeTruthy();
        expect(queryByTestId('spinner-element')).toBeNull();
    });

    afterAll(cleanup);
});
