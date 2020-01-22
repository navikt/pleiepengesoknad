import * as React from 'react';
import Step from '../Step';
import { cleanup, render, RenderResult } from '@testing-library/react';
import { StepID } from '../../../config/stepConfig';
import { MemoryRouter } from 'react-router';
import IntlProvider from '../../intl-provider/IntlProvider';
import { initialValues } from '../../../types/PleiepengesøknadFormData';

import { Formik } from 'formik';

jest.mock('../../../utils/featureToggleUtils', () => {
    return {
        isFeatureEnabled: () => false,
        Feature: {}
    };
});

const mock = jest.fn();

const renderWrappedInMemoryRouter = (child: React.ReactNode) => {
    return render(
        <IntlProvider locale="nb" onError={() => null}>
            <Formik initialValues={{ data: undefined }} onSubmit={mock}>
                <MemoryRouter>{child}</MemoryRouter>
            </Formik>
        </IntlProvider>
    );
};

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

    afterAll(cleanup);
});
