import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { useIntl } from 'react-intl';

const FrilansEksempeltHtml = () => {
    const intl = useIntl();
    return (
        <>
            {intlHelper(intl, 'frilanser.hjelpetekst.titel')}
            <ul>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.1')}</li>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.2')}</li>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.3')}</li>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.4')}</li>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.5')}</li>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.6')}</li>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.7')}</li>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.8')}</li>
                <li>{intlHelper(intl, 'frilanser.hjelpetekst.list.9')}</li>
            </ul>
            {intlHelper(intl, 'frilanser.hjelpetekst')}
        </>
    );
};

export default FrilansEksempeltHtml;
