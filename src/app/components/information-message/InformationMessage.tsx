import * as React from 'react';
import './informationMessage.less';

interface InformationMessageProps {
    message: string;
}

const InformationMessage: React.FunctionComponent<InformationMessageProps> = ({ message }) => (
    <div className="informationMessage">{message}</div>
);

export default InformationMessage;
