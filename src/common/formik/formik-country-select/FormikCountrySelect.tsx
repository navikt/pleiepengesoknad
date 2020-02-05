import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { useIntl } from 'react-intl';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { FormikValidationProps } from '../FormikProps';
import { isValidationErrorsVisible } from '../formikUtils';
import CountrySelect from 'common/components/country-select/CountrySelect';

interface FormikCountrySelectProps<T> {
    name: T;
    label: string;
    showOnlyEuAndEftaCountries?: boolean;
}

type Props = FormikValidationProps;

function FormikCountrySelect<T>({
    label,
    name,
    validate,
    showOnlyEuAndEftaCountries,
    showValidationErrors
}: Props & FormikCountrySelectProps<T>) {
    const intl = useIntl();
    return (
        <Field validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount, setFieldValue } }: FieldProps) => {
                const errorMsgProps =
                    showValidationErrors || isValidationErrorsVisible(status, submitCount)
                        ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                        : {};
                // TODO - fjerne inline style på label når vi oppdaterer til ny nav-frontend-skjema pakke
                return (
                    <CountrySelect
                        label={<span style={{ fontWeight: 'bold' }}>{label}</span>}
                        {...errorMsgProps}
                        {...field}
                        onChange={(value) => setFieldValue(field.name, value)}
                        showOnlyEuAndEftaCountries={showOnlyEuAndEftaCountries}
                    />
                );
            }}
        </Field>
    );
}

export default FormikCountrySelect;
