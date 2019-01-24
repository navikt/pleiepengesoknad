import * as React from 'react';
import DocumentTitle from 'react-document-title';
import InformationMessage from '../information-message/InformationMessage';
import './page.less';
import ValidationErrorSummary from '../validation-error-summary/ValidationErrorSummary';

interface PageProps {
    className?: string;
    title: string;
}

const Page: React.FunctionComponent<PageProps> = ({ className, title, children }) => (
    <DocumentTitle title={title}>
        <>
            <ValidationErrorSummary
                show={true}
                errors={[{ name: 'harGodkjentVilkår', message: 'Error occured' }]}
                title="Title"
            />
            <InformationMessage message="Denne siden er under utvikling" />
            <div className={`page ${className}`}>{children}</div>
        </>
    </DocumentTitle>
);

export default Page;
