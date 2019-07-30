import * as React from 'react';
import Step from '../Step';
import { render, RenderResult } from 'react-testing-library';
import { stepConfig, StepID } from '../../../config/stepConfig';
import { MemoryRouter } from 'react-router';
import MockIntlProvider from '../../intl-provider/MockIntlProvider';

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
        renderResult = renderWrappedInMemoryRouter(<Step id={stepID} handleSubmit={handleSubmit} />);
    });

    it('should render common <Step> content', () => {
        const { getByText } = renderResult;
        expect(getByText('Søknad om pleiepenger')).toBeTruthy();
        expect(getByText(stepConfig[stepID].stepTitle)).toBeTruthy();
        expect(getByText(stepConfig[stepID].buttonLabel!)).toBeTruthy();
        expect(getByText('Tilbake')).toBeTruthy();
    });

    // it('should call handleSubmit-callback when submit-button is clicked', () => {
    //    (window as any).HTMLFormElement.prototype.submit = () => {};
    //    fireEvent.click(renderResult.container.querySelector('button[type="submit"]')!);
    //    expect(handleSubmit).toHaveBeenCalled();
    // });
});
