import React from 'react';
import { useIntl } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';

interface Props {
    labelKey: string;
}

const bem = bemUtils('summaryLabelValue');

const IntlLabelValue: React.FunctionComponent<Props> = ({ labelKey: intlLabelKey, children }) => {
    const intl = useIntl();
    return (
        <div className={bem.block}>
            <span className={bem.element('label')}>{intlHelper(intl, intlLabelKey)}:</span>{' '}
            <span className={bem.element('value')}>{children}</span>
        </div>
    );
};

export default IntlLabelValue;
