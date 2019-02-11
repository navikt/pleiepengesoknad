import * as React from 'react';

interface ContentSwitcherProps {
    initialContent: () => React.ReactElement<any>;
    otherContent: () => React.ReactElement<any>;
    showInitialContent: boolean;
    className?: string;
}

const ContentSwitcher: React.FunctionComponent<ContentSwitcherProps> = ({
    initialContent,
    otherContent,
    className,
    showInitialContent
}) => {
    const wrapContent = (children: React.ReactNode) => <span className={className}>{children}</span>;
    if (showInitialContent) {
        return wrapContent(initialContent());
    }
    return wrapContent(otherContent());
};

export default ContentSwitcher;
