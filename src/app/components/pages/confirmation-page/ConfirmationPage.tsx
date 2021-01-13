import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Innholdstittel } from 'nav-frontend-typografi';
import Box from '@sif-common/core/components/box/Box';
import CheckmarkIcon from '@sif-common/core/components/checkmark-icon/CheckmarkIcon';
import FormattedHtmlMessage from '@sif-common/core/components/formatted-html-message/FormattedHtmlMessage';
import Page from '@sif-common/core/components/page/Page';
import bemUtils from '@sif-common/core/utils/bemUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import useLogSidevisning from '../../../sif-amplitude/hooks/useLogSidevisning';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import NavPrintPage from '../../nav-print-page/NavPrintPage';
import { KvitteringInfo } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import ArbeidsgiverUtskrift from './ArbeidsgiverUtskrift';
import InfoMedInnsyn from './InfoMedInnsyn';
import InfoUtenInnsyn from './InfoUtenInnsyn';
import './confirmationPage.less';

interface Props {
    kvitteringInfo?: KvitteringInfo;
}

const bem = bemUtils('confirmationPage');

export const pluralize = (count: number, single: string, other: string) => (count === 1 ? single : other);

const ConfirmationPage = ({ kvitteringInfo }: Props) => {
    const intl = useIntl();
    const numberOfArbeidsforhold = kvitteringInfo ? kvitteringInfo.arbeidsforhold.length : 0;

    useLogSidevisning('søknad-sendt');

    return (
        <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.block}>
            <div className={bem.element('centeredContent')}>
                <CheckmarkIcon />
                <Box margin="xl">
                    <Innholdstittel>
                        <FormattedMessage id="page.confirmation.tittel" />
                    </Innholdstittel>
                </Box>
            </div>
            {numberOfArbeidsforhold > 0 && (
                <Box margin="xl">
                    <AlertStripeInfo>
                        <FormattedHtmlMessage
                            id="page.confirmation.alertInfo.html"
                            value={{ numberOfArbeidsforhold }}
                        />
                    </AlertStripeInfo>
                </Box>
            )}
            <Box margin="xl">
                <Panel className={bem.element('steps')} border={true}>
                    {isFeatureEnabled(Feature.INNSYN) === false && (
                        <InfoUtenInnsyn numberOfArbeidsforhold={numberOfArbeidsforhold} />
                    )}
                    {isFeatureEnabled(Feature.INNSYN) && (
                        <InfoMedInnsyn numberOfArbeidsforhold={numberOfArbeidsforhold} />
                    )}

                    {kvitteringInfo?.arbeidsforhold && (
                        <Box margin="xxl">
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }} className={'screenOnly'}>
                                <Knapp htmlType="button" onClick={() => window.print()} type="hoved">
                                    <FormattedMessage id="page.confirmation.skrivUt" />
                                </Knapp>
                            </div>
                        </Box>
                    )}
                </Panel>
            </Box>
            {kvitteringInfo?.arbeidsforhold && (
                <Box margin="xl">
                    {kvitteringInfo?.arbeidsforhold.map((a, idx) => (
                        <Box margin="xxl" key={idx}>
                            <NavPrintPage>
                                <ArbeidsgiverUtskrift
                                    arbeidsgiver={a.navn}
                                    fom={kvitteringInfo.fom}
                                    tom={kvitteringInfo.tom}
                                    søkernavn={kvitteringInfo.søkernavn}
                                />
                            </NavPrintPage>
                        </Box>
                    ))}
                </Box>
            )}
        </Page>
    );
};

export default ConfirmationPage;
