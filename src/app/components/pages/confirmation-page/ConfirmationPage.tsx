import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Innholdstittel, Normaltekst, Element } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CheckmarkIcon from '@navikt/sif-common-core/lib/components/checkmark-icon/CheckmarkIcon';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { KvitteringInfo } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import './confirmationPage.less';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';

interface Props {
    kvitteringInfo?: KvitteringInfo;
}

const bem = bemUtils('confirmationPage');

export const pluralize = (count: number, single: string, other: string) => (count === 1 ? single : other);

const ConfirmationPage = ({ kvitteringInfo }: Props) => {
    const intl = useIntl();

    const lenker = getLenker(intl.locale);

    useLogSidevisning(SIFCommonPageKey.kvittering);

    return (
        <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.block}>
            <div className={bem.element('centeredContent')}>
                <CheckmarkIcon />
                <Box margin="xl">
                    <Innholdstittel>
                        <FormattedMessage id="page.confirmation.tittel.1" />
                    </Innholdstittel>
                    <Innholdstittel tag="h2">
                        <FormattedMessage id="page.confirmation.tittel.2" />
                    </Innholdstittel>
                    <Innholdstittel tag="h2">
                        <FormattedMessage id="page.confirmation.tittel.3" />
                    </Innholdstittel>
                </Box>
            </div>
            {kvitteringInfo?.arbeidsforhold && (
                <Box margin="xl">
                    <AlertStripeAdvarsel>
                        {intlHelper(intl, 'page.confirmation.tittel.advarsel.list.tittel')}
                        <ul style={{ marginTop: '0rem' }}>
                            <li>
                                <FormattedMessage id="page.confirmation.tittel.advarsel.list.item.1" />
                            </li>
                            <li>
                                <FormattedMessage id="page.confirmation.tittel.advarsel.list.item.2" />
                            </li>
                        </ul>
                    </AlertStripeAdvarsel>
                </Box>
            )}

            <Box margin="xxl">
                <hr />
            </Box>

            <Box margin="xxl">
                <Element>
                    <FormattedHtmlMessage id="page.confirmation.dinePP.info.tittel" />
                </Element>
                <Normaltekst>
                    <FormattedMessage id="page.confirmation.dinePP.info.1" />
                </Normaltekst>
                <Normaltekst>
                    <FormattedMessage id="page.confirmation.dinePP.list.tittel" />
                </Normaltekst>

                <ul style={{ marginTop: '0rem' }}>
                    {kvitteringInfo?.arbeidsforhold && (
                        <li>
                            <FormattedMessage id="page.confirmation.dinePP.list.item.1" />
                        </li>
                    )}
                    <li>
                        <FormattedMessage id="page.confirmation.dinePP.list.item.2" />
                    </li>
                    <li>
                        <FormattedMessage id="page.confirmation.dinePP.list.item.3" />
                    </li>
                    <li>
                        <FormattedMessage id="page.confirmation.dinePP.list.item.4" />
                    </li>
                </ul>
                <Box margin="xl">
                    <Lenke href={lenker.innsynSIF} target="_blank">
                        <FormattedMessage id="page.confirmation.dinePP.lenke" />
                    </Lenke>
                </Box>
            </Box>
        </Page>
    );
};

export default ConfirmationPage;
