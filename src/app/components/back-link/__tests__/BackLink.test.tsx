import * as React from 'react';
import BackLink from '../BackLink';
import { render, fireEvent } from 'react-testing-library';
import { MemoryRouter } from 'react-router';
import * as historyMockFns from '../../../../../__mocks__/history';

const hrefLocation = 'hrefLocation';
const renderWrappedInMemoryRouter = (child: React.ReactNode) => render(<MemoryRouter>{child}</MemoryRouter>);

describe('<BackLink />', () => {
    it('should show a link with text "Tilbake" and href specified from props', () => {
        const { container, getByText } = renderWrappedInMemoryRouter(<BackLink href={hrefLocation} />);
        expect(getByText('Tilbake')).toBeTruthy();
        expect(container.querySelector(`a[href='${hrefLocation}']`)).toBeTruthy();
    });

    it('should navigate user to specified href when link is clicked and no custom onClick handler is provided', () => {
        const { getByText } = renderWrappedInMemoryRouter(<BackLink href={hrefLocation} />);
        fireEvent.click(getByText('Tilbake'));
        expect(historyMockFns.historyMock.push).toHaveBeenCalledWith(hrefLocation);
    });
});
