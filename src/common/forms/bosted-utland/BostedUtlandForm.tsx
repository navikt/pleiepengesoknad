import React, { useState, useMemo } from 'react';
import { Formik } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { useIntl, FormattedMessage } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import FormikSelect from 'common/formik/formik-select/FormikSelect';
import { getCountriesForLocale } from 'common/utils/countryUtils';
import intlHelper from 'common/utils/intlUtils';
import { BostedUtland } from './types';
import dateRangeValidation from 'common/validation/dateRangeValidation';

import './bostedUtlandForm.less';
import { validateRequiredSelect } from 'common/validation/commonFieldValidations';

export interface BostedUtlandFormLabels {
    tittel: string;
}

interface Props {
    minDato: Date;
    maksDato: Date;
    bosteder?: BostedUtland;
    onSubmit: (values: BostedUtland) => void;
    onCancel: () => void;
}

export enum BostedUtlandFormFields {
    fom = 'fom',
    tom = 'tom',
    landkode = 'landkode'
}

interface BostedUtlandFormData {
    [BostedUtlandFormFields.fom]: Date;
    [BostedUtlandFormFields.tom]: Date;
    [BostedUtlandFormFields.landkode]: string;
}

const bem = bemUtils('bostedUtlandForm');

const defaultFormValues: Partial<BostedUtlandFormData> = {
    fom: undefined,
    tom: undefined,
    landkode: undefined
};

const BostedUtlandForm: React.FunctionComponent<Props> = ({
    maksDato,
    minDato,
    bosteder: bosted = defaultFormValues,
    onSubmit,
    onCancel
}) => {
    const intl = useIntl();
    const [showErrors, setShowErrors] = useState(false);
    const countryOptions = useMemo((): React.ReactNode[] => {
        return [
            <option key="empty" value="" />,
            ...getCountriesForLocale(intl.locale)
                .filter((country) => country.isoCode !== 'NO')
                .map((country) => {
                    return (
                        <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                        </option>
                    );
                })
        ];
    }, [intl.locale]);

    const onFormikSubmit = (formValues: BostedUtland) => {
        onSubmit({
            ...formValues
        });
    };

    return (
        <Formik initialValues={bosted} onSubmit={onFormikSubmit} validateOnMount={true} validateOnChange={true}>
            {({ handleSubmit, values, isValid }) => {
                return (
                    <form onSubmit={handleSubmit} className={bem.block}>
                        <div>
                            <Box padBottom="l">
                                <Systemtittel tag="h1">
                                    <FormattedMessage id="bostedUtland.form.tittel" />
                                </Systemtittel>
                            </Box>

                            <Box padBottom="l">
                                <FormikDateIntervalPicker<BostedUtlandFormFields>
                                    legend={intlHelper(intl, 'bostedUtland.form.tidsperiode.spm')}
                                    showValidationErrors={showErrors}
                                    fromDatepickerProps={{
                                        name: BostedUtlandFormFields.fom,
                                        label: intlHelper(intl, 'bostedUtland.form.tidsperiode.fraDato'),
                                        fullscreenOverlay: true,
                                        dateLimitations: {
                                            minDato,
                                            maksDato: values.tom || maksDato
                                        },
                                        validate: (date: Date) =>
                                            dateRangeValidation.validateFromDate(date, minDato, maksDato, values.tom)
                                    }}
                                    toDatepickerProps={{
                                        name: BostedUtlandFormFields.tom,
                                        label: intlHelper(intl, 'bostedUtland.form.tidsperiode.tilDato'),
                                        fullscreenOverlay: true,
                                        dateLimitations: {
                                            minDato: values.fom || minDato,
                                            maksDato
                                        },
                                        validate: (date: Date) =>
                                            dateRangeValidation.validateToDate(date, minDato, maksDato, values.fom)
                                    }}
                                />
                            </Box>

                            <Box padBottom="l">
                                <FormikSelect<BostedUtlandFormFields>
                                    name={BostedUtlandFormFields.landkode}
                                    label={intlHelper(intl, 'bostedUtland.form.land.spm')}
                                    value={values.landkode}
                                    showValidationErrors={showErrors}
                                    validate={validateRequiredSelect}>
                                    {countryOptions}
                                </FormikSelect>
                            </Box>

                            <div className={bem.element('knapper')}>
                                <Knapp
                                    type="hoved"
                                    htmlType="button"
                                    onClick={() => {
                                        setShowErrors(true);
                                        if (isValid) {
                                            onFormikSubmit(values as BostedUtland);
                                        }
                                    }}>
                                    <FormattedMessage id="bostedUtland.form.ok" />
                                </Knapp>
                                <Knapp type="flat" htmlType="button" onClick={() => onCancel()}>
                                    <FormattedMessage id="bostedUtland.form.avbryt" />
                                </Knapp>
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default BostedUtlandForm;
