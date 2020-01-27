import React from 'react';
import bemUtils from 'common/utils/bemUtils';
import StatusIkon, { StatusIconStatusKey } from '../status-icon/StatusIcon';
import { Element } from 'nav-frontend-typografi';

interface Props {
    image: React.ReactNode;
    status: StatusIconStatusKey;
    statusText: string;
    description: string;
}

const bem = bemUtils('pictureScanningGuide').child('example');

const PictureScanningExample: React.FunctionComponent<Props> = ({ image: image, status, statusText, description }) => (
    <div className={bem.block}>
        <div className={bem.element('image')}>{image}</div>
        <Element tag="div" className={bem.element('title')}>
            <span className={bem.element('statusIcon')} role="presentation">
                <StatusIkon status={status} />
            </span>
            {statusText}
        </Element>
        <div className={bem.element('description')}>{description}</div>
    </div>
);

export default PictureScanningExample;
