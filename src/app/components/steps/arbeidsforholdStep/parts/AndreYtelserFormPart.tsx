import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { AndreYtelserFraNAV, AppFormField, PleiepengesøknadFormData } from '../../../../types/PleiepengesøknadFormData';
import AppForm from '../../../app-form/AppForm';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';

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
                    validate={getYesOrNoValidator()}
                />
            </Box>
            {mottarAndreYtelser === YesOrNo.YES && (
                <Box margin="l">
                    <ResponsivePanel>
                        <AppForm.CheckboxPanelGroup
                            name={AppFormField.andreYtelser}
                            legend={intlHelper(intl, 'steg.arbeidsforhold.andreYtelser.hvilke.spm')}
                            checkboxes={Object.keys(AndreYtelserFraNAV).map((ytelse) => ({
                                label: intlHelper(intl, `NAV_YTELSE.${ytelse}`),
                                value: ytelse,
                            }))}
                            validate={getListValidator({ required: true })}
                        />
                    </ResponsivePanel>
                </Box>
            )}
        </>
    );
};

export default AndreYtelserFormPart;
