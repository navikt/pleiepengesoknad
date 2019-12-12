import React from 'react';
import useDocumentTitle from 'common/hooks/useDocumentTitle';

interface DocumentTitleProps {
    title: string;
}

const DocumentTitle: React.FunctionComponent<DocumentTitleProps> = ({ title, children }) => {
    useDocumentTitle(title);
    return <>{children}</>;
};

export default DocumentTitle;
