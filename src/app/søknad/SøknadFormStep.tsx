import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { UnansweredQuestionsInfo } from '@navikt/sif-common-formik/lib';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import StepSubmitButton from '@navikt/sif-common-soknad/lib/soknad-step/step-submit-button/StepSubmitButton';
import Step from '@navikt/sif-common-soknad/lib/soknad-step/step/Step';
// import { useFormikContext } from 'formik';
import { SøknadFormValues } from '../types/SøknadFormValues';
// import { getSøknadsdataFromFormValues } from '../utils/formValuesToSøknadsdata/getSøknadsdataFromFormValues';
import { useSøknadContext } from './SøknadContext';
import SøknadFormComponents from './SøknadFormComponents';
// import { useSøknadsdataContext } from './SøknadsdataContext';
import { StepID } from './søknadStepsConfig';
import { useFormikContext } from 'formik';
import { useSøknadsdataContext } from './SøknadsdataContext';
import { getSøknadsdataFromFormValues } from '../utils/formValuesToSøknadsdata/getSøknadsdataFromFormValues';

export interface SøknadFormStepBeforeValidSubmitProps {
    onBeforeValidSubmit?: () => Promise<boolean>;
}

interface Props {
    id: StepID;
    onStepCleanup?: (values: SøknadFormValues) => SøknadFormValues;
    onSendSoknad?: () => void;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    includeValidationSummary?: boolean;
    buttonDisabled?: boolean;
    stepTitle?: string;
    pageTitle?: string;
    showNotAllQuestionsAnsweredMessage?: boolean;
    children: React.ReactNode;
}

const SoknadFormStep: React.FunctionComponent<Props & SøknadFormStepBeforeValidSubmitProps> = ({
    id,
    onStepCleanup,
    onSendSoknad,
    onBeforeValidSubmit,
    children,
    showButtonSpinner,
    showSubmitButton = true,
    includeValidationSummary = true,
    stepTitle,
    pageTitle,
    showNotAllQuestionsAnsweredMessage,
    buttonDisabled,
}) => {
    const intl = useIntl();
    const { soknadStepsConfig, resetSoknad, gotoNextStepFromStep, continueSoknadLater } = useSøknadContext();
    const stepConfig = soknadStepsConfig[id];
    const texts = soknadStepUtils.getStepTexts(intl, stepConfig);
    const applicationTitle = intlHelper(intl, 'application.title');
    const { values } = useFormikContext<SøknadFormValues>();
    const { setSøknadsdata } = useSøknadsdataContext();

    useLogSidevisning(id);

    const onValidSubmit = async () => {
        if (onSendSoknad) {
            onSendSoknad();
        }
        const canContinue = onBeforeValidSubmit === undefined || (await onBeforeValidSubmit());
        if (canContinue) {
            gotoNextStepFromStep(id);
            setTimeout(() => {
                setSøknadsdata(getSøknadsdataFromFormValues(values));
            });
        }
    };

    return (
        <Step
            bannerTitle={applicationTitle}
            cancelOrContinueLaterAriaLabel={intlHelper(intl, 'steg.footer.cancelOrContinueLater.label')}
            stepTitle={stepTitle || texts.stepTitle}
            pageTitle={pageTitle || texts.pageTitle}
            backLinkHref={stepConfig.backLinkHref}
            steps={soknadStepUtils.getStepIndicatorStepsFromConfig(soknadStepsConfig, intl)}
            activeStepId={id}
            onCancel={resetSoknad}
            onContinueLater={continueSoknadLater ? () => continueSoknadLater(id) : undefined}>
            <SøknadFormComponents.Form
                includeButtons={false}
                includeValidationSummary={includeValidationSummary}
                formErrorHandler={getFormErrorHandler(intl, 'validation')}
                noButtonsContentRenderer={
                    showNotAllQuestionsAnsweredMessage
                        ? (): React.ReactNode => (
                              <UnansweredQuestionsInfo>
                                  <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                              </UnansweredQuestionsInfo>
                          )
                        : undefined
                }
                runDelayedFormValidation={true}
                cleanup={onStepCleanup}
                onValidSubmit={onValidSubmit}
                formFooter={
                    showSubmitButton ? (
                        <Box textAlignCenter={true} margin="xl">
                            <StepSubmitButton disabled={buttonDisabled} showSpinner={showButtonSpinner}>
                                {texts.nextButtonLabel}
                            </StepSubmitButton>
                        </Box>
                    ) : undefined
                }>
                {children}
            </SøknadFormComponents.Form>
        </Step>
    );
};

export default SoknadFormStep;
