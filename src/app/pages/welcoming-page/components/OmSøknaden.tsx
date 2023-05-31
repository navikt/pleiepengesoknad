import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import ExpandableInfo from '@navikt/sif-common-core-ds/lib/components/expandable-info/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import BehandlingAvPersonopplysningerContent from './BehandlingAvPersonopplysningerContent';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import { Heading } from '@navikt/ds-react';

const OmSøknaden = () => {
    const intl = useIntl();
    return (
        <Block margin="xl">
            <Heading level="2" size="medium">
                <FormattedMessage id="page.velkommen.omSøknaden.tittel" />
            </Heading>

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
        </Block>
    );
};

export default OmSøknaden;
