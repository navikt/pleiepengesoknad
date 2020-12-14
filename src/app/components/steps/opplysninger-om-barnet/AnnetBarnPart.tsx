import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@sif-common/core/components/form-block/FormBlock';
import { dateToday } from '@sif-common/core/utils/dateUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { validateFødselsnummer } from '@sif-common/core/validation/fieldValidations';
import { useFormikContext } from 'formik';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateFødselsdato, validateNavn } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import { SkjemagruppeQuestion } from '@navikt/sif-common-formik/lib';
import { Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const AnnetBarnPart = ({ formValues }: Props) => {
    const intl = useIntl();
    const { barnetHarIkkeFåttFødselsnummerEnda } = formValues;
    const { setFieldValue } = useFormikContext<PleiepengesøknadFormData>();
    return (
        <Box margin="l">
            <SkjemagruppeQuestion
                legend={
                    <Undertittel tag="h2" style={{ display: 'inline-block', fontSize: '1.125rem' }}>
                        {intlHelper(intl, 'steg.omBarnet.annetBarn.tittel')}
                    </Undertittel>
                }>
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
                            maxDate={dateToday}
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
            </SkjemagruppeQuestion>
        </Box>
    );
};
export default AnnetBarnPart;
