import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SkjemagruppeQuestion } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator, getStringValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import { Undertittel } from 'nav-frontend-typografi';
import { AppFormField, BarnRelasjon, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateFødselsdato, validateFødselsnummer, validateNavn } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const AnnetBarnPart: React.FunctionComponent<Props> = ({ formValues }) => {
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
                    validate={barnetHarIkkeFåttFødselsnummerEnda ? undefined : validateFødselsnummer}
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
                        validate={validateNavn}
                        bredde="XL"
                    />
                </FormBlock>
                <FormBlock>
                    <AppForm.RadioGroup
                        legend={intlHelper(intl, 'steg.omBarnet.relasjon.spm')}
                        name={AppFormField.relasjonTilBarnet}
                        radios={Object.keys(BarnRelasjon).map((relasjon) => ({
                            label: intlHelper(intl, `barnRelasjon.${relasjon}`),
                            value: relasjon,
                        }))}
                        validate={getRequiredFieldValidator()}
                        checked={formValues.relasjonTilBarnet}></AppForm.RadioGroup>
                </FormBlock>
                {formValues.relasjonTilBarnet === BarnRelasjon.ANNET && (
                    <FormBlock>
                        <AppForm.Textarea
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
                            name={AppFormField.relasjonTilBarnetBeskrivelse}
                            validate={(value) => {
                                const error = getStringValidator({ required: true, maxLength: 1000 })(value);
                                return error
                                    ? {
                                          key: error,
                                          values: { min: 0, max: 1000 },
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
