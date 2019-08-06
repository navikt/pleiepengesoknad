import * as React from 'react';
import Step from '../Step';
import { render, RenderResult } from 'react-testing-library';
import { StepID } from '../../../config/stepConfig';
import { MemoryRouter } from 'react-router';
import MockIntlProvider from '../../intl-provider/MockIntlProvider';

const renderWrappedInMemoryRouter = (child: React.ReactNode) =>
    render(
        <MockIntlProvider locale="nb">
            <MemoryRouter>{child}</MemoryRouter>
        </MockIntlProvider>
    );

const handleSubmit = jest.fn();

export const intlForTests = {
    formatMessage: jest.fn((a: any, b: any) => a + b)
};

describe('<Step>', () => {
    const stepID: StepID = StepID.OPPLYSNINGER_OM_BARNET;

    let renderResult: RenderResult;

    beforeAll(() => {
        renderResult = renderWrappedInMemoryRouter(<Step id={stepID} handleSubmit={handleSubmit} />);
    });

    it('should render common <Step> content', () => {
        const { getByText } = renderResult;
        expect(getByText('Søknad om pleiepenger')).toBeTruthy();
        expect(getByText('Barn')).toBeTruthy();
        expect(getByText('Fortsett')).toBeTruthy();
        expect(getByText('Tilbake')).toBeTruthy();
    });
});
