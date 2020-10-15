import React from 'react';
import { useIntl } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import Box from '@sif-common/core/components/box/Box';
import ExpandableInfo from '@sif-common/core/components/expandable-content/ExpandableInfo';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import { dateToday } from '@sif-common/core/utils/dateUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import {
    validateAll,
    validateRequiredField,
    validateYesOrNoIsAnswered,
} from '@sif-common/core/validation/fieldValidations';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import { validateFormikDatepickerValue } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FrilansEksempeltHtml from './FrilansEksempelHtml';

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
                                validate={validateAll([validateFormikDatepickerValue, validateRequiredField])}
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
