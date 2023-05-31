import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import ActionLink from '@navikt/sif-common-core-ds/lib/atoms/action-link/ActionLink';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import FormattedHtmlMessage from '@navikt/sif-common-core-ds/lib/atoms/formatted-html-message/FormattedHtmlMessage';
import Page from '@navikt/sif-common-core-ds/lib/components/page/Page';
import SifGuidePanel from '@navikt/sif-common-core-ds/lib/components/sif-guide-panel/SifGuidePanel';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import { getBackLinkFromNotIncludedStep, StepID } from '../../søknad/søknadStepsConfig';
import { navigateTo } from '../../utils/navigationUtils';

interface Props {
    stepId: StepID;
}

const InvalidStepPage = ({ stepId }: Props) => {
    const intl = useIntl();
    const navigate = useNavigate();
    const backLink = getBackLinkFromNotIncludedStep(stepId);
    return (
        <Page title={intlHelper(intl, 'page.invalidStepPage.sidetittel')}>
            <div style={{ paddingTop: '1rem' }}>
                <SifGuidePanel poster={true} compact={true} mood="uncertain">
                    <Systemtittel tag="h2">
                        <FormattedMessage id="page.invalidStepPage.tittel" />
                    </Systemtittel>
                    <Block margin="m" padBottom="l">
                        <Ingress tag="div">
                            <FormattedHtmlMessage id="page.invalidStepPage.tekst" />
                            <p>
                                <ActionLink
                                    onClick={() => {
                                        if (backLink) {
                                            navigateTo(backLink, navigate);
                                        } else {
                                            history.go(-1);
                                        }
                                    }}>
                                    <FormattedMessage id="page.invalidStepPage.tilbakeLenke" />
                                </ActionLink>
                            </p>
                        </Ingress>
                    </Block>
                </SifGuidePanel>
            </div>
        </Page>
    );
};

export default InvalidStepPage;
