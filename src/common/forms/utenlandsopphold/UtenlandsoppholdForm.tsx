import React, { useState, useMemo } from 'react';
import { Formik } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { useIntl, FormattedMessage } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import { Utenlandsopphold, UtenlandsoppholdÅrsak } from 'common/forms/utenlandsopphold/types';
import { hasValue } from 'common/validation/hasValue';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import FormikSelect from 'common/formik/formik-select/FormikSelect';
import { getCountriesForLocale, countryIsMemberOfEøsOrEfta } from 'common/utils/countryUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import FormikRadioPanelGroup from 'common/formik/formik-radio-panel-group/FormikRadioPanelGroup';
import intlHelper from 'common/utils/intlUtils';
import {
    validateRequiredField,
    validateYesOrNoIsAnswered,
    validateRequiredSelect
} from 'app/validation/fieldValidations';
import dateRangeValidation from 'common/validation/dateRangeValidation';

import './utenlandsoppholdForm.less';
import { getCountryName } from 'common/components/country-select/CountrySelect';

export interface UtenlandsoppholdFormLabels {
    tittel: string;
}

interface Props {
    minDato: Date;
    maksDato: Date;
    opphold?: Utenlandsopphold;
    onSubmit: (values: Utenlandsopphold) => void;
    onCancel: () => void;
}

export enum UtenlandsoppholdFormFields {
    fom = 'fom',
    tom = 'tom',
    landkode = 'landkode',
    årsak = 'årsak',
    erBarnetInnlagt = 'erBarnetInnlagt'
}

interface UtenlandsoppholdFormData {
    [UtenlandsoppholdFormFields.fom]: Date;
    [UtenlandsoppholdFormFields.tom]: Date;
    [UtenlandsoppholdFormFields.landkode]: string;
    [UtenlandsoppholdFormFields.erBarnetInnlagt]?: YesOrNo;
    [UtenlandsoppholdFormFields.årsak]?: UtenlandsoppholdÅrsak;
}

const bem = bemUtils('utenlandsoppholdForm');

const defaultFormValues: Partial<UtenlandsoppholdFormData> = {
    fom: undefined,
    tom: undefined,
    landkode: undefined,
    erBarnetInnlagt: YesOrNo.UNANSWERED,
    årsak: undefined
};

const UtenlandsoppholdForm: React.FunctionComponent<Props> = ({
    maksDato,
    minDato,
    opphold: initialValues = defaultFormValues,
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

    const onFormikSubmit = (formValues: Utenlandsopphold) => {
        onSubmit({
            ...formValues,
            årsak: countryIsMemberOfEøsOrEfta(formValues.landkode) ? undefined : formValues.årsak
        });
    };

    return (
        <Formik initialValues={initialValues} onSubmit={onFormikSubmit} validateOnMount={true} validateOnChange={true}>
            {({ handleSubmit, values, isValid }) => {
                const showInnlagtQuestion: boolean =
                    values.landkode !== undefined &&
                    hasValue(values.landkode) &&
                    !countryIsMemberOfEøsOrEfta(values.landkode);

                return (
                    <form onSubmit={handleSubmit} className={bem.block}>
                        <div>
                            <Box padBottom="l">
                                <Systemtittel tag="h1">
                                    <FormattedMessage id="utenlandsopphold.form.tittel" />
                                </Systemtittel>
                            </Box>

                            <Box padBottom="l">
                                <FormikDateIntervalPicker<UtenlandsoppholdFormFields>
                                    legend={intlHelper(intl, 'utenlandsopphold.form.tidsperiode.spm')}
                                    showValidationErrors={showErrors}
                                    fromDatepickerProps={{
                                        name: UtenlandsoppholdFormFields.fom,
                                        label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.fraDato'),
                                        fullscreenOverlay: true,
                                        dateLimitations: {
                                            minDato,
                                            maksDato: values.tom || maksDato
                                        },
                                        validate: (date: Date) =>
                                            dateRangeValidation.validateFromDate(date, minDato, maksDato, values.tom)
                                    }}
                                    toDatepickerProps={{
                                        name: UtenlandsoppholdFormFields.tom,
                                        label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.tilDato'),
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
                                <FormikSelect<UtenlandsoppholdFormFields>
                                    name={UtenlandsoppholdFormFields.landkode}
                                    label={intlHelper(intl, 'utenlandsopphold.form.land.spm')}
                                    value={values.landkode}
                                    showValidationErrors={showErrors}
                                    validate={validateRequiredSelect}>
                                    {countryOptions}
                                </FormikSelect>
                            </Box>

                            {showInnlagtQuestion && values.landkode && (
                                <>
                                    <Box padBottom="m">
                                        <FormikYesOrNoQuestion<UtenlandsoppholdFormFields>
                                            name={UtenlandsoppholdFormFields.erBarnetInnlagt}
                                            legend={intlHelper(intl, 'utenlandsopphold.form.erBarnetInnlagt.spm', {
                                                land: getCountryName(values.landkode, intl.locale)
                                            })}
                                            singleColumn={true}
                                            showValidationErrors={showErrors}
                                            validate={validateYesOrNoIsAnswered}
                                        />
                                    </Box>
                                    {values.erBarnetInnlagt === YesOrNo.YES && (
                                        <>
                                            <FormikRadioPanelGroup<UtenlandsoppholdFormFields>
                                                singleColumn={true}
                                                legend={intlHelper(intl, 'utenlandsopphold.form.årsak.spm', {
                                                    land: getCountryName(values.landkode, intl.locale)
                                                })}
                                                name={UtenlandsoppholdFormFields.årsak}
                                                validate={validateRequiredField}
                                                showValidationErrors={showErrors}
                                                radios={[
                                                    {
                                                        key: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE,
                                                        value: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE}`
                                                        )
                                                    },
                                                    {
                                                        key: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND,
                                                        value: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND}`,
                                                            { land: getCountryName(values.landkode, intl.locale) }
                                                        )
                                                    },
                                                    {
                                                        key: UtenlandsoppholdÅrsak.ANNET,
                                                        value: UtenlandsoppholdÅrsak.ANNET,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.ANNET}`
                                                        )
                                                    }
                                                ]}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                            <div className={bem.element('knapper')}>
                                <Knapp
                                    type="hoved"
                                    htmlType="button"
                                    onClick={() => {
                                        setShowErrors(true);
                                        if (isValid) {
                                            onFormikSubmit(values as Utenlandsopphold);
                                        }
                                    }}>
                                    <FormattedMessage id="utenlandsopphold.form.ok" />
                                </Knapp>
                                <Knapp type="flat" htmlType="button" onClick={() => onCancel()}>
                                    <FormattedMessage id="utenlandsopphold.form.avbryt" />
                                </Knapp>
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default UtenlandsoppholdForm;
