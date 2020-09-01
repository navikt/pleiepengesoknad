import * as React from 'react';
import { AxiosError } from 'axios';
import { isForbidden, isUnauthorized } from '../apiUtils';
import { navigateToLoginPage } from '../navigationUtils';

interface Props {
    error: Error;
    onWillRedirect: () => JSX.Element;
    handleError: (error: Error) => JSX.Element;
}

export const hasResponseStatus = (value: any): value is AxiosError =>
    !!(value && value.response && value.response.status);

const RedirectIfUnauthorized: React.FC<Props> = ({ error, onWillRedirect, handleError }: Props): JSX.Element => {
    if (hasResponseStatus(error) && (isForbidden(error) || isUnauthorized(error))) {
        navigateToLoginPage();
        return onWillRedirect();
    } else {
        return handleError(error);
    }
};

export default RedirectIfUnauthorized;
