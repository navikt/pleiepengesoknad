import * as React from 'react';
import { shallow } from 'enzyme';
import InformationMessage from '../InformationMessage';

const message = 'Some message';

describe('<InformationMessage />', () => {
    it('renders a document title and children specified from props', () => {
        const informationMessage = shallow(<InformationMessage message={message} />);
        const messageEl = informationMessage.find('div.informationMessage');
        expect(messageEl).toHaveLength(1);
        expect(messageEl.children().contains(message)).toBe(true);
    });
});
