import * as React from 'react';
import { shallow } from 'enzyme';
import SystemInformationMessage from '../SystemInformationMessage';

const message = 'Some message';

describe('<SystemInformationMessage />', () => {
    it('renders a document title and children specified from props', () => {
        const systemInformationMessage = shallow(<SystemInformationMessage message={message} />);
        const messageEl = systemInformationMessage.find('div.systemInformationMessage');
        expect(messageEl).toHaveLength(1);
        expect(messageEl.children().contains(message)).toBe(true);
    });
});
