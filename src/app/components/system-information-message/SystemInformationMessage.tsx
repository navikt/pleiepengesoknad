import * as React from 'react';
import './systemInformationMessage.less';

interface SystemInformationMessageProps {
    message: string;
}

const SystemInformationMessage: React.FunctionComponent<SystemInformationMessageProps> = ({ message }) => (
    <div className="systemInformationMessage">{message}</div>
);

export default SystemInformationMessage;
