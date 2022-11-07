import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
// import { Element } from 'nav-frontend-typografi';
import { Arbeidsgiver } from '../../../../types';
// import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import ArbeidssituasjonPanel from '../arbeidssituasjon-panel/ArbeidssituasjonPanel';
import FrilansIcon from '../../../../components/frilans-icon/FrilansIconSvg';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    FrilansFormData,
    FrilansOppdragFormField,
    FrilansOppdragKategori,
    FrilansOppdragSvar,
    YesOrNoRadio,
} from '../../../../types/FrilansFormData';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import NormalarbeidstidSpørsmål from '../normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getFrilanserSluttdatoValidator } from '../../validation/frilansSluttdatoValidator';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../../types/ArbeidsforholdFormValues';

const FrilansOppdragFormComponents = getTypedFormComponents<
    FrilansOppdragFormField,
    ArbeidsforholdFrilanserMedOppdragFormValues,
    ValidationError
>();
interface Props {
    frilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues[];
    parentFieldName: string;
    formValues: FrilansFormData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const renderTidsrom = ({ ansattFom, ansattTom }: Arbeidsgiver) => {
    if (ansattFom && ansattTom) {
        return (
            <FormattedMessage
                id="frilansoppdragListe.tidsrom.avsluttet"
                values={{ fra: prettifyDateExtended(ansattFom), til: prettifyDateExtended(ansattTom) }}
            />
        );
    }
    if (ansattFom) {
        return (
            <FormattedMessage
                id="frilansoppdragListe.tidsrom.pågående"
                values={{ fra: prettifyDateExtended(ansattFom) }}
            />
        );
    }
    return undefined;
};

const FrilansoppdragListe: React.FC<Props> = ({
    frilansoppdrag,
    parentFieldName,
    formValues,
    søknadsperiode,
    søknadsdato,
}) => {
    const intl = useIntl();
    const getFieldName = (field: FrilansOppdragFormField, index: number): FrilansOppdragFormField =>
        `${parentFieldName}.${index}.${field}` as any;
    const getSelectOptions = () => {
        return Object.keys(FrilansOppdragKategori).map((kategori, index) => (
            <option key={index} value={kategori}>
                {intlHelper(intl, `frilansoppdragListe.oppdrag.${kategori}`)}
            </option>
        ));
    };

    const søkerHarFrilansoppdrag = true;
    return (
        <>
            {frilansoppdrag.map((oppdrag, index) => (
                <ArbeidssituasjonPanel
                    title={oppdrag.arbeidsgiver.navn}
                    description={renderTidsrom(oppdrag.arbeidsgiver)}
                    titleIcon={<FrilansIcon />}
                    key={oppdrag.arbeidsgiver.id}>
                    <FormBlock>
                        <FrilansOppdragFormComponents.RadioGroup
                            legend={intlHelper(intl, 'frilansoppdragListe.oppdrag.spm')}
                            name={getFieldName(FrilansOppdragFormField.frilansOppdragIPerioden, index)}
                            radios={Object.keys(FrilansOppdragSvar).map((svar) => ({
                                label: intlHelper(intl, `frilansoppdragListe.oppdrag.${svar}`),
                                //TODO
                                value: svar,
                            }))}
                            validate={getRequiredFieldValidator()}
                            // checked={formValues.relasjonTilBarnet}
                        ></FrilansOppdragFormComponents.RadioGroup>
                    </FormBlock>
                    <Box margin="l">
                        <FrilansOppdragFormComponents.Select
                            name={getFieldName(FrilansOppdragFormField.frilansOppdragKategori, index)}
                            label={'Hvilken type frilansoppdrag er FRILANSER ISAKSEN?'}
                            bredde={'l'}
                            validate={getRequiredFieldValidator()}>
                            <option value="">Velg kategori</option>
                            {getSelectOptions()}
                        </FrilansOppdragFormComponents.Select>
                    </Box>
                    <Box margin="l">
                        <FrilansOppdragFormComponents.RadioGroup
                            legend={intlHelper(intl, 'frilansoppdragListe.oppdrag.styremedlem.spm')}
                            name={getFieldName(FrilansOppdragFormField.styremedlemHeleInntekt, index)}
                            radios={[
                                {
                                    label: intlHelper(intl, `${YesOrNoRadio.JA}`),
                                    value: YesOrNoRadio.JA,
                                },
                                {
                                    label: intlHelper(intl, `${YesOrNoRadio.NEI}`),
                                    value: YesOrNoRadio.NEI,
                                },
                            ]}
                            validate={getRequiredFieldValidator()}></FrilansOppdragFormComponents.RadioGroup>
                    </Box>
                    <Box>
                        <FrilansOppdragFormComponents.DatePicker
                            name={getFieldName(FrilansOppdragFormField.sluttdato, index)}
                            label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                            showYearSelector={true}
                            minDate={datepickerUtils.getDateFromDateString(formValues.startdato)}
                            maxDate={søknadsdato}
                            validate={getFrilanserSluttdatoValidator(
                                formValues,
                                søknadsperiode,
                                søknadsdato,
                                søkerHarFrilansoppdrag
                            )}
                        />
                    </Box>
                    <Box>
                        <NormalarbeidstidSpørsmål
                            arbeidsforholdFieldName={`${parentFieldName}.${index}`}
                            arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                            arbeidsforhold={formValues.arbeidsforhold || {}}
                            erAktivtArbeidsforhold={true}
                            brukKunSnittPerUke={true}
                        />
                    </Box>
                </ArbeidssituasjonPanel>
            ))}
        </>
    );
};

export default FrilansoppdragListe;
