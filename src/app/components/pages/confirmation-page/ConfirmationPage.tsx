import * as React from 'react';
import Page from '../../page/Page';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from '../../box/Box';
import bemUtils from '../../../utils/bemUtils';
import Lenke from 'nav-frontend-lenker';
import CheckmarkIcon from '../../checkmark-icon/CheckmarkIcon';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';
import getLenker from 'app/lenker';
import './confirmationPage.less';

type Props = InjectedIntlProps;

const bem = bemUtils('confirmationPage');
const ConfirmationPage: React.FunctionComponent<Props> = ({ intl }) => (
    <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.block}>
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
                    <Lenke href={getLenker(intl.locale).saksbehandlingstider} target="_blank">
                        <FormattedMessage id="page.confirmation.saksbehandlingstid" />
                    </Lenke>
                    .
                </Ingress>
            </Box>
        </Box>
    </Page>
);

export default injectIntl(ConfirmationPage);
