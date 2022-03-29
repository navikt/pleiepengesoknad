import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import { getBackLinkFromNotIncludedStep, StepID } from '../../søknad/søknadStepsConfig';
import VeilederLokal from '../../components/veileder-lokal/VeilederLokal';
import { navigateTo } from '../../utils/navigationUtils';

interface Props {
    stepId: StepID;
}

const InvalidStepPage = ({ stepId }: Props) => {
    const intl = useIntl();
    const history = useHistory();
    const backLink = getBackLinkFromNotIncludedStep(stepId);
    return (
        <Page title={intlHelper(intl, 'page.invalidStepPage.sidetittel')}>
            <div style={{ paddingTop: '1rem' }}>
                <Veilederpanel type="plakat" kompakt={true} fargetema="normal" svg={<VeilederLokal mood="uncertain" />}>
                    <Systemtittel tag="h2">
                        <FormattedMessage id="page.invalidStepPage.tittel" />
                    </Systemtittel>
                    <Box margin="m" padBottom="l">
                        <Ingress tag="div">
                            <FormattedHtmlMessage id="page.invalidStepPage.tekst" />
                            <p>
                                <ActionLink
                                    onClick={() => {
                                        if (backLink) {
                                            navigateTo(backLink, history);
                                        } else {
                                            history.go(-1);
                                        }
                                    }}>
                                    <FormattedMessage id="page.invalidStepPage.tilbakeLenke" />
                                </ActionLink>
                            </p>
                        </Ingress>
                    </Box>
                </Veilederpanel>
            </div>
        </Page>
    );
};

export default InvalidStepPage;
