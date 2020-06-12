import React from 'react';
import { useIntl } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import Box from 'common/components/box/Box';
import { YesOrNo } from 'common/types/YesOrNo';
import { dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { validateRequiredField, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import FrilansEksempeltHtml from './FrilansEksempelHtml';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const FrilansFormPart = ({ formValues }: Props) => {
    const harHattInntektSomFrilanser = formValues[AppFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES;
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.frilans_harHattInntektSomFrilanser}
                    legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title="Hva er en frilanser?">
                            <FrilansEksempeltHtml />
                        </ExpandableInfo>
                    }
                />
            </Box>
            {harHattInntektSomFrilanser && (
                <Box margin="l">
                    <Panel>
                        <Box>
                            <AppForm.DatePicker
                                name={AppFormField.frilans_startdato}
                                label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                maxDate={dateToday}
                                validate={validateRequiredField}
                            />
                        </Box>
                        <Box margin="xl">
                            <AppForm.YesOrNoQuestion
                                name={AppFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>
                    </Panel>
                </Box>
            )}
        </>
    );
};

export default FrilansFormPart;
