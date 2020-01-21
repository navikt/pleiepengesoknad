import React, { useState } from 'react';
import { Ferieuttak } from './types';
import { Formik, Field, FieldProps } from 'formik';
import Box from 'common/components/box/Box';
import { Systemtittel } from 'nav-frontend-typografi';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import DatepickerBase from 'common/form-components/datepicker-base/DatepickerBase';
import bemUtils from 'common/utils/bemUtils';
import { Knapp } from 'nav-frontend-knapper';
import DateIntervalPicker from 'app/components/date-interval-picker/DateIntervalPicker';

import './ferieuttakForm.less';
import { useIntl } from 'react-intl';

export interface FerieuttakFormLabels {
    title: string;
    fromDate: string;
    toDate: string;
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
    title: 'Ferieuttak',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
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
    const intl = useIntl();

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

                            <DateIntervalPicker<FerieuttakFormFields>
                                legend="abc"
                                fromDatepickerProps={{
                                    name: FerieuttakFormFields.fromDate,
                                    label: 'abc'
                                }}
                                toDatepickerProps={{ name: FerieuttakFormFields.toDate, label: 'sdf' }}
                            />

                            <Box padBottom="l">
                                <div className={bem.element('datoer')}>
                                    <div className={bem.element('dato')}>
                                        <Field name={FerieuttakFormFields.fromDate}>
                                            {({ field, form: { setFieldValue } }: FieldProps) => {
                                                const errorMsgProps = showErrors
                                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                                    : null;

                                                return (
                                                    <DatepickerBase
                                                        id="utenlandsoppholdStart"
                                                        value={field.value}
                                                        name={field.name}
                                                        label={formLabels.fromDate}
                                                        onChange={(date) => {
                                                            setFieldValue(field.name, date);
                                                        }}
                                                        {...errorMsgProps}
                                                        dateLimitations={{
                                                            minDato: minDate,
                                                            maksDato: ferieuttak.toDate || maxDate
                                                        }}
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </div>
                                    <div className={bem.element('dato')}>
                                        <Field name={FerieuttakFormFields.toDate}>
                                            {({ field, form: { setFieldValue } }: FieldProps) => {
                                                const errorMsgProps = showErrors
                                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                                    : null;
                                                return (
                                                    <DatepickerBase
                                                        id="utenlandsoppholdStop"
                                                        value={field.value}
                                                        name={field.name}
                                                        label={formLabels.toDate}
                                                        onChange={(date) => setFieldValue(field.name, date)}
                                                        {...errorMsgProps}
                                                        dateLimitations={{
                                                            minDato: ferieuttak.fromDate || minDate,
                                                            maksDato: maxDate
                                                        }}
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                            </Box>

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
