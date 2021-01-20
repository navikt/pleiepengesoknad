import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import VirksomhetListAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetListAndDialog';
import Panel from 'nav-frontend-paneler';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
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
