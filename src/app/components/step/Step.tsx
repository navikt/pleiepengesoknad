import * as React from 'react';
import Page from 'common/components/page/Page';
import { StepID, StepConfigItemTexts, getStepConfig } from '../../config/stepConfig';
import bemHelper from 'common/utils/bemUtils';
import StepIndicator from '../step-indicator/StepIndicator';
import { Hovedknapp as Button } from 'nav-frontend-knapper';
import Box from 'common/components/box/Box';
import StepBanner from '../step-banner/StepBanner';
import { Systemtittel } from 'nav-frontend-typografi';
import FormikValidationErrorSummary from '../formik-validation-error-summary/FormikValidationErrorSummary';
import { InjectedIntl, injectIntl } from 'react-intl';
import { getStepTexts } from 'app/utils/stepUtils';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { History } from 'history';
import BackLink from 'app/components/back-link/BackLink';

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
    intl: InjectedIntl;
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
    intl,
    children
}) => {
    const stepConfig = getStepConfig(formValues);
    const conf = stepConfig[id];
    const stepTexts: StepConfigItemTexts = getStepTexts(intl, id, stepConfig);
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
        </Page>
    );
};

export default injectIntl(Step);
