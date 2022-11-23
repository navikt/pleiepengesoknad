import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { NyttFrilansoppdragFormField, FrilansoppdragType } from '../../../../types/FrilansoppdragFormData';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ArbeidssituasjonPanel from '../arbeidssituasjon-panel/ArbeidssituasjonPanel';
import FrilansIcon from '../../../../components/frilans-icon/FrilansIconSvg';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import NormalarbeidstidSpørsmål from '../normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidsforholdFrilansoppdragFormValues } from '../../../../types/ArbeidsforholdFormValues';
import {
    getYesOrNoRadios,
    getSelectFrilansKategoriOptions,
    visFrilansoppdragNormalarbeidstid,
} from '../../utils/frilansoppdragUtils';
import { useFormikContext } from 'formik';
import { SøknadFormField, SøknadFormValues } from '../../../../types/SøknadFormValues';
import { removeElementFromArray } from '@navikt/sif-common-core/lib/utils/listUtils';
import { Flatknapp } from 'nav-frontend-knapper';
import { getNyFrilanserSluttdatoValidator } from '../../validation/frilansSluttdatoValidator';
import { getNyFrilanserStartdatoValidator } from '../../validation/frilansStartdatoValidator';
import { validateNavn } from '../../../../validation/fieldValidations';
import DeleteIcon from '../../../../components/delete-icon/DeleteIconSvg';

const NyttFrilansoppdragFormComponents = getTypedFormComponents<
    NyttFrilansoppdragFormField,
    ArbeidsforholdFrilansoppdragFormValues,
    ValidationError
>();

interface Props {
    oppdrag: ArbeidsforholdFrilansoppdragFormValues;
    parentFieldName: string;
    søknadsperiode: DateRange;
    søknadsdato: Date;
    index: number;
}

const NyttFrilansoppdragForm: React.FC<Props> = ({ oppdrag, parentFieldName, søknadsperiode, søknadsdato, index }) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormValues>();
    const getFieldName = (field: NyttFrilansoppdragFormField): NyttFrilansoppdragFormField =>
        `${parentFieldName}.${field}` as any;

    const deleteFrilans = () => {
        setFieldValue(SøknadFormField.nyttFrilansoppdrag, removeElementFromArray(oppdrag, values.nyttFrilansoppdrag));
    };

    const deleteButton = (
        <Flatknapp htmlType={'button'} onClick={deleteFrilans} kompakt>
            <DeleteIcon />
            <span>{intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.slett.btn', { index: index })}</span>
        </Flatknapp>
    );

    return (
        <ArbeidssituasjonPanel
            title={intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.tittel', { index: index })}
            titleIcon={<FrilansIcon />}
            deleteButton={deleteButton}>
            <NyttFrilansoppdragFormComponents.Input
                label={intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.navn')}
                name={getFieldName(NyttFrilansoppdragFormField.arbeidsgiver_navn)}
                validate={(value) => {
                    const error = validateNavn(value);
                    return error
                        ? {
                              key: 'validation.nyttFrilansoppdrag.arbeidsgiver.navn.noValue',
                              values: {
                                  navn: index,
                              },
                              keepKeyUnaltered: true,
                          }
                        : undefined;
                }}
                bredde={'XL'}
            />

            <Box margin="xl">
                <NyttFrilansoppdragFormComponents.DatePicker
                    name={getFieldName(NyttFrilansoppdragFormField.arbeidsgiver_ansattFom)}
                    label={intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.nårStartet.spm')}
                    showYearSelector={true}
                    maxDate={søknadsdato}
                    validate={(value) => {
                        const error = getNyFrilanserStartdatoValidator(oppdrag, søknadsperiode, søknadsdato)(value);
                        return error
                            ? {
                                  key: `validation.nyttFrilansoppdrag.arbeidsgiver.ansattFom.${error}`,
                                  values: {
                                      navn: index,
                                  },
                                  keepKeyUnaltered: true,
                              }
                            : undefined;
                    }}
                />
            </Box>
            <Box margin="xl">
                <NyttFrilansoppdragFormComponents.Checkbox
                    label={intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.sluttet')}
                    name={getFieldName(NyttFrilansoppdragFormField.sluttet)}
                />
            </Box>

            {oppdrag.sluttet === true && (
                <Box margin="xl">
                    <NyttFrilansoppdragFormComponents.DatePicker
                        name={getFieldName(NyttFrilansoppdragFormField.arbeidsgiver_ansattTom)}
                        label={intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.nårSluttet.spm')}
                        showYearSelector={true}
                        minDate={oppdrag.arbeidsgiver.ansattFom}
                        maxDate={søknadsdato}
                        validate={(value) => {
                            const error = getNyFrilanserSluttdatoValidator(oppdrag, søknadsperiode, søknadsdato)(value);
                            return error
                                ? {
                                      key: `validation.nyttFrilansoppdrag.arbeidsgiver.ansattTom.${error}`,
                                      values: {
                                          navn: index,
                                      },
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                    />
                </Box>
            )}

            <Box margin="xl" padBottom="l">
                <NyttFrilansoppdragFormComponents.Select
                    name={getFieldName(NyttFrilansoppdragFormField.frilansoppdragKategori)}
                    label={intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.frilansoppdragKategori.spm')}
                    bredde={'l'}
                    validate={(value) => {
                        const error = getRequiredFieldValidator()(value);
                        return error
                            ? {
                                  key: 'validation.nyttFrilansoppdrag.frilansoppdragKategori.noValue',
                                  keepKeyUnaltered: true,
                                  values: {
                                      navn: index,
                                  },
                              }
                            : undefined;
                    }}>
                    {getSelectFrilansKategoriOptions(intl)}
                </NyttFrilansoppdragFormComponents.Select>
            </Box>

            {oppdrag.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV && (
                <Box margin="xl">
                    <NyttFrilansoppdragFormComponents.RadioGroup
                        legend={intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.styremedlem.spm')}
                        name={getFieldName(NyttFrilansoppdragFormField.styremedlemHeleInntekt)}
                        radios={getYesOrNoRadios(intl, 'er-styremedlem')}
                        validate={(value) => {
                            const error = getRequiredFieldValidator()(value);
                            return error
                                ? {
                                      key: 'validation.nyttFrilansoppdrag.styremedlemHeleInntekt.noValue',
                                      values: {
                                          navn: index,
                                      },
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}></NyttFrilansoppdragFormComponents.RadioGroup>
                </Box>
            )}

            {visFrilansoppdragNormalarbeidstid(oppdrag) && (
                <Box>
                    <NormalarbeidstidSpørsmål
                        arbeidsforholdFieldName={parentFieldName}
                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                        arbeidsforhold={oppdrag}
                        erAktivtArbeidsforhold={true}
                        brukKunSnittPerUke={false}
                        frilanserOppdragType={oppdrag.frilansoppdragKategori}
                        arbeidsstedNavn={intlHelper(
                            intl,
                            'arbeidstidPeriode.arbeidIPeriodeIntlValues.somFrilanser.nytt',
                            { index: index }
                        )}
                    />
                </Box>
            )}
        </ArbeidssituasjonPanel>
    );
};

export default NyttFrilansoppdragForm;
