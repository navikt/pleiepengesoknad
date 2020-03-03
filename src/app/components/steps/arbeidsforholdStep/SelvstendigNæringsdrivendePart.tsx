import React from 'react';
import { useIntl } from 'react-intl';
import { Panel } from 'nav-frontend-paneler';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import { validateRequiredList } from '@navikt/sif-common/lib/common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import VirksomhetListAndDialog from 'common/forms/virksomhet/VirksomhetListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.selvstendig_harHattInntektSomSN}
                    legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                    isRequired={true}
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
                                modalTitle: intlHelper(intl, 'selvstendig.dialog.tittel')
                            }}
                            validate={validateRequiredList}
                        />
                    </Panel>
                </Box>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
