import * as React from 'react';
import { useIntl } from 'react-intl';
import { FormikValidationErrorSummary } from '@navikt/sif-common-formik/lib';
import { History } from 'history';
import { Systemtittel } from 'nav-frontend-typografi';
import BackLink from 'common/components/back-link/BackLink';
import Box from 'common/components/box/Box';
import AvbrytSøknadDialog from 'common/components/dialogs/avbrytSøknadDialog/AvbrytSøknadDialog';
import FortsettSøknadSenereDialog from 'common/components/dialogs/fortsettSøknadSenereDialog/FortsettSøknadSenereDialog';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemHelper from 'common/utils/bemUtils';
import { purge } from 'app/api/api';
import { navigateToNAVno, navigateToWelcomePage } from 'app/utils/navigationUtils';
import { getStepTexts } from 'app/utils/stepUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../../config/stepConfig';
import StepIndicator from '../step-indicator/StepIndicator';
import StepFooter from '../stepFooter/StepFooter';
import './step.less';

export interface StepProps {
    id: StepID;
    useValidationErrorSummary?: boolean;
}

interface OwnProps {
    stepConfig: StepConfigInterface;
    children: React.ReactNode;
}

type Props = OwnProps & StepProps;

const bem = bemHelper('step');

const Step = ({ id, useValidationErrorSummary, stepConfig, children }: Props) => {
    const conf = stepConfig[id];
    const intl = useIntl();
    const stepTexts: StepConfigItemTexts = getStepTexts(intl, id, stepConfig);
    const [visAvbrytDialog, setVisAvbrytDialog] = React.useState<boolean>(false);
    const [visFortsettSenereDialog, setVisFortsettSenereDialog] = React.useState<boolean>(false);
    const handleAvsluttOgFortsettSenere = () => {
        navigateToNAVno();
    };
    const handleAvbrytSøknad = () => {
        purge().then(() => {
            navigateToWelcomePage();
        });
    };
    return (
        <Page
            className={bem.block}
            title={stepTexts.pageTitle}
            topContentRenderer={() => (
                <>
                    <StepBanner text="Søknad om pleiepenger for sykt barn eller person over 18 år" />
                    {useValidationErrorSummary !== false && <FormikValidationErrorSummary />}
                </>
            )}>
            {conf.backLinkHref && (
                <BackLink
                    href={conf.backLinkHref}
                    className={bem.element('backLink')}
                    onClick={(nextHref: string, history: History, event: React.SyntheticEvent) => {
                        event.preventDefault();
                        history.push(nextHref);
                    }}
                />
            )}

            <StepIndicator stepConfig={stepConfig} activeStep={conf.index} />
            <Box margin="xxl">
                <Systemtittel className={bem.element('title')}>{stepTexts.stepTitle}</Systemtittel>
            </Box>
            <Box margin="xl">{children}</Box>
            <StepFooter
                onFortsettSenere={() => setVisFortsettSenereDialog(true)}
                onAvbryt={() => setVisAvbrytDialog(true)}
            />
            <FortsettSøknadSenereDialog
                synlig={visFortsettSenereDialog}
                onFortsettSøknadSenere={() => handleAvsluttOgFortsettSenere()}
                onFortsettSøknad={() => setVisFortsettSenereDialog(false)}
            />
            <AvbrytSøknadDialog
                synlig={visAvbrytDialog}
                onAvbrytSøknad={() => handleAvbrytSøknad()}
                onFortsettSøknad={() => setVisAvbrytDialog(false)}
            />
        </Page>
    );
};

export default Step;
