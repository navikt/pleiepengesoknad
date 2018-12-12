import * as React from 'react';
import DocumentTitle from 'react-document-title';
import InformationMessage from '../information-message/InformationMessage';
import './page.less';

interface PageProps {
    className?: string;
    title: string;
}

const Page: React.FunctionComponent<PageProps> = ({ className, title, children }) => (
    <DocumentTitle title={title}>
        <>
            <InformationMessage message="Denne siden er under utvikling" />
            <div className={`page ${className}`}>{children}</div>
        </>
    </DocumentTitle>
);

export default Page;
