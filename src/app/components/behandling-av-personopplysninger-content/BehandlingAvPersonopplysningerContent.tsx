import * as React from 'react';
import { Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import Box from '../box/Box';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import getLenker from 'app/lenker';
import './behandlingAvPersonopplysningerContent.less';

const getText = (part: string) => <FormattedMessage id={`modal.personalopplysninger.${part}`} />;

const BehandlingAvPersonopplysningerContent: React.FunctionComponent<InjectedIntlProps> = ({ intl }) => (
    <>
        <Systemtittel>{getText('tittel')}</Systemtittel>

        <Box margin="l">
            <Normaltekst>{getText('intro.1')}</Normaltekst>
            <Normaltekst>
                {getText('intro.2a')}{' '}
                <Lenke href={getLenker(intl.locale).vilkårPleiepenger} target="_blank">
                    {getText('intro.2b')}
                </Lenke>
                .
            </Normaltekst>
        </Box>

        <Box margin="xl">
            <Ingress>{getText('opplysninger.tittel')}</Ingress>
            <Normaltekst>{getText('opplysninger.part1')}</Normaltekst>
            <ul>
                <li>{getText('opplysninger.1')}</li>
                <li>{getText('opplysninger.2')}</li>
                <li>{getText('opplysninger.3')}</li>
                <li>{getText('opplysninger.4')}</li>
                <li>{getText('opplysninger.5')}</li>
            </ul>
            <Normaltekst>{getText('opplysninger.part2')}</Normaltekst>
        </Box>

        <Box margin="xl">
            <Ingress>{getText('svar.tittel')}</Ingress>
            <Normaltekst>{getText('svar.part1')}</Normaltekst>
            <ul>
                <li>{getText('svar.1')}</li>
                <li>{getText('svar.2')}</li>
                <li>{getText('svar.3')}</li>
            </ul>
        </Box>

        <Box margin="xl">
            <Ingress>{getText('personvern.tittel')}</Ingress>
            <Normaltekst>
                {getText('personvern.part1a')}{' '}
                <Lenke href={getLenker(intl.locale).personvern} target="_blank">
                    {getText('personvern.part1b')}
                </Lenke>
                .
            </Normaltekst>
        </Box>
    </>
);

export default injectIntl(BehandlingAvPersonopplysningerContent);
