import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { FrilansOppdragFormField, FrilanserOppdragType } from '../../../../types/FrilansFormData';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ArbeidssituasjonPanel from '../arbeidssituasjon-panel/ArbeidssituasjonPanel';
import FrilansIcon from '../../../../components/frilans-icon/FrilansIconSvg';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import NormalarbeidstidSpørsmål from '../normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../../types/ArbeidsforholdFormValues';
import {
    getFrilansOppdragIPeriodenRadios,
    getYesOrNoRadios,
    getSelectFrilansKategoriOptions,
    renderTidsrom,
    visFrilansOppdragNormalarbeidstid,
} from '../../utils/FrilansOppdragUtils';
import { getFrilansOppdragSluttdatoValidator } from '../../validation/frilansSluttdatoValidator';
import { FrilanserOppdragIPeriodenApi } from '../../../../types/søknad-api-data/frilansOppdragApiData';

const FrilansOppdragFormComponents = getTypedFormComponents<
    FrilansOppdragFormField,
    ArbeidsforholdFrilanserMedOppdragFormValues,
    ValidationError
>();

interface Props {
    oppdrag: ArbeidsforholdFrilanserMedOppdragFormValues;
    parentFieldName: string;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const ArbeidssituasjonFrilansOppdrag: React.FunctionComponent<Props> = ({
    oppdrag,
    parentFieldName,
    søknadsperiode,
    søknadsdato,
}) => {
    const intl = useIntl();
    const getFieldName = (field: FrilansOppdragFormField): FrilansOppdragFormField =>
        `${parentFieldName}.${field}` as any;
    return (
        <div data-testid="arbeidssituasjonFrilansOppdrag">
            <Box padBottom="m">
                <ArbeidssituasjonPanel
                    title={oppdrag.arbeidsgiver.navn}
                    description={renderTidsrom(oppdrag.arbeidsgiver)}
                    titleIcon={<FrilansIcon />}>
                    <FormBlock>
                        <FrilansOppdragFormComponents.RadioGroup
                            legend={intlHelper(intl, 'frilansoppdragListe.oppdrag.spm')}
                            name={getFieldName(FrilansOppdragFormField.frilansOppdragIPerioden)}
                            radios={getFrilansOppdragIPeriodenRadios(intl)}
                            validate={(value) => {
                                const error = getRequiredFieldValidator()(value);
                                return error
                                    ? {
                                          key: 'validation.frilansoppdrag.frilansOppdragIPerioden.noValue',
                                          values: {
                                              navn: oppdrag.arbeidsgiver.navn,
                                          },
                                          keepKeyUnaltered: true,
                                      }
                                    : undefined;
                            }}
                        />
                    </FormBlock>
                    {(oppdrag.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA ||
                        oppdrag.frilansOppdragIPerioden ===
                            FrilanserOppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN) && (
                        <Box padBottom="l">
                            <Box margin="l">
                                <FrilansOppdragFormComponents.Select
                                    name={getFieldName(FrilansOppdragFormField.frilansOppdragKategori)}
                                    label={intlHelper(intl, 'frilansoppdragListe.oppdrag.kategori.spm', {
                                        oppdargsNavn: oppdrag.arbeidsgiver.navn,
                                    })}
                                    bredde={'l'}
                                    data-testid="arbeidssituasjonFrilansOppdrag-type"
                                    validate={(value) => {
                                        const error = getRequiredFieldValidator()(value);
                                        return error
                                            ? {
                                                  key: 'validation.frilansoppdrag.frilansOppdragKategori.noValue',
                                                  values: {
                                                      navn: oppdrag.arbeidsgiver.navn,
                                                  },
                                                  keepKeyUnaltered: true,
                                              }
                                            : undefined;
                                    }}>
                                    {getSelectFrilansKategoriOptions(intl)}
                                </FrilansOppdragFormComponents.Select>
                            </Box>
                            {oppdrag.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV && (
                                <Box margin="l">
                                    <FrilansOppdragFormComponents.RadioGroup
                                        legend={intlHelper(intl, 'frilansoppdragListe.oppdrag.styremedlem.spm')}
                                        name={getFieldName(FrilansOppdragFormField.styremedlemHeleInntekt)}
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
                            {oppdrag.frilansOppdragIPerioden ===
                                FrilanserOppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN && (
                                <Box margin="l">
                                    <FrilansOppdragFormComponents.DatePicker
                                        name={getFieldName(FrilansOppdragFormField.sluttdato)}
                                        label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
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
                            {visFrilansOppdragNormalarbeidstid(oppdrag) && (
                                <Box>
                                    <NormalarbeidstidSpørsmål
                                        arbeidsforholdFieldName={parentFieldName}
                                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                        arbeidsforhold={oppdrag || {}}
                                        erAktivtArbeidsforhold={true}
                                        brukKunSnittPerUke={true}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </ArbeidssituasjonPanel>
            </Box>
        </div>
    );
};

export default ArbeidssituasjonFrilansOppdrag;
