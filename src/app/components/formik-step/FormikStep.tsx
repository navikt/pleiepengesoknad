import * as React from 'react';
import { History } from 'history';
import Step, { StepProps } from '../step/Step';
import { userHasSubmittedValidForm } from 'common/formik/formikUtils';
import { connect } from 'formik';
import { ConnectedFormikProps } from 'common/types/ConnectedFormikProps';
import { AppFormField } from '../../types/PleiepengesøknadFormData';

export interface FormikStepProps {
    children: React.ReactNode;
    onValidFormSubmit?: () => void;
    history: History;
    skipValidation?: boolean;
    customErrorSummaryRenderer?: () => React.ReactNode;
}

type Props = FormikStepProps & StepProps;
type PropsWithFormik = Props & ConnectedFormikProps<AppFormField>;

class FormikStep extends React.Component<PropsWithFormik> {
    constructor(props: PropsWithFormik) {
        super(props);
        this.props.formik.setStatus({ stepSubmitCount: this.props.formik.submitCount });

        const { history } = props;
        history.listen(() => {
            this.props.formik.setStatus({ stepSubmitCount: this.props.formik.submitCount });
        });
    }

    componentDidUpdate(previousProps: PropsWithFormik) {
        const previousValues = {
            isSubmitting: previousProps.formik.isSubmitting,
            isValid: previousProps.formik.isValid
        };
        const currentValues = { isSubmitting: this.props.formik.isSubmitting, isValid: this.props.formik.isValid };
        const { skipValidation } = this.props;

        if (
            userHasSubmittedValidForm(previousValues, currentValues) ||
            (skipValidation && previousValues.isSubmitting === true && currentValues.isSubmitting === false)
        ) {
            const { onValidFormSubmit } = this.props;
            if (onValidFormSubmit) {
                onValidFormSubmit();
            }
        }
    }

    render() {
        return <Step {...this.props} />;
    }
}

export default connect<Props, AppFormField>(FormikStep);
