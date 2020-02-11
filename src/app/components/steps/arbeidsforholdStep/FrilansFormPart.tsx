import React from 'react';
import FormikDatepicker from 'common/formik/formik-datepicker/FormikDatepicker';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import Box from 'common/components/box/Box';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import { Field, FieldProps } from 'formik';
import { Frilansoppdrag } from 'common/forms/frilans/types';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { useIntl } from 'react-intl';
import ModalFormAndList from 'common/components/modal-form-and-list/ModalFormAndList';
import FrilansoppdragForm from 'common/forms/frilans/FrilansoppdragForm';
import { date10MonthsAgo, dateToday } from 'common/utils/dateUtils';
import FrilansOppdragListe from 'common/forms/frilans/FrilansoppdragListe';
import Panel from 'nav-frontend-paneler';
import { validateRequiredField } from 'common/validation/fieldValidations';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const FrilansFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const intl = useIntl();
    const harHattInntektSomFrilanser = formValues[AppFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES;
    const harHattInntektFraFamilie = formValues[AppFormField.frilans_harHattOppdragForFamilieVenner] === YesOrNo.YES;
    return (
        <>
            <FormikYesOrNoQuestion<AppFormField>
                name={AppFormField.frilans_harHattInntektSomFrilanser}
                legend="Har du jobbet og hatt inntekt som frilanser de siste 10 månedene?"
                validate={validateRequiredField}
                helperText={
                    <>
                        Eksempel på hvem som kan være frilansere er:
                        <ul>
                            <li>Musikere</li>
                            <li>Tekstforfattere</li>
                            <li>Skuespillere</li>
                            <li>Journalister</li>
                            <li>Oversettere</li>
                            <li>
                                Folkevalgt, politikere i kommuner, fylkeskommuner og på Stortinget som får godtgjørelse
                                for politisk arbeid
                            </li>
                            <li>Støttekontakt</li>
                            <li>Fosterforeldre, og personer med omsorgslønn</li>
                        </ul>
                        Hvis du er usikker på om du er frilanser, kan du lese mer om hva det betyr å være frilanser på
                        skatteetaten sinhjemmeside{' '}
                    </>
                }
            />
            {harHattInntektSomFrilanser && (
                <Panel>
                    <Box>
                        <FormikDatepicker<AppFormField>
                            name={AppFormField.frilans_startdato}
                            label="Når startet du som frilanser?"
                            showYearSelector={true}
                            dateLimitations={{ maksDato: dateToday }}
                            validate={validateRequiredField}
                        />
                    </Box>
                    <Box margin="xl">
                        <FormikYesOrNoQuestion<AppFormField>
                            name={AppFormField.frilans_jobberFortsattSomFrilans}
                            legend="Jobber du fortsatt som frilanser?"
                            validate={validateRequiredField}
                        />
                    </Box>
                    <Box margin="xl">
                        <FormikYesOrNoQuestion<AppFormField>
                            name={AppFormField.frilans_harHattOppdragForFamilieVenner}
                            legend="Har du hatt oppdrag for nær venn eller familie de 10 siste månedene?"
                            validate={validateRequiredField}
                        />
                    </Box>
                    {harHattInntektFraFamilie && (
                        <Field name={AppFormField.frilans_oppdrag}>
                            {({
                                field,
                                form: { errors, setFieldValue, status, submitCount }
                            }: FieldProps<Frilansoppdrag[]>) => {
                                const errorMsgProps = isValidationErrorsVisible(status, submitCount)
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : {};

                                const oppdrag: Frilansoppdrag[] = field.value || [];

                                return (
                                    <ModalFormAndList<Frilansoppdrag>
                                        labels={{
                                            listTitle: 'Frilansoppdrag',
                                            modalTitle: 'Frilansoppdrag',
                                            addLabel: 'Legg til frilansoppdrag'
                                        }}
                                        error={errorMsgProps?.feil}
                                        items={oppdrag}
                                        onChange={(value) => setFieldValue(field.name, value)}
                                        listRenderer={(onEdit, onDelete) => (
                                            <FrilansOppdragListe
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                oppdrag={oppdrag}
                                            />
                                        )}
                                        formRenderer={(onSubmit, onCancel, oppdragData) => (
                                            <FrilansoppdragForm
                                                oppdrag={oppdragData}
                                                onSubmit={onSubmit}
                                                onCancel={onCancel}
                                                minDato={date10MonthsAgo}
                                                maksDato={dateToday}
                                            />
                                        )}
                                    />
                                );
                            }}
                        </Field>
                    )}
                    <Box margin="xl">
                        <FormikYesOrNoQuestion<AppFormField>
                            name={AppFormField.frilans_harInntektSomFosterforelder}
                            legend="Har du inntekt som fosterforelder?"
                            validate={validateRequiredField}
                        />
                    </Box>
                </Panel>
            )}
        </>
    );
};

export default FrilansFormPart;
