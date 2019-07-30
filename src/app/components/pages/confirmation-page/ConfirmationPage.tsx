import * as React from 'react';
import Page from '../../page/Page';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from '../../box/Box';
import bemUtils from '../../../utils/bemUtils';
import Lenke from 'nav-frontend-lenker';
import CheckmarkIcon from '../../checkmark-icon/CheckmarkIcon';
import './confirmationPage.less';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Lenker from 'app/lenker';
import intlHelper from 'app/utils/intlUtils';

type Props = InjectedIntlProps;

const bem = bemUtils('confirmationPage');
const ConfirmationPage: React.FunctionComponent<Props> = ({ intl }) => (
    <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.className}>
        <div className={bem.element('centeredContent')}>
            <CheckmarkIcon />
            <Box margin="xl">
                <Innholdstittel>
                    <FormattedMessage id="page.confirmation.tittel" />
                </Innholdstittel>
            </Box>
        </div>

        <Box margin="xl">
            <Ingress>
                <FormattedMessage id="page.confirmation.part1" />
            </Ingress>
            <Box margin="l">
                <Ingress>
                    <FormattedMessage id="page.confirmation.part2" />{' '}
                    <Lenke href={Lenker.saksbehandlingstider} target="_blank">
                        <FormattedMessage id="page.confirmation.saksbehandlingstid" />
                    </Lenke>
                    .
                </Ingress>
            </Box>
        </Box>
    </Page>
);

export default injectIntl(ConfirmationPage);
