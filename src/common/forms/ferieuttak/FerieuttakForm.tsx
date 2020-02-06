import React, { useState } from 'react';
import { Ferieuttak } from './types';
import { Formik } from 'formik';
import Box from 'common/components/box/Box';
import { Systemtittel } from 'nav-frontend-typografi';
import bemUtils from 'common/utils/bemUtils';
import { Knapp } from 'nav-frontend-knapper';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';

import './ferieuttakForm.less';
import dateRangeValidation from 'common/validation/dateRangeValidation';

export interface FerieuttakFormLabels {
    title: string;
    fom: string;
    tom: string;
    intervalTitle: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    ferieuttak?: Partial<Ferieuttak>;
    labels?: Partial<FerieuttakFormLabels>;
    onSubmit: (values: Ferieuttak) => void;
    onCancel: () => void;
}

const defaultLabels: FerieuttakFormLabels = {
    title: 'Registrer uttak av ferie',
    fom: 'Fra og med',
    tom: 'Til og med',
    intervalTitle: 'Velg tidsrom',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

enum FerieuttakFormFields {
    tom = 'tom',
    fom = 'fom'
}
const bem = bemUtils('ferieuttakForm');

const FerieuttakForm: React.FunctionComponent<Props> = ({
    maxDate,
    minDate,
    labels,
    ferieuttak: initialValues = { fom: undefined, tom: undefined },
    onSubmit,
    onCancel
}) => {
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (formValues: Ferieuttak) => {
        onSubmit(formValues);
    };

    const formLabels: FerieuttakFormLabels = { ...defaultLabels, ...labels };

    return (
        <Formik initialValues={initialValues} onSubmit={onFormikSubmit} validateOnChange={true} validateOnMount={true}>
            {({ handleSubmit, values: ferieuttak, isValid, errors }) => {
                return (
                    <form onSubmit={handleSubmit} className={bem.block}>
                        <div className={bem.block}>
                            <Box padBottom="l">
                                <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                            </Box>

                            <FormikDateIntervalPicker<FerieuttakFormFields>
                                legend={formLabels.intervalTitle}
                                showValidationErrors={showErrors}
                                fromDatepickerProps={{
                                    label: formLabels.fom,
                                    name: FerieuttakFormFields.fom,
                                    fullscreenOverlay: true,
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateFromDate(date, minDate, maxDate, ferieuttak.tom)
                                }}
                                toDatepickerProps={{
                                    label: formLabels.tom,
                                    name: FerieuttakFormFields.tom,
                                    fullscreenOverlay: true,
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateToDate(date, minDate, maxDate, ferieuttak.fom)
                                }}
                            />

                            <div className={bem.element('knapper')}>
                                <Knapp
                                    type="hoved"
                                    htmlType="button"
                                    onClick={() => {
                                        setShowErrors(true);
                                        if (isValid) {
                                            onFormikSubmit(ferieuttak as Ferieuttak);
                                        }
                                    }}>
                                    {formLabels.okButton}
                                </Knapp>
                                <Knapp type="flat" htmlType="button" onClick={() => onCancel()}>
                                    {formLabels.cancelButton}
                                </Knapp>
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default FerieuttakForm;
