import React, { useState } from 'react';
import { Ferieuttak } from './types';
import { Formik } from 'formik';
import Box from 'common/components/box/Box';
import { Systemtittel } from 'nav-frontend-typografi';
import bemUtils from 'common/utils/bemUtils';
import { Knapp } from 'nav-frontend-knapper';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import ferieuttakFormValidation from './ferieuttakFormValidation';

import './ferieuttakForm.less';

export interface FerieuttakFormLabels {
    title: string;
    fromDate: string;
    toDate: string;
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
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    intervalTitle: 'Velg tidsrom',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

enum FerieuttakFormFields {
    toDate = 'toDate',
    fromDate = 'fromDate'
}
const bem = bemUtils('ferieuttakForm');

const FerieuttakForm: React.FunctionComponent<Props> = ({
    maxDate,
    minDate,
    labels,
    ferieuttak: initialValues = { fromDate: undefined, toDate: undefined },
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
                                    label: formLabels.fromDate,
                                    name: FerieuttakFormFields.fromDate,
                                    fullscreenOverlay: true,
                                    validate: (date: Date) =>
                                        ferieuttakFormValidation.validateFromDate(
                                            date,
                                            minDate,
                                            maxDate,
                                            ferieuttak.toDate
                                        )
                                }}
                                toDatepickerProps={{
                                    label: formLabels.toDate,
                                    name: FerieuttakFormFields.toDate,
                                    fullscreenOverlay: true,
                                    validate: (date: Date) =>
                                        ferieuttakFormValidation.validateToDate(
                                            date,
                                            minDate,
                                            maxDate,
                                            ferieuttak.fromDate
                                        )
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
