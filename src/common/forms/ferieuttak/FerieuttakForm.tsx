import React, { useState } from 'react';
import { Ferieuttak } from './types';
import { Formik } from 'formik';
import Box from 'common/components/box/Box';
import { Systemtittel } from 'nav-frontend-typografi';
import bemUtils from 'common/utils/bemUtils';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import ferieuttakFormValidation from './ferieuttakFormValidation';

import './ferieuttakForm.less';
import FormKnapperad from '../components/FormKnapperad';

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
            {({ handleSubmit, values, isValid, errors }) => {
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
                                        ferieuttakFormValidation.validateFromDate(date, minDate, maxDate, values.tom)
                                }}
                                toDatepickerProps={{
                                    label: formLabels.toDate,
                                    name: FerieuttakFormFields.toDate,
                                    fullscreenOverlay: true,
                                    validate: (date: Date) =>
                                        ferieuttakFormValidation.validateToDate(date, minDate, maxDate, values.fom)
                                }}
                            />

                            <Box margin="xl">
                                <FormKnapperad
                                    onSubmit={() => {
                                        setShowErrors(true);
                                        if (isValid) {
                                            onFormikSubmit(values as Ferieuttak);
                                        }
                                    }}
                                    onCancel={onCancel}
                                />
                            </Box>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default FerieuttakForm;
