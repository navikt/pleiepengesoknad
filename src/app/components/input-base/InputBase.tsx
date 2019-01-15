import * as React from 'react';
import { Input as NAVInput, NavFrontendInputProps as NAVInputProps } from 'nav-frontend-skjema';

const InputBase = (props: NAVInputProps) => <NAVInput {...props} autoComplete="off" />;

export default InputBase;
