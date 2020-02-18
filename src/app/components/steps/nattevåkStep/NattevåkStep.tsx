import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { HistoryProps } from '@navikt/sif-common/lib/common/types/History';
import { useIntl } from 'react-intl';
import FormikStep from '../../formik-step/FormikStep';
import { persistAndNavigateTo } from '../../../utils/navigationUtils';
import FormikYesOrNoQuestion from '@navikt/sif-common/lib/common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common/lib/common/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import FormikTextarea from '@navikt/sif-common/lib/common/formik/formik-textarea/FormikTextarea';
import { validateNattevåkTilleggsinfo } from '../../../validation/fieldValidations';

interface StepProps {
    formikProps: PleiepengesøknadFormikProps;
    handleSubmit: () => void;
}

type Props = StepProps & HistoryProps & StepConfigProps;

const NattevåkStep: React.FunctionComponent<Props> = ({
    history,
    formikProps: { values },
    nextStepRoute,
    ...stepProps
}) => {
    const intl = useIntl();
    const { harNattevåk } = values;
    return (
        <FormikStep
            id={StepID.NATTEVÅK}
            onValidFormSubmit={() => persistAndNavigateTo(history, StepID.NATTEVÅK, values, nextStepRoute)}
            history={history}
            {...stepProps}
            formValues={values}>
            <FormikYesOrNoQuestion
                legend={intlHelper(intl, 'steg.nattevåk.spm')}
                name={AppFormField.harNattevåk}
                validate={validateYesOrNoIsAnswered}
            />
            {harNattevåk === YesOrNo.YES && (
                <Box margin="xl">
                    <FormikTextarea<AppFormField>
                        name={AppFormField.harNattevåk_ekstrainfo}
                        label={intlHelper(intl, 'steg.nattevåk.tilleggsinfo.spm')}
                        validate={validateNattevåkTilleggsinfo}
                        maxLength={1000}
                    />
                </Box>
            )}
        </FormikStep>
    );
};

export default NattevåkStep;
