import * as React from 'react';

interface ContentSwitcherProps {
    firstContent: () => React.ReactElement<any>;
    secondContent: () => React.ReactElement<any>;
    showFirstContent: boolean;
    noSpan?: boolean;
    className?: string;
}

const ContentSwitcher: React.FunctionComponent<ContentSwitcherProps> = ({
    firstContent,
    secondContent,
    className,
    showFirstContent,
    noSpan
}) => {
    const wrapContent = (children: React.ReactNode) => <span className={className}>{children}</span>;
    if (showFirstContent) {
        return noSpan ? firstContent() : wrapContent(firstContent());
    }
    return noSpan ? secondContent() : wrapContent(secondContent());
};

export default ContentSwitcher;
