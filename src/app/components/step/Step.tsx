import * as React from 'react';
import Page from 'common/components/page/Page';
import { StepID, StepConfigItemTexts, getStepConfig } from '../../config/stepConfig';
import bemHelper from 'common/utils/bemUtils';
import StepIndicator from '../step-indicator/StepIndicator';
import StepFooter from '../stepFooter/StepFooter';
import { Hovedknapp as Button } from 'nav-frontend-knapper';
import Box from 'common/components/box/Box';
import StepBanner from '../../../common/components/step-banner/StepBanner';
import { Systemtittel } from 'nav-frontend-typografi';
import FormikValidationErrorSummary from '../formik-validation-error-summary/FormikValidationErrorSummary';
import { useIntl } from 'react-intl';
import { getStepTexts } from 'app/utils/stepUtils';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { History } from 'history';
import BackLink from 'common/components/back-link/BackLink';
import FortsettSøknadSenereDialog from '../../../common/components/dialogs/fortsettSøknadSenereDialog/FortsettSøknadSenereDialog';
import AvbrytSøknadDialog from '../../../common/components/dialogs/avbrytSøknadDialog/AvbrytSøknadDialog';
import { purge } from 'app/api/api';
import { navigateToNAVno, navigateToWelcomePage } from 'app/utils/navigationUtils';

import './step.less';

const bem = bemHelper('step');

export interface StepProps {
    id: StepID;
    formValues: PleiepengesøknadFormData;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    useValidationErrorSummary?: boolean;
    customErrorSummaryRenderer?: () => React.ReactNode;
}

const Step: React.FunctionComponent<StepProps> = ({
    id,
    formValues,
    handleSubmit,
    showSubmitButton,
    showButtonSpinner,
    buttonDisabled,
    useValidationErrorSummary,
    customErrorSummaryRenderer,
    children
}) => {
    const stepConfig = getStepConfig(formValues);
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
                    <StepBanner text="Søknad om pleiepenger" />
                    {useValidationErrorSummary !== false && (
                        <FormikValidationErrorSummary className={bem.element('validationErrorSummary')} />
                    )}
                    {customErrorSummaryRenderer && (
                        <div className={bem.element('validationErrorSummary')}>{customErrorSummaryRenderer()}</div>
                    )}
                </>
            )}>
            <BackLink
                href={conf.backLinkHref!}
                className={bem.element('backLink')}
                onClick={(nextHref: string, history: History, event: React.SyntheticEvent) => {
                    event.preventDefault();
                    history.push(nextHref);
                }}
            />

            <StepIndicator stepConfig={stepConfig} activeStep={conf.index} />
            <Box margin="xxl">
                <Systemtittel className={bem.element('title')}>{stepTexts.stepTitle}</Systemtittel>
            </Box>
            <Box margin="xl">
                <form onSubmit={handleSubmit} noValidate={true}>
                    {children}
                    {showSubmitButton !== false && (
                        <Box margin="xl">
                            <Button
                                className={bem.element('button')}
                                spinner={showButtonSpinner || false}
                                disabled={buttonDisabled || false}
                                aria-label={stepTexts.nextButtonAriaLabel}>
                                {stepTexts.nextButtonLabel}
                            </Button>
                        </Box>
                    )}
                </form>
            </Box>
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
