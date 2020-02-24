import React from 'react';
import { useIntl } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import Box from 'common/components/box/Box';
import FormikDatepicker from 'common/formik/formik-datepicker/FormikDatepicker';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import FrilansoppdragListAndDialog from 'common/forms/frilans/FrilansoppdragListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { date10MonthsAgo, dateToday } from 'common/utils/dateUtils';
import { validateRequiredField, validateRequiredList } from 'common/validation/fieldValidations';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import FrilansEksempeltHtml from './FrilansEksempelHtml';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const FrilansFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const harHattInntektSomFrilanser = formValues[AppFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES;
    const harHattInntektFraFamilie = formValues[AppFormField.frilans_harHattOppdragForFamilieVenner] === YesOrNo.YES;
    const intl = useIntl();
    return (
        <>
            <FormikYesOrNoQuestion<AppFormField>
                name={AppFormField.frilans_harHattInntektSomFrilanser}
                legend={intlHelper(intl, 'frilans.harHattInntekt.spm')}
                validate={validateRequiredField}
                helperText={<FrilansEksempeltHtml />}
            />
            {harHattInntektSomFrilanser && (
                <Panel>
                    <Box>
                        <FormikDatepicker<AppFormField>
                            name={AppFormField.frilans_startdato}
                            label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                            showYearSelector={true}
                            dateLimitations={{ maksDato: dateToday }}
                            validate={validateRequiredField}
                        />
                    </Box>
                    <Box margin="xl">
                        <FormikYesOrNoQuestion<AppFormField>
                            name={AppFormField.frilans_jobberFortsattSomFrilans}
                            legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                            validate={validateRequiredField}
                        />
                    </Box>
                    <Box margin="xl">
                        <FormikYesOrNoQuestion<AppFormField>
                            name={AppFormField.frilans_harHattOppdragForFamilieVenner}
                            legend={intlHelper(intl, 'frilanser.oppdragFamilieVenner.spm')}
                            validate={validateRequiredField}
                        />
                    </Box>
                    {harHattInntektFraFamilie && (
                        <FrilansoppdragListAndDialog<AppFormField>
                            name={AppFormField.frilans_oppdrag}
                            minDate={date10MonthsAgo}
                            maxDate={dateToday}
                            validate={validateRequiredList}
                            labels={{
                                listTitle: intlHelper(intl, 'frilanser.list.tittel'),
                                addLabel: intlHelper(intl, 'frilanser.list.leggTilLabel'),
                                modalTitle: intlHelper(intl, 'frilanser.dialog.tittel')
                            }}
                        />
                    )}
                    <Box margin="xl">
                        <FormikYesOrNoQuestion<AppFormField>
                            name={AppFormField.frilans_harInntektSomFosterforelder}
                            legend={intlHelper(intl, 'frilanser.inntektFosterforelder.spm')}
                            validate={validateRequiredField}
                        />
                    </Box>
                </Panel>
            )}
        </>
    );
};

export default FrilansFormPart;
