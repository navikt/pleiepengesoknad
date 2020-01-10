import * as React from 'react';
import Spinner, { NavFrontendSpinnerBaseProps as LoadingSpinnerProps } from 'nav-frontend-spinner';
import { Element } from 'nav-frontend-typografi';

interface OwnProps {
    style?: 'inline' | 'block';
    blockTitle?: string;
}

const LoadingSpinner: React.FunctionComponent<OwnProps & LoadingSpinnerProps> = ({
    type,
    style = 'inline',
    blockTitle
}) => {
    const spinner = <Spinner type={type} data-testid="spinner-element" />;
    if (style === 'inline') {
        return spinner;
    }
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '15rem',
                alignItems: 'center'
            }}>
            <LoadingSpinner type="XXL" />
            {blockTitle && <Element style={{ marginTop: '1rem' }}>{blockTitle}</Element>}
        </div>
    );
};

export default LoadingSpinner;
