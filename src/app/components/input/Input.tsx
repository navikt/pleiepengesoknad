import * as React from 'react';
import { Input as NAVInput, NavFrontendInputProps as NAVInputProps } from 'nav-frontend-skjema';

const Input = (props: NAVInputProps) => <NAVInput {...props} autoComplete="off" />;

export default Input;
