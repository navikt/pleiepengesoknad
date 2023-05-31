import React from 'react';
import { FormattedMessage } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import Lenke from 'nav-frontend-lenker';
import { Ingress, Element } from 'nav-frontend-typografi';
import getLenker from '../../../lenker';
import InfoList from './info-list/InfoList';

const BehandlingAvPersonopplysningerContent: React.FunctionComponent = () => {
    return (
        <>
            <Ingress tag="h3">
                <FormattedMessage id="personopplysninger.1" />
            </Ingress>
            <p>
                <FormattedMessage id="personopplysninger.2" />
            </p>
            <Block margin="l">
                <Element tag="h3">
                    <FormattedMessage id="personopplysninger.3" />
                </Element>
                <p>
                    <FormattedMessage id="personopplysninger.4" />
                </p>
                <InfoList>
                    <li>
                        <FormattedMessage id="personopplysninger.4.1" />
                    </li>
                    <li>
                        <FormattedMessage id="personopplysninger.4.2" />
                    </li>
                    <li>
                        <FormattedMessage id="personopplysninger.4.3" />
                    </li>
                    <li>
                        <FormattedMessage id="personopplysninger.4.4" />
                    </li>
                    <li>
                        <FormattedMessage id="personopplysninger.4.5" />
                    </li>
                    <li>
                        <FormattedMessage id="personopplysninger.4.6" />
                    </li>
                </InfoList>
                <p>
                    <FormattedMessage id="personopplysninger.4b" />
                </p>
            </Block>

            <Block>
                <FormattedMessage id="personopplysninger.5.1" />
                <Lenke href={getLenker().personvern} target="_blank">
                    <FormattedMessage id="personopplysninger.5.2" />
                </Lenke>
                <FormattedMessage id="personopplysninger.5.3" />
            </Block>
        </>
    );
};

export default BehandlingAvPersonopplysningerContent;
