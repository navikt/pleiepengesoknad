import * as React from 'react';
import { FunctionComponent } from 'react';
import DocumentTitle from 'react-document-title';

interface PageProps {
    title: string;
}

const Page: FunctionComponent<PageProps> = ({ title, children }) => (
    <React.Fragment>
        <DocumentTitle title={title}>
            <div className="site">{children}</div>
        </DocumentTitle>
    </React.Fragment>
);

export default Page;
