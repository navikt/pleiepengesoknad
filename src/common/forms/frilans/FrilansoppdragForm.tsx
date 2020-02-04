import React, { useState } from 'react';
import { FrilansoppdragFormData, FrilansoppdragFormField } from './types';
import FormikInput from 'common/formik/formik-input/FormikInput';
import Box from 'common/components/box/Box';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import FormikCheckbox from 'common/formik/formik-checkbox/FormikCheckbox';
import { Formik } from 'formik';
import { validateRequiredField } from 'app/validation/fieldValidations';
import { Systemtittel } from 'nav-frontend-typografi';
import dateRangeValidation from 'common/validation/dateRangeValidation';
import { dateToday, date10MonthsAgo } from 'common/utils/dateUtils';
import FormKnapperad from '../components/FormKnapperad';

interface Props {
    oppdrag?: FrilansoppdragFormData;
    minDato: Date;
    maksDato: Date;
    onSubmit: (oppdrag: FrilansoppdragFormData) => void;
    onCancel: () => void;
}

const initialValues: Partial<FrilansoppdragFormData> = {};

const FrilansoppdragForm: React.FunctionComponent<Props> = ({
    onCancel,
    oppdrag = initialValues,
    onSubmit,
    minDato,
    maksDato
}) => {
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (values: FrilansoppdragFormData) => {
        onSubmit(values);
    };

    return (
        <Formik initialValues={oppdrag} onSubmit={onFormikSubmit} validateOnMount={true} validateOnChange={true}>
            {({ handleSubmit, isValid, setFieldValue, setFieldTouched, values }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">Frilansoppdrag</Systemtittel>
                        </Box>
                        <FormikInput<FrilansoppdragFormField>
                            label="Navn på arbeidsgiver"
                            name={FrilansoppdragFormField.arbeidsgiverNavn}
                            showValidationErrors={showErrors}
                            validate={validateRequiredField}
                        />
                        <Box margin="l">
                            <FormikDateIntervalPicker<FrilansoppdragFormField>
                                legend={'Periode'}
                                showValidationErrors={showErrors}
                                fromDatepickerProps={{
                                    label: 'Fra og med',
                                    fullscreenOverlay: true,
                                    name: FrilansoppdragFormField.fom,
                                    showYearSelector: true,
                                    dateLimitations: {
                                        minDato,
                                        maksDato: values.tom || maksDato
                                    },
                                    validate: (date) =>
                                        dateRangeValidation.validateFromDate(
                                            date,
                                            date10MonthsAgo,
                                            dateToday,
                                            values.tom
                                        )
                                }}
                                toDatepickerProps={{
                                    label: 'Til og med',
                                    name: FrilansoppdragFormField.tom,
                                    fullscreenOverlay: true,
                                    disabled: values.erPågående === true,
                                    showYearSelector: true,
                                    dateLimitations: {
                                        minDato: values.fom || minDato,
                                        maksDato
                                    },
                                    validate:
                                        values.erPågående !== true
                                            ? (date: Date) =>
                                                  dateRangeValidation.validateToDate(
                                                      date,
                                                      minDato,
                                                      maksDato,
                                                      values.fom
                                                  )
                                            : undefined
                                }}
                            />
                            <FormikCheckbox<FrilansoppdragFormField>
                                label="Pågående"
                                name={FrilansoppdragFormField.erPågående}
                                afterOnChange={(checked) => {
                                    if (checked) {
                                        setFieldValue(FrilansoppdragFormField.tom, undefined);
                                    }
                                }}
                            />
                        </Box>
                        <Box margin="xl">
                            <FormKnapperad
                                onSubmit={() => {
                                    setShowErrors(true);
                                    if (isValid) {
                                        onFormikSubmit(values as FrilansoppdragFormData);
                                    }
                                }}
                                onCancel={onCancel}
                            />
                        </Box>
                    </form>
                );
            }}
        </Formik>
    );
};

export default FrilansoppdragForm;
