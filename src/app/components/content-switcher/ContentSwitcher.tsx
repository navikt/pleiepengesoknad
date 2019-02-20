import * as React from 'react';

interface ContentSwitcherProps {
    firstContent: () => React.ReactNode | React.ReactChild;
    secondContent: () => React.ReactNode | React.ReactChild;
    showFirstContent: boolean;
    className?: string;
}

const ContentSwitcher: React.FunctionComponent<ContentSwitcherProps> = ({
    firstContent,
    secondContent,
    className,
    showFirstContent
}) => {
    const wrapContent = (children: React.ReactNode) => <span className={className}>{children}</span>;
    if (showFirstContent) {
        return wrapContent(firstContent());
    }
    return wrapContent(secondContent());
};

export default ContentSwitcher;
