import * as React from 'react';
import BackLink from '../BackLink';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as historyMockFns from '../../../../../__mocks__/history';
import MockIntlProvider from '../../intl-provider/MockIntlProvider';

const hrefLocation = 'hrefLocation';

const renderWrappedInMemoryRouter = (child: React.ReactNode) =>
    render(
        <MockIntlProvider locale="nb">
            <MemoryRouter>{child}</MemoryRouter>
        </MockIntlProvider>
    );

describe('<BackLink />', () => {
    it('should show a link with text "Tilbake" and href specified from props', () => {
        const { container, getByText } = renderWrappedInMemoryRouter(<BackLink href={hrefLocation} />);
        expect(getByText('Tilbake')).toBeTruthy();
        expect(container.querySelector(`a[href='${hrefLocation}']`)).toBeTruthy();
    });

    it('should navigate user to specified href when link is clicked and no custom onClick handler is provided', () => {
        const { container } = renderWrappedInMemoryRouter(<BackLink href={hrefLocation} />);
        fireEvent.click(container.querySelector('div')!);
        expect(historyMockFns.historyMock.push).toHaveBeenCalledWith(hrefLocation);
    });

    it('should call custom onClick handler if it has been specified', () => {
        const onClick = jest.fn();
        const { container } = renderWrappedInMemoryRouter(<BackLink href={hrefLocation} onClick={onClick} />);
        fireEvent.click(container.querySelector('div')!);
        expect(onClick).toHaveBeenCalled();
    });
});
