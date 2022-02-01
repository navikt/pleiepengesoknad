import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SkjemagruppeQuestion } from '@navikt/sif-common-formik/lib';
import {
    getDateValidator,
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    getStringValidator,
    ValidateDateError,
} from '@navikt/sif-common-formik/lib/validation';
import { Undertittel } from 'nav-frontend-typografi';
import { SøknadFormField, SøknadFormData, initialValues } from '../../types/SøknadFormData';
import { validateNavn } from '../../validation/fieldValidations';
import SøknadFormComponents from '../SøknadFormComponents';
import { BarnRelasjon, ÅrsakBarnetUtenFnr } from '../../types';
import { resetFieldValue, resetFieldValues } from '@navikt/sif-common-formik';
import { useFormikContext } from 'formik';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { nYearsAgo } from '../../utils/aldersUtils';

interface Props {
    formValues: SøknadFormData;
    søkersFødselsnummer: string;
}

const AnnetBarnPart: React.FC<Props> = ({ formValues, søkersFødselsnummer }) => {
    const intl = useIntl();
    const {
        values: { barnetHarIkkeFnr },
        setFieldValue,
    } = useFormikContext<SøknadFormData>();

    return (
        <Box margin="l">
            <SkjemagruppeQuestion
                legend={
                    <Undertittel tag="h2" style={{ display: 'inline-block', fontSize: '1.125rem' }}>
                        {intlHelper(intl, 'steg.omBarnet.annetBarn.tittel')}
                    </Undertittel>
                }>
                <SøknadFormComponents.Input
                    label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                    name={SøknadFormField.barnetsFødselsnummer}
                    validate={
                        barnetHarIkkeFnr
                            ? undefined
                            : getFødselsnummerValidator({
                                  required: true,
                                  disallowedValues: [søkersFødselsnummer],
                              })
                    }
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                    disabled={barnetHarIkkeFnr}
                />
                <FormBlock margin="l">
                    <SøknadFormComponents.Checkbox
                        label={intlHelper(intl, 'steg.omBarnet.fnr.barnHarIkkeFnr')}
                        name={SøknadFormField.barnetHarIkkeFnr}
                        afterOnChange={(newValue) => {
                            if (newValue) {
                                resetFieldValue(SøknadFormField.barnetsFødselsnummer, setFieldValue, initialValues);
                            } else {
                                resetFieldValues(
                                    [SøknadFormField.årsakAtBarnetHarIkkeFnr, SøknadFormField.barnetsFødselsdato],
                                    setFieldValue,
                                    initialValues
                                );
                            }
                        }}
                    />

                    {barnetHarIkkeFnr && (
                        <SøknadFormComponents.RadioGroup
                            legend={intlHelper(intl, 'steg.omBarnet.årsakAtBarnetHarIkkeFnr.spm')}
                            name={SøknadFormField.årsakAtBarnetHarIkkeFnr}
                            radios={Object.keys(ÅrsakBarnetUtenFnr).map((årsak) => ({
                                label: intlHelper(intl, `steg.omBarnet.årsakAtBarnetHarIkkeFnr.${årsak}`),
                                value: årsak,
                            }))}
                            validate={getRequiredFieldValidator()}
                            checked={formValues.årsakAtBarnetHarIkkeFnr}></SøknadFormComponents.RadioGroup>
                    )}
                    <SøknadFormComponents.Input
                        label={intlHelper(intl, 'steg.omBarnet.navn')}
                        name={SøknadFormField.barnetsNavn}
                        validate={validateNavn}
                        bredde="XL"
                    />
                </FormBlock>
                {barnetHarIkkeFnr && (
                    <FormBlock>
                        <SøknadFormComponents.DatePicker
                            name={SøknadFormField.barnetsFødselsdato}
                            label={intlHelper(intl, 'steg.omBarnet.fødselsdato')}
                            validate={(value) => {
                                const dateError = getDateValidator({
                                    required: true,
                                    max: dateToday,
                                })(value);
                                if (dateError === ValidateDateError.dateIsBeforeMin) {
                                    return {
                                        key: dateError,
                                        values: { dato: prettifyDate(nYearsAgo(18)) },
                                    };
                                }
                                return dateError;
                            }}
                            maxDate={dateToday}
                            showYearSelector={true}
                        />
                    </FormBlock>
                )}

                <FormBlock>
                    <SøknadFormComponents.RadioGroup
                        legend={intlHelper(intl, 'steg.omBarnet.relasjon.spm')}
                        name={SøknadFormField.relasjonTilBarnet}
                        radios={Object.keys(BarnRelasjon).map((relasjon) => ({
                            label: intlHelper(intl, `barnRelasjon.${relasjon}`),
                            value: relasjon,
                        }))}
                        validate={getRequiredFieldValidator()}
                        checked={formValues.relasjonTilBarnet}></SøknadFormComponents.RadioGroup>
                </FormBlock>
                {formValues.relasjonTilBarnet === BarnRelasjon.ANNET && (
                    <FormBlock>
                        <SøknadFormComponents.Textarea
                            label={intlHelper(intl, 'steg.omBarnet.relasjonAnnet.spm')}
                            description={
                                <>
                                    <ExpandableInfo title={intlHelper(intl, 'steg.omBarnet.relasjonAnnet.info.tittel')}>
                                        <FormattedMessage
                                            tagName="div"
                                            id="steg.omBarnet.relasjonAnnet.info.hjelpetekst.1"
                                        />
                                        <FormattedMessage
                                            tagName="p"
                                            id="steg.omBarnet.relasjonAnnet.info.hjelpetekst.2"
                                        />
                                        <FormattedMessage
                                            tagName="p"
                                            id="steg.omBarnet.relasjonAnnet.info.hjelpetekst.3"
                                        />
                                    </ExpandableInfo>
                                </>
                            }
                            name={SøknadFormField.relasjonTilBarnetBeskrivelse}
                            validate={(value) => {
                                const error = getStringValidator({ required: true, maxLength: 2000 })(value);
                                return error
                                    ? {
                                          key: error,
                                          values: { min: 0, maks: 2000 },
                                      }
                                    : undefined;
                            }}
                            value={formValues.relasjonTilBarnet || ''}
                        />
                    </FormBlock>
                )}
            </SkjemagruppeQuestion>
        </Box>
    );
};
export default AnnetBarnPart;
