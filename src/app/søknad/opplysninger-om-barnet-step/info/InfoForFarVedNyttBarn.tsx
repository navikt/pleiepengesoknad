import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core-ds/lib/components/expandable-info/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';

const InfoForFarVedNyttBarn = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'infoForFarVedNyttBarn.tittel')}>
            <p>
                <FormattedMessage id="infoForFarVedNyttBarn.info.1.1" />{' '}
                <Lenke href="https://farskapsportal.nav.no/nb/" target="_blank">
                    <FormattedMessage id="infoForFarVedNyttBarn.info.1.2" />
                </Lenke>
                <FormattedMessage id="infoForFarVedNyttBarn.info.1.3" />
            </p>
            <p>
                <FormattedMessage id="infoForFarVedNyttBarn.info.2" />
            </p>
        </ExpandableInfo>
    );
};
export default InfoForFarVedNyttBarn;
