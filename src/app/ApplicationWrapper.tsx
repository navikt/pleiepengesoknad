import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const ApplicationWrapper: React.FunctionComponent = ({ children }) => <Router>{children}</Router>;

export default ApplicationWrapper;
