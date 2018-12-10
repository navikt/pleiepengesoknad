import * as React from 'react';
import DocumentTitle from 'react-document-title';
import './page.less';

interface PageProps {
    title: string;
}

const Page: React.FunctionComponent<PageProps> = ({ title, children }) => (
    <React.Fragment>
        <DocumentTitle title={title}>
            <div className="page">{children}</div>
        </DocumentTitle>
    </React.Fragment>
);

export default Page;
