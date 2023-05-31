import { Alert, Heading } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import CheckmarkIcon from '@navikt/sif-common-core-ds/lib/atoms/checkmark-icon/CheckmarkIcon';
import FormattedHtmlMessage from '@navikt/sif-common-core-ds/lib/atoms/formatted-html-message/FormattedHtmlMessage';
import Page from '@navikt/sif-common-core-ds/lib/components/page/Page';
import bemUtils from '@navikt/sif-common-core-ds/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { KvitteringInfo } from '../../types/KvitteringInfo';
import './confirmationPage.less';

interface Props {
    kvitteringInfo?: KvitteringInfo;
}

const bem = bemUtils('confirmationPage');

const ConfirmationPage = ({ kvitteringInfo }: Props) => {
    const intl = useIntl();

    const lenker = getLenker(intl.locale);

    useLogSidevisning(SIFCommonPageKey.kvittering);

    return (
        <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.block}>
            <div className={bem.element('centeredContent')}>
                <CheckmarkIcon />
                <Block margin="xl">
                    <Heading level="1" size="large">
                        <FormattedMessage id="page.confirmation.tittel.1" />
                    </Heading>
                    <Block margin="m">
                        <Heading level="2" size="small">
                            <FormattedMessage id="page.confirmation.tittel.2" />
                        </Heading>
                        <Heading level="2" size="small">
                            <FormattedMessage id="page.confirmation.tittel.3" />
                        </Heading>
                    </Block>
                </Block>
            </div>
            {kvitteringInfo?.arbeidsgivere && (
                <Block margin="xl">
                    <Alert variant="warning">
                        {intlHelper(intl, 'page.confirmation.tittel.advarsel.list.tittel')}
                        <ul style={{ marginTop: '0rem', marginBottom: '0rem' }}>
                            <li>
                                <FormattedMessage id="page.confirmation.tittel.advarsel.list.item.1" />
                            </li>
                            <li>
                                <FormattedMessage id="page.confirmation.tittel.advarsel.list.item.2" />
                            </li>
                        </ul>
                    </Alert>
                </Block>
            )}

            <Block margin="xxl">
                <Heading level="2" size="medium">
                    <FormattedHtmlMessage id="page.confirmation.dinePP.info.tittel" />
                </Heading>
                <Block margin="m">
                    <ul>
                        {kvitteringInfo?.arbeidsgivere && (
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
                    <Block margin="xl">
                        <Lenke href={lenker.innsynSIF} target="_blank" className="knapp knapp--hoved">
                            <FormattedMessage id="page.confirmation.dinePP.lenke" />
                        </Lenke>
                    </Block>
                </Block>
            </Block>
        </Page>
    );
};

export default ConfirmationPage;
