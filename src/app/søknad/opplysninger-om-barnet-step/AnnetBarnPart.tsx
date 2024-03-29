import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { resetFieldValue, resetFieldValues } from '@navikt/sif-common-formik';
import { SkjemagruppeQuestion } from '@navikt/sif-common-formik/lib';
import {
    getDateValidator,
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    getStringValidator,
    ValidateDateError,
} from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { Undertittel } from 'nav-frontend-typografi';
import { BarnRelasjon, ÅrsakManglerIdentitetsnummer } from '../../types';
import { initialValues, SøknadFormValues, SøknadFormField } from '../../types/SøknadFormValues';
import { validateNavn } from '../../validation/fieldValidations';
import SøknadFormComponents from '../SøknadFormComponents';
import InfoForFarVedNyttBarn from './info/InfoForFarVedNyttBarn';
import FødselsattestPart from './FødselsattestPart';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';

interface Props {
    formValues: SøknadFormValues;
    søkersFødselsnummer: string;
    attachments: Attachment[];
    harRegistrerteBarn: boolean;
}

const nYearsAgo = (years: number): Date => {
    return dayjs(dateToday).subtract(years, 'y').startOf('year').toDate();
};

const AnnetBarnPart: React.FC<Props> = ({ formValues, søkersFødselsnummer, attachments, harRegistrerteBarn }) => {
    const intl = useIntl();
    const {
        values: { barnetHarIkkeFnr, årsakManglerIdentitetsnummer },
        setFieldValue,
    } = useFormikContext<SøknadFormValues>();

    return (
        <Box margin="xl">
            <SkjemagruppeQuestion
                legend={
                    harRegistrerteBarn ? (
                        <Undertittel tag="h2" style={{ display: 'inline-block', fontSize: '1.125rem' }}>
                            {intlHelper(intl, 'steg.omBarnet.annetBarn.tittel')}
                        </Undertittel>
                    ) : undefined
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
                                    [SøknadFormField.årsakManglerIdentitetsnummer, SøknadFormField.barnetsFødselsdato],
                                    setFieldValue,
                                    initialValues
                                );
                            }
                        }}
                    />
                </FormBlock>

                {barnetHarIkkeFnr && (
                    <FormBlock>
                        <SøknadFormComponents.RadioGroup
                            legend={intlHelper(intl, 'steg.omBarnet.årsakManglerIdentitetsnummer.spm')}
                            name={SøknadFormField.årsakManglerIdentitetsnummer}
                            radios={Object.keys(ÅrsakManglerIdentitetsnummer).map((årsak, index) => ({
                                label: intlHelper(intl, `steg.omBarnet.årsakManglerIdentitetsnummer.${årsak}`),
                                value: årsak,
                                className:
                                    index === Object.keys(ÅrsakManglerIdentitetsnummer).length - 1
                                        ? 'siste-element'
                                        : undefined,
                            }))}
                            validate={getRequiredFieldValidator()}
                            checked={formValues.årsakManglerIdentitetsnummer}
                        />
                    </FormBlock>
                )}
                <FormBlock>
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
                {formValues.relasjonTilBarnet === BarnRelasjon.FAR && (
                    <Box margin="m">
                        <InfoForFarVedNyttBarn />
                    </Box>
                )}
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
                            data-testid="opplysninger-om-barnet-relasjonAnnetBeskrivelse"
                        />
                    </FormBlock>
                )}
                {barnetHarIkkeFnr &&
                    årsakManglerIdentitetsnummer === ÅrsakManglerIdentitetsnummer.BARNET_BOR_I_UTLANDET && (
                        <FormBlock>
                            <FødselsattestPart attachments={attachments} />
                        </FormBlock>
                    )}
            </SkjemagruppeQuestion>
        </Box>
    );
};
export default AnnetBarnPart;
