import * as React from 'react';
import { shallow } from 'enzyme';
import LoadingSpinner from '../LoadingSpinner';
import NavFrontendSpinner from 'nav-frontend-spinner';

describe('<LoadingSpinner />', () => {
    it('renders a <Spinner /> component with the specified size', () => {
        const loadingSpinner = shallow(<LoadingSpinner type="XXL" />);
        const el = loadingSpinner.find(NavFrontendSpinner);
        expect(el).toHaveLength(1);
        expect(el.props().type).toEqual('XXL');
    });
});
