import React from 'react';
import { useIntl } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import Box from '@sif-common/core/components/box/Box';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { validateRequiredList, validateYesOrNoIsAnswered } from '@sif-common/core/validation/fieldValidations';
import VirksomhetListAndDialog from '@sif-common/forms/virksomhet/VirksomhetListAndDialog';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart = ({ formValues }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.selvstendig_harHattInntektSomSN}
                    legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </Box>
            {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES && (
                <Box margin="l">
                    <Panel>
                        <VirksomhetListAndDialog
                            name={AppFormField.selvstendig_virksomheter}
                            labels={{
                                listTitle: intlHelper(intl, 'selvstendig.list.tittel'),
                                addLabel: intlHelper(intl, 'selvstendig.list.leggTilLabel'),
                                modalTitle: intlHelper(intl, 'selvstendig.dialog.tittel'),
                            }}
                            hideFormFields={{ harRevisor: true }}
                            validate={validateRequiredList}
                        />
                    </Panel>
                </Box>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
