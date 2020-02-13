import React from 'react';
import FormikDatepicker from 'common/formik/formik-datepicker/FormikDatepicker';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import Box from 'common/components/box/Box';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import { date10MonthsAgo, dateToday } from 'common/utils/dateUtils';
import Panel from 'nav-frontend-paneler';
import { validateRequiredField } from 'common/validation/fieldValidations';
import FrilansoppdragListAndDialog from 'common/forms/frilans/FrilansoppdragListAndDialog';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const FrilansFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
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
                        <FrilansoppdragListAndDialog<AppFormField>
                            name={AppFormField.frilans_oppdrag}
                            labels={{
                                listTitle: 'Frilansoppdrag',
                                modalTitle: 'Frilansoppdrag',
                                addLabel: 'Legg til frilansoppdrag'
                            }}
                            minDate={date10MonthsAgo}
                            maxDate={dateToday}
                        />
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
