import * as React from 'react';
import './page.less';
import DocumentTitle from '../document-title/DocumentTitle';

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
                    {topContentRenderer && topContentRenderer()}
                    <div className={`page ${className}`}>{children}</div>
                </>
            </DocumentTitle>
        );
    }
}

export default Page;
