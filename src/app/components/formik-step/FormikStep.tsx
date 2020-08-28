import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from '@sif-common/core/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@sif-common/core/utils/commonFieldErrorRenderer';
import { getStepConfig } from '../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { getStepTexts } from '../../utils/stepUtils';
import AppForm from '../app-form/AppForm';
import Step, { StepProps } from '../step/Step';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    skipValidation?: boolean;
    onValidFormSubmit?: () => void;
    customErrorSummary?: () => React.ReactNode;
}

type Props = FormikStepProps & StepProps;

const FormikStep = (props: Props) => {
    const formik = useFormikContext<PleiepengesøknadFormData>();
    const pleiepengesøknadFormData: PleiepengesøknadFormData = formik.values;
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, buttonDisabled, id, customErrorSummary } = props;
    const stepConfig = getStepConfig(pleiepengesøknadFormData);
    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step stepConfig={stepConfig} {...props}>
            <AppForm.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={true}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
                {customErrorSummary && <FormBlock>{customErrorSummary()}</FormBlock>}
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
            </AppForm.Form>
        </Step>
    );
};

export default FormikStep;
