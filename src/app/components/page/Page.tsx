import * as React from 'react';
import DocumentTitle from 'react-document-title';
import SystemInformationMessage from '../system-information-message/SystemInformationMessage';
import './page.less';

interface PageProps {
    className?: string;
    title: string;
    topContentRenderer?: () => React.ReactElement<any>;
}

class Page extends React.Component<PageProps> {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { className, title, topContentRenderer, children } = this.props;
        return (
            <DocumentTitle title={title}>
                <>
                    <SystemInformationMessage message="Denne siden er under utvikling" />
                    {topContentRenderer && topContentRenderer()}
                    <div className={`page ${className}`}>{children}</div>
                </>
            </DocumentTitle>
        );
    }
}

export default Page;
