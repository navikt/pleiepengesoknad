import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import {
    validateRequiredField, validateRequiredList
} from '@navikt/sif-common/lib/common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import VirksomhetListAndDialog from 'common/forms/virksomhet/VirksomhetListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    return (
        <>
            <Box margin="l">
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.selvstendig_harHattInntektSomSN}
                    legend={'Har du hatt inntekt som selvstendig næringsdrivende siste 10 måneder?'}
                    validate={validateRequiredField}
                />
            </Box>
            {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES && (
                <Box margin="l">
                    <Panel>
                        <VirksomhetListAndDialog
                            name={AppFormField.selvstendig_virksomheter}
                            labels={{
                                listTitle: 'Registrerte virksomheter',
                                addLabel: 'Legg til virksomhet',
                                modalTitle: 'Virksomhet'
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
