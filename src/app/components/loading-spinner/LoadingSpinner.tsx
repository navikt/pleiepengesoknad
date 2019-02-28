import * as React from 'react';
import Spinner, { NavFrontendSpinnerBaseProps as LoadingSpinnerProps } from 'nav-frontend-spinner';

const LoadingSpinner: React.FunctionComponent<LoadingSpinnerProps> = ({ type }) => (
    <Spinner type={type} data-testid="spinner-element" />
);

export default LoadingSpinner;
