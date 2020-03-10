import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
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
    onValidFormSubmit?: () => void;
    skipValidation?: boolean;
}

type Props = FormikStepProps & StepProps;

const FormikStep: React.FunctionComponent<Props> = (props) => {
    const formik = useFormikContext<PleiepengesøknadFormData>();
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, buttonDisabled, id } = props;
    const stepConfig = getStepConfig(formik.values);
    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step stepConfig={stepConfig} {...props}>
            <AppForm.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
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

// import * as React from 'react';
// import { History } from 'history';
// import Step, { StepProps } from '../step/Step';
// import { userHasSubmittedValidForm } from 'common/formik/formikUtils';
// import { connect } from 'formik';
// import { ConnectedFormikProps } from 'common/types/ConnectedFormikProps';
// import { AppFormField } from '../../types/PleiepengesøknadFormData';

// export interface FormikStepProps {
//     children: React.ReactNode;
//     onValidFormSubmit?: () => void;
//     history: History;
//     skipValidation?: boolean;
//     customErrorSummaryRenderer?: () => React.ReactNode;
// }

// type Props = FormikStepProps & StepProps;
// type PropsWithFormik = Props & ConnectedFormikProps<AppFormField>;

// class FormikStep extends React.Component<PropsWithFormik> {
//     constructor(props: PropsWithFormik) {
//         super(props);
//         this.props.formik.setStatus({ stepSubmitCount: this.props.formik.submitCount });

//         const { history } = props;
//         history.listen(() => {
//             this.props.formik.setStatus({ stepSubmitCount: this.props.formik.submitCount });
//         });
//     }

//     componentDidUpdate(previousProps: PropsWithFormik) {
//         const previousValues = {
//             isSubmitting: previousProps.formik.isSubmitting,
//             isValid: previousProps.formik.isValid
//         };
//         const currentValues = { isSubmitting: this.props.formik.isSubmitting, isValid: this.props.formik.isValid };
//         const { skipValidation } = this.props;

//         if (
//             userHasSubmittedValidForm(previousValues, currentValues) ||
//             (skipValidation && previousValues.isSubmitting === true && currentValues.isSubmitting === false)
//         ) {
//             const { onValidFormSubmit } = this.props;
//             if (onValidFormSubmit) {
//                 onValidFormSubmit();
//             }
//         }
//     }

//     render() {
//         return <Step {...this.props} />;
//     }
// }

// export default connect<Props, AppFormField>(FormikStep);
