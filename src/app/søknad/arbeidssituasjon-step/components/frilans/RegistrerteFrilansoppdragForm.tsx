import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { RegistrerteFrilansoppdragFormField, FrilansoppdragType } from '../../../../types/FrilansoppdragFormData';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ArbeidssituasjonPanel from '../arbeidssituasjon-panel/ArbeidssituasjonPanel';
import FrilansIcon from '../../../../components/frilans-icon/FrilansIconSvg';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import NormalarbeidstidSpørsmål from '../normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidsforholdFrilansoppdragFormValues } from '../../../../types/ArbeidsforholdFormValues';
import {
    getFrilansoppdragIPeriodenRadios,
    getYesOrNoRadios,
    getSelectFrilansKategoriOptions,
    renderTidsrom,
    visFrilansoppdragNormalarbeidstid,
} from '../../utils/frilansOppdragUtils';
import { getFrilansOppdragSluttdatoValidator } from '../../validation/frilansSluttdatoValidator';
import { FrilansoppdragIPeriodenApi } from '../../../../types/søknad-api-data/frilansoppdragApiData';

const RegistrerteFrilansoppdragFormComponents = getTypedFormComponents<
    RegistrerteFrilansoppdragFormField,
    ArbeidsforholdFrilansoppdragFormValues,
    ValidationError
>();

interface Props {
    oppdrag: ArbeidsforholdFrilansoppdragFormValues;
    parentFieldName: string;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const RegistrerteFrilansoppdragForm: React.FC<Props> = ({ oppdrag, parentFieldName, søknadsperiode, søknadsdato }) => {
    const intl = useIntl();
    const getFieldName = (field: RegistrerteFrilansoppdragFormField): RegistrerteFrilansoppdragFormField =>
        `${parentFieldName}.${field}` as any;
    return (
        <div data-testid="arbeidssituasjonFrilansOppdrag">
            <ArbeidssituasjonPanel
                title={oppdrag.arbeidsgiver.navn}
                description={
                    <FormattedMessage
                        id="frilansoppdragListe.oppdrag"
                        values={{ tidsrom: renderTidsrom(oppdrag.arbeidsgiver) }}
                    />
                }
                titleIcon={<FrilansIcon />}>
                <RegistrerteFrilansoppdragFormComponents.RadioGroup
                    legend={intlHelper(
                        intl,
                        'steg.arbeidssituasjon.frilans.registerteOppdrag.frilansoppdragIPerioden.spm'
                    )}
                    name={getFieldName(RegistrerteFrilansoppdragFormField.frilansoppdragIPerioden)}
                    radios={getFrilansoppdragIPeriodenRadios(intl)}
                    validate={(value) => {
                        const error = getRequiredFieldValidator()(value);
                        return error
                            ? {
                                  key: 'validation.frilansoppdrag.frilansoppdragIPerioden.noValue',
                                  values: {
                                      navn: oppdrag.arbeidsgiver.navn,
                                  },
                                  keepKeyUnaltered: true,
                              }
                            : undefined;
                    }}
                />

                {(oppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA ||
                    oppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN) && (
                    <>
                        <Box margin="l" padBottom="l">
                            <RegistrerteFrilansoppdragFormComponents.Select
                                name={getFieldName(RegistrerteFrilansoppdragFormField.frilansoppdragKategori)}
                                label={intlHelper(
                                    intl,
                                    'steg.arbeidssituasjon.frilans.registerteOppdrag.frilansoppdragKategori.spm',
                                    {
                                        oppdargsNavn: oppdrag.arbeidsgiver.navn,
                                    }
                                )}
                                bredde={'l'}
                                data-testid="arbeidssituasjonFrilansOppdrag-type"
                                validate={(value) => {
                                    const error = getRequiredFieldValidator()(value);
                                    return error
                                        ? {
                                              key: 'validation.frilansoppdrag.frilansoppdragKategori.noValue',
                                              values: {
                                                  navn: oppdrag.arbeidsgiver.navn,
                                              },
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined;
                                }}>
                                {getSelectFrilansKategoriOptions(intl)}
                            </RegistrerteFrilansoppdragFormComponents.Select>
                        </Box>
                        {oppdrag.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV && (
                            <Box margin="xl">
                                <RegistrerteFrilansoppdragFormComponents.RadioGroup
                                    legend={intlHelper(
                                        intl,
                                        'steg.arbeidssituasjon.frilans.registerteOppdrag.styremedlemHeleInntekt.spm'
                                    )}
                                    name={getFieldName(RegistrerteFrilansoppdragFormField.styremedlemHeleInntekt)}
                                    radios={getYesOrNoRadios(intl, 'er-styremedlem')}
                                    validate={(value) => {
                                        const error = getRequiredFieldValidator()(value);
                                        return error
                                            ? {
                                                  key: 'validation.frilansoppdrag.styremedlemHeleInntekt.noValue',
                                                  values: {
                                                      navn: oppdrag.arbeidsgiver.navn,
                                                  },
                                                  keepKeyUnaltered: true,
                                              }
                                            : undefined;
                                    }}
                                />
                            </Box>
                        )}
                        {oppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN && (
                            <Box margin="l" padBottom="l">
                                <RegistrerteFrilansoppdragFormComponents.DatePicker
                                    name={getFieldName(RegistrerteFrilansoppdragFormField.sluttdato)}
                                    label={intlHelper(
                                        intl,
                                        'steg.arbeidssituasjon.frilans.registerteOppdrag.sluttdato.spm'
                                    )}
                                    showYearSelector={true}
                                    minDate={oppdrag.arbeidsgiver.ansattFom}
                                    maxDate={søknadsdato}
                                    validate={(value) => {
                                        const error = getFrilansOppdragSluttdatoValidator(
                                            oppdrag,
                                            søknadsperiode,
                                            søknadsdato
                                        )(value);
                                        return error
                                            ? {
                                                  key: `validation.frilansoppdrag.sluttdato.${error}`,
                                                  values: {
                                                      navn: oppdrag.arbeidsgiver.navn,
                                                  },
                                                  keepKeyUnaltered: true,
                                              }
                                            : undefined;
                                    }}
                                />
                            </Box>
                        )}
                        {visFrilansoppdragNormalarbeidstid(oppdrag) && (
                            <NormalarbeidstidSpørsmål
                                arbeidsforholdFieldName={parentFieldName}
                                arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                arbeidsforhold={oppdrag}
                                erAktivtArbeidsforhold={true}
                                brukKunSnittPerUke={false}
                                frilanserOppdragType={oppdrag.frilansoppdragKategori}
                                arbeidsstedNavn={oppdrag.arbeidsgiver.navn}
                            />
                        )}
                    </>
                )}
            </ArbeidssituasjonPanel>
        </div>
    );
};

export default RegistrerteFrilansoppdragForm;
