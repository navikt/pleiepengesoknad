import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateFødselsnummer } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateFødselsdato, validateNavn } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const AnnetBarnPart = ({ formValues }: Props) => {
    const intl = useIntl();
    const { barnetHarIkkeFåttFødselsnummerEnda } = formValues;
    const { setFieldValue } = useFormikContext<PleiepengesøknadFormData>();
    return (
        <>
            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                    name={AppFormField.barnetsFødselsnummer}
                    validate={(fnr) => {
                        if (!barnetHarIkkeFåttFødselsnummerEnda) {
                            return validateFødselsnummer(fnr);
                        }
                        return undefined;
                    }}
                    disabled={barnetHarIkkeFåttFødselsnummerEnda}
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                />
            </FormBlock>
            <FormBlock margin="m">
                <AppForm.Checkbox
                    label={intlHelper(intl, 'steg.omBarnet.fnr.ikkeFnrEnda')}
                    name={AppFormField.barnetHarIkkeFåttFødselsnummerEnda}
                    afterOnChange={(newValue) => {
                        if (newValue) {
                            setFieldValue(AppFormField.barnetsFødselsnummer, '');
                        }
                    }}
                />
            </FormBlock>
            {barnetHarIkkeFåttFødselsnummerEnda && (
                <FormBlock>
                    <AppForm.DatePicker
                        showYearSelector={true}
                        name={AppFormField.barnetsFødselsdato}
                        dateLimitations={{ maksDato: dateToday }}
                        label={intlHelper(intl, 'steg.omBarnet.fødselsdato')}
                        validate={(dato) => {
                            if (barnetHarIkkeFåttFødselsnummerEnda) {
                                return validateFødselsdato(dato);
                            }
                            return undefined;
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.navn')}
                    name={AppFormField.barnetsNavn}
                    validate={(navn) => {
                        return validateNavn(navn, false);
                    }}
                    bredde="XL"
                />
            </FormBlock>
        </>
    );
};
export default AnnetBarnPart;
