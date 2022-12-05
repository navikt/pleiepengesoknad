import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Lenke from 'nav-frontend-lenker';
import { Ingress, Element } from 'nav-frontend-typografi';
import getLenker from '../../../lenker';
import InfoList from './info-list/InfoList';

const BehandlingAvPersonopplysningerContent: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <>
            <Ingress tag="h3">
                <FormattedMessage id="personopplysninger.1" />
            </Ingress>
            <p>
                <FormattedMessage id="personopplysninger.2" />
            </p>
            <Box margin="l">
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
                    <FormattedMessage id="personopplysninger.5" />
                </p>
            </Box>

            <Box margin="l">
                <Element tag="h3">
                    <FormattedMessage id="personopplysninger.6" />
                </Element>
                <p>
                    <FormattedMessage id="personopplysninger.7" />
                </p>
                <InfoList>
                    <li>
                        <FormattedMessage id="personopplysninger.7.1" />
                    </li>
                    <li>
                        <FormattedMessage id="personopplysninger.7.2" />
                    </li>
                    <li>
                        <FormattedMessage id="personopplysninger.7.3" />
                    </li>
                </InfoList>
            </Box>
            <Box margin="l">
                <p>
                    <FormattedMessage id="personopplysninger.8.1" />
                    {` `}
                    <Lenke href={getLenker(intl.locale).personvern} target="_blank">
                        <FormattedMessage id="personopplysninger.8.2" />
                    </Lenke>
                    <FormattedMessage id="personopplysninger.8.3" />
                </p>
            </Box>
        </>
    );
};

export default BehandlingAvPersonopplysningerContent;
