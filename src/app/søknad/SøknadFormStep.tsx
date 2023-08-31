import React from 'react';
import { useIntl } from 'react-intl';
import { ApplikasjonHendelse, useAmplitudeInstance, useLogSidevisning } from '@navikt/sif-common-amplitude';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { purge } from '../api/api';
import { getSøknadStepConfig } from './søknadStepsConfig';
import { SøknadFormValues } from '../types/SøknadFormValues';
import { relocateToMinSide, relocateToSoknad } from '../utils/navigationUtils';
import { getStepTexts } from '../utils/stepUtils';
import SøknadFormComponents from './SøknadFormComponents';
import InvalidStepPage from '../pages/invalid-step-page/InvalidStepPage';
import Step, { StepProps } from '../components/step/Step';
import usePersistSoknad from '../hooks/usePersistSoknad';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    skipValidation?: boolean;
    onValidFormSubmit?: () => void;
    customErrorSummary?: () => React.ReactNode;
    onStepCleanup?: (values: SøknadFormValues) => SøknadFormValues;
}

type Props = FormikStepProps & Omit<StepProps, 'onAvbryt' | 'onFortsettSenere'>;

const SøknadFormStep = (props: Props) => {
    const formik = useFormikContext<SøknadFormValues>();
    const { persistSoknad } = usePersistSoknad();
    const intl = useIntl();
    const {
        children,
        onValidFormSubmit,
        showButtonSpinner,
        buttonDisabled,
        id,
        customErrorSummary,
        showSubmitButton = true,
    } = props;
    const stepConfig = getSøknadStepConfig(formik.values);
    useLogSidevisning(id);
    const { logHendelse } = useAmplitudeInstance();

    const handleAvbrytSøknad = async () => {
        await purge();
        await logHendelse(ApplikasjonHendelse.avbryt);
        relocateToSoknad();
    };

    const handleAvsluttOgFortsettSenere = async () => {
        /** Mellomlagring lagrer forrige steg, derfor må dette hentes ut her **/
        const prevStep = stepConfig[id].prevStep;
        await persistSoknad({ stepID: prevStep });
        await logHendelse(ApplikasjonHendelse.fortsettSenere);
        relocateToMinSide();
    };

    if (stepConfig === undefined || stepConfig[id] === undefined || stepConfig[id].included === false) {
        return <InvalidStepPage stepId={id} />;
    }

    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step
            stepConfig={stepConfig}
            onFortsettSenere={handleAvsluttOgFortsettSenere}
            onAvbryt={handleAvbrytSøknad}
            {...props}>
            <SøknadFormComponents.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={true}
                cleanup={props.onStepCleanup}
                formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}
                formFooter={
                    <>
                        {customErrorSummary && <FormBlock>{customErrorSummary()}</FormBlock>}
                        {showSubmitButton && (
                            <FormBlock>
                                <Knapp
                                    type="hoved"
                                    htmlType="submit"
                                    className={'step__button'}
                                    spinner={showButtonSpinner || false}
                                    disabled={buttonDisabled || false}
                                    aria-label={texts.nextButtonAriaLabel}>
                                    {texts.nextButtonLabel}
                                </Knapp>
                            </FormBlock>
                        )}
                    </>
                }>
                {children}
            </SøknadFormComponents.Form>
        </Step>
    );
};

export default SøknadFormStep;
