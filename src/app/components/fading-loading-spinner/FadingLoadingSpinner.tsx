import * as React from 'react';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import { NavFrontendSpinnerBaseProps as LoadingSpinnerProps } from 'nav-frontend-spinner';

interface FadingLoadingSpinnerProps {
    showSpinner: boolean;
    spinnerReplacement?: () => React.ReactElement<any>;
    className?: string;
}

type Props = FadingLoadingSpinnerProps & LoadingSpinnerProps;

const FadingLoadingSpinner: React.FunctionComponent<Props> = ({
    className,
    showSpinner,
    spinnerReplacement,
    ...spinnerProps
}) => {
    const wrapContent = (children: React.ReactNode) => <span className={className}>{children}</span>;

    if (showSpinner) {
        return wrapContent(<LoadingSpinner {...spinnerProps} />);
    }

    if (spinnerReplacement) {
        return wrapContent(spinnerReplacement());
    }

    return null;
};

export default FadingLoadingSpinner;
