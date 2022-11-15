import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { FrilansNyFormField, FrilanserOppdragType, FrilansOppdragFormField } from '../../../../types/FrilansFormData';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ArbeidssituasjonPanel from '../arbeidssituasjon-panel/ArbeidssituasjonPanel';
import FrilansIcon from '../../../../components/frilans-icon/FrilansIconSvg';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import NormalarbeidstidSpørsmål from '../normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../../types/ArbeidsforholdFormValues';
import {
    getYesOrNoRadios,
    getSelectFrilansKategoriOptions,
    visFrilansOppdragNormalarbeidstid,
} from '../../utils/FrilansOppdragUtils';
import { useFormikContext } from 'formik';
import { SøknadFormField, SøknadFormValues } from '../../../../types/SøknadFormValues';
import { removeElementFromArray } from '@navikt/sif-common-core/lib/utils/listUtils';
import { Flatknapp } from 'nav-frontend-knapper';
import { getNyFrilanserSluttdatoValidator } from '../../validation/frilansSluttdatoValidator';
import { getNyFrilanserStartdatoValidator } from '../../validation/frilansStartdatoValidator';
import { validateNavn } from '../../../../validation/fieldValidations';
import DeleteIcon from '../../../../components/delete-icon/DeleteIconSvg';

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

const FrilansForm: React.FC<Props> = ({ oppdrag, parentFieldName, søknadsperiode, søknadsdato }) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormValues>();
    const getFieldName = (field: FrilansNyFormField): FrilansOppdragFormField => `${parentFieldName}.${field}` as any;

    const deleteFrilans = () => {
        setFieldValue(SøknadFormField.nyfrilansoppdrag, removeElementFromArray(oppdrag, values.nyfrilansoppdrag));
    };

    const deleteButton = (
        <Flatknapp htmlType={'button'} onClick={deleteFrilans} kompakt>
            <DeleteIcon />
            <span className="sr-only">{intlHelper(intl, 'nyfrilansoppdrag.arbeidsgiver.slettBtn')}</span>
        </Flatknapp>
    );

    return (
        <ArbeidssituasjonPanel
            title={intlHelper(intl, 'nyfrilansoppdrag.arbeidsgiver.title')}
            titleIcon={<FrilansIcon />}
            deleteButton={deleteButton}>
            <FrilansOppdragFormComponents.Input
                label={intlHelper(intl, 'nyfrilansoppdrag.arbeidsgiver.navn')}
                name={getFieldName(FrilansNyFormField.arbeidsgiver_navn)}
                validate={(value) => {
                    const error = validateNavn(value);
                    return error
                        ? {
                              key: 'validation.nyfrilansoppdrag.arbeidsgiver.navn.noValue',
                              values: {
                                  navn: oppdrag.arbeidsgiver.navn,
                              },
                              keepKeyUnaltered: true,
                          }
                        : undefined;
                }}
                bredde={'XL'}
            />

            <Box margin="xl">
                <FrilansOppdragFormComponents.DatePicker
                    name={getFieldName(FrilansNyFormField.arbeidsgiver_ansattFom)}
                    label={intlHelper(intl, 'nyfrilansoppdrag.arbeidsgiver.nårStartet.spm')}
                    showYearSelector={true}
                    maxDate={søknadsdato}
                    validate={(value) => {
                        const error = getNyFrilanserStartdatoValidator(oppdrag, søknadsperiode, søknadsdato)(value);
                        return error
                            ? {
                                  key: `validation.nyfrilansoppdrag.arbeidsgiver.ansattFom.${error}`,
                                  values: {
                                      navn: oppdrag.arbeidsgiver.navn,
                                  },
                                  keepKeyUnaltered: true,
                              }
                            : undefined;
                    }}
                />
            </Box>
            <Box margin="xl">
                <FrilansOppdragFormComponents.Checkbox
                    label={intlHelper(intl, 'nyfrilansoppdrag.arbeidsgiver.sluttet')}
                    name={getFieldName(FrilansNyFormField.sluttet)}
                />
            </Box>

            {oppdrag.sluttet === true && (
                <Box margin="xl">
                    <FrilansOppdragFormComponents.DatePicker
                        name={getFieldName(FrilansNyFormField.arbeidsgiver_ansattTom)}
                        label={intlHelper(intl, 'nyfrilansoppdrag.arbeidsgiver.nårSluttet.spm')}
                        showYearSelector={true}
                        minDate={oppdrag.arbeidsgiver.ansattFom}
                        maxDate={søknadsdato}
                        validate={(value) => {
                            const error = getNyFrilanserSluttdatoValidator(oppdrag, søknadsperiode, søknadsdato)(value);
                            return error
                                ? {
                                      key: `validation.nyfrilansoppdrag.arbeidsgiver.ansattTom.${error}`,
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

            <Box margin="xl">
                <FrilansOppdragFormComponents.Select
                    name={getFieldName(FrilansNyFormField.frilansOppdragKategori)}
                    label={intlHelper(intl, 'nyfrilansoppdrag.arbeidsgiver.frilansOppdragKategori.spm')}
                    bredde={'l'}
                    validate={(value) => {
                        const error = getRequiredFieldValidator()(value);
                        return error
                            ? {
                                  key: 'validation.nyfrilansoppdrag.frilansOppdragKategori.noValue',
                                  keepKeyUnaltered: true,
                              }
                            : undefined;
                    }}>
                    {getSelectFrilansKategoriOptions(intl)}
                </FrilansOppdragFormComponents.Select>
            </Box>

            {oppdrag.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV && (
                <Box margin="xl">
                    <FrilansOppdragFormComponents.RadioGroup
                        legend={intlHelper(intl, 'nyfrilansoppdrag.arbeidsgiver.styremedlem.spm')}
                        name={getFieldName(FrilansNyFormField.styremedlemHeleInntekt)}
                        radios={getYesOrNoRadios(intl, 'er-styremedlem')}
                        validate={getRequiredFieldValidator()}></FrilansOppdragFormComponents.RadioGroup>
                </Box>
            )}

            {visFrilansOppdragNormalarbeidstid(oppdrag) && (
                <Box>
                    <NormalarbeidstidSpørsmål
                        arbeidsforholdFieldName={parentFieldName}
                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                        arbeidsforhold={oppdrag}
                        erAktivtArbeidsforhold={true}
                        brukKunSnittPerUke={true}
                        frilanserOppdragType={oppdrag.frilansOppdragKategori}
                    />
                </Box>
            )}
        </ArbeidssituasjonPanel>
    );
};

export default FrilansForm;
