import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { getStepConfig } from '../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { getStepTexts } from '../../utils/stepUtils';
import AppForm from '../app-form/AppForm';
import InvalidStepPage from '../pages/invalid-step-page/InvalidStepPage';
import Step, { StepProps } from '../step/Step';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    skipValidation?: boolean;
    onValidFormSubmit?: () => void;
    customErrorSummary?: () => React.ReactNode;
    onStepCleanup?: (values: PleiepengesøknadFormData) => PleiepengesøknadFormData;
}

type Props = FormikStepProps & StepProps;

const FormikStep = (props: Props) => {
    const formik = useFormikContext<PleiepengesøknadFormData>();
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
    const stepConfig = getStepConfig(formik.values);
    useLogSidevisning(id);

    if (stepConfig === undefined || stepConfig[id] === undefined || stepConfig[id].included === false) {
        return <InvalidStepPage stepId={id} />;
    }

    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step stepConfig={stepConfig} {...props}>
            <AppForm.Form
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
            </AppForm.Form>
        </Step>
    );
};

export default FormikStep;
