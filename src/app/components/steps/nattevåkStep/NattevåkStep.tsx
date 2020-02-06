import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';

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
