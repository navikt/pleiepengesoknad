import * as React from 'react';
import Step from '../Step';
import { render, RenderResult } from '@testing-library/react';
import { StepID } from '../../../config/stepConfig';
import { MemoryRouter } from 'react-router';
import MockIntlProvider from '../../intl-provider/MockIntlProvider';
import { initialValues } from '../../../types/PleiepengesøknadFormData';

jest.mock('../../../utils/featureToggleUtils', () => {
    return {
        isFeatureEnabled: () => false,
        Feature: {}
    };
});

const renderWrappedInMemoryRouter = (child: React.ReactNode) =>
    render(
        <MockIntlProvider locale="nb">
            <MemoryRouter>{child}</MemoryRouter>
        </MockIntlProvider>
    );

const handleSubmit = jest.fn();

describe('<Step>', () => {
    const stepID: StepID = StepID.OPPLYSNINGER_OM_BARNET;

    let renderResult: RenderResult;

    beforeAll(() => {
        renderResult = renderWrappedInMemoryRouter(
            <Step id={stepID} handleSubmit={handleSubmit} formValues={initialValues} />
        );
    });

    it('should render common <Step> content', () => {
        const { getByText } = renderResult;
        expect(getByText('Søknad om pleiepenger')).toBeTruthy();
        expect(getByText('Barn')).toBeTruthy();
        expect(getByText('Fortsett')).toBeTruthy();
        expect(getByText('Tilbake')).toBeTruthy();
    });
});
