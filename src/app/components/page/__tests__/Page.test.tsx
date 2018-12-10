import * as React from 'react';
import DocumentTitle from 'react-document-title';
import { shallow } from 'enzyme';
import Page from '../Page';

const title = 'Some title';
const children = <div className="children">Child contents</div>;

describe('<Page />', () => {
    it('renders a document title and children specified from props', () => {
        const site = shallow(<Page title={title}>{children}</Page>);

        const documentTitleEl = site.find(DocumentTitle);
        expect(documentTitleEl).toHaveLength(1);
        expect(documentTitleEl.props().title).toEqual(title);

        const childrenEl = site.find('div.children');
        expect(childrenEl).toHaveLength(1);
        expect(childrenEl.children().contains('Child contents')).toBe(true);
    });
});
