import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Undertittel } from 'nav-frontend-typografi';
import BehandlingAvPersonopplysningerContent from './BehandlingAvPersonopplysningerContent';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';

const OmSøknaden = () => {
    const intl = useIntl();
    return (
        <Box margin="xl">
            <Undertittel tag="h2">
                <FormattedMessage id="page.velkommen.omSøknaden.tittel" />
            </Undertittel>

            <FormattedMessage id="page.velkommen.omSøknaden.1" tagName="p" />
            <FormattedMessage id="page.velkommen.omSøknaden.fremoverITid" tagName="p" />
            <ExpandableInfo title={intlHelper(intl, 'page.velkommen.omSøknaden.endringer.tittel')}>
                <p>
                    <FormattedMessage id="page.velkommen.omSøknaden.endringer.tekst.1.a" />{' '}
                    <Lenke href={getLenker('nb').endringsmelding} target="_blank">
                        <FormattedMessage id="page.velkommen.omSøknaden.endringer.tekst.1.b" />
                    </Lenke>
                    <FormattedMessage id="page.velkommen.omSøknaden.endringer.tekst.1.c" />
                </p>
                <p>
                    <FormattedMessage id="page.velkommen.omSøknaden.endringer.tekst.2.a" />{' '}
                    <Lenke href={getLenker('nb').skrivTilOss} target="_blank">
                        <FormattedMessage id="page.velkommen.omSøknaden.endringer.tekst.2.b" />
                    </Lenke>
                    <FormattedMessage id="page.velkommen.omSøknaden.endringer.tekst.2.c" />
                </p>
            </ExpandableInfo>

            <FormattedMessage id="page.velkommen.omSøknaden.2" tagName="p" />
            <FormattedMessage id="page.velkommen.omSøknaden.3" tagName="p" />
            <ExpandableInfo title={intlHelper(intl, 'page.velkommen.omSøknaden.4')}>
                <BehandlingAvPersonopplysningerContent />
            </ExpandableInfo>
        </Box>
    );
};

export default OmSøknaden;
