import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import Panel from 'nav-frontend-paneler';
import { AndreYtelserFraNAV, AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const AndreYtelserFormPart = ({ formValues: { mottarAndreYtelser } }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.mottarAndreYtelser}
                    legend={intlHelper(intl, 'steg.arbeidsforhold.andreYtelser.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </Box>
            {mottarAndreYtelser === YesOrNo.YES && (
                <Box margin="l">
                    <Panel>
                        <AppForm.CheckboxPanelGroup
                            name={AppFormField.andreYtelser}
                            legend={intlHelper(intl, 'steg.arbeidsforhold.andreYtelser.hvilke.spm')}
                            checkboxes={Object.keys(AndreYtelserFraNAV).map((ytelse) => ({
                                label: intlHelper(intl, `NAV_YTELSE.${ytelse}`),
                                value: ytelse,
                            }))}
                            validate={validateRequiredList}
                        />
                    </Panel>
                </Box>
            )}
        </>
    );
};

export default AndreYtelserFormPart;
