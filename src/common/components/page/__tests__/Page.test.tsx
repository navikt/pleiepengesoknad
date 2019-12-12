import * as React from 'react';
import { shallow } from 'enzyme';
import Page from '../Page';
import DocumentTitle from 'common/components/document-title/DocumentTitle';

const title = 'Some title';
const children = <div className="children">Child contents</div>;

describe('<Page />', () => {
    it('renders a document title and children specified from props', () => {
        const page = shallow(<Page title={title}>{children}</Page>);

        const documentTitleEl = page.find(DocumentTitle);
        expect(documentTitleEl).toHaveLength(1);
        expect(documentTitleEl.props().title).toEqual(title);

        const childrenEl = page.find('div.children');
        expect(childrenEl).toHaveLength(1);
        expect(childrenEl.children().contains('Child contents')).toBe(true);
    });

    it('should add classes specified in className-prop to page-div', () => {
        const page = shallow(
            <Page title={title} className="testPage">
                {children}
            </Page>
        );
        expect(page.find('div.page').hasClass('page')).toBe(true);
        expect(page.find('div.page').hasClass('testPage')).toBe(true);
    });
});
