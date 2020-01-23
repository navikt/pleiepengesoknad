import * as React from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../../../common/components/yes-or-no-question/YesOrNoQuestion';
import {
    validateUtenlandsoppholdNeste12Mnd,
    validateUtenlandsoppholdSiste12Mnd,
    validateYesOrNoIsAnswered
} from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import { Field, FieldProps } from 'formik';
import UtenlandsoppholdInput from 'common/forms/utenlandsopphold';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { showValidationErrors } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import { Feature, isFeatureEnabled } from 'app/utils/featureToggleUtils';
import { persist } from '../../../api/api';

type Props = CommonStepFormikProps & HistoryProps & StepConfigProps;

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, nextStepRoute, ...stepProps }) => {
    const { formValues } = stepProps;
    const persistAndNavigateTo = ( lastStepID: StepID, data: PleiepengesøknadFormData, nextStep?: string) => {
        persist(data, lastStepID);
        if (nextStep) {
            history.push(nextStep)
        }
    };
    const intl = useIntl();

    return (
        <FormikStep
            id={StepID.MEDLEMSKAP}
            onValidFormSubmit={() => persistAndNavigateTo(StepID.MEDLEMSKAP, formValues, nextStepRoute)}
            history={history} {...stepProps}>
                <Box padBottom="xxl">
                    <CounsellorPanel>
                        Medlemskap i folketrygden er nøkkelen til rettigheter fra NAV. Hvis du bor eller jobber i Norge er
                        du vanligvis medlem. Du kan lese mer om medlemskap på{' '}
                        <Lenke href={getLenker().medlemskap} target="_blank">
                            nav.no
                        </Lenke>
                        .
                    </CounsellorPanel>
                </Box>
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                    name={AppFormField.harBoddUtenforNorgeSiste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    helperText={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
            />
            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) &&
                formValues.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                    <Box margin="m">
                        <Field
                            name={AppFormField.utenlandsoppholdSiste12Mnd}
                            validate={validateUtenlandsoppholdSiste12Mnd}>
                            {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                                const errorMsgProps = showValidationErrors(status, submitCount)
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : {};
                                return (
                                    <UtenlandsoppholdInput
                                        labels={{
                                            listeTittel: intlHelper(
                                                intl,
                                                'steg.medlemsskap.annetLandSiste12.listeTittel'
                                            )
                                        }}
                                        utenlandsopphold={field.value}
                                        tidsrom={{ from: date1YearAgo, to: dateToday }}
                                        onChange={(utenlandsopphold: Utenlandsopphold[]) => {
                                            setFieldValue(field.name, utenlandsopphold);
                                        }}
                                        {...errorMsgProps}
                                    />
                                );
                            }}
                        </Field>
                    </Box>
                )}
            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    helperText={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                />
            </Box>
            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) &&
                formValues.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                    <Box margin="m">
                        <Field
                            name={AppFormField.utenlandsoppholdNeste12Mnd}
                            validate={validateUtenlandsoppholdNeste12Mnd}>
                            {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                                const errorMsgProps = showValidationErrors(status, submitCount)
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : {};
                                return (
                                    <UtenlandsoppholdInput
                                        labels={{
                                            listeTittel: intlHelper(
                                                intl,
                                                'steg.medlemsskap.annetLandSiste12.listeTittel'
                                            )
                                        }}
                                        utenlandsopphold={field.value}
                                        tidsrom={{ from: dateToday, to: date1YearFromNow }}
                                        onChange={(utenlandsopphold: Utenlandsopphold[]) => {
                                            setFieldValue(field.name, utenlandsopphold);
                                        }}
                                        {...errorMsgProps}
                                    />
                                );
                            }}
                        </Field>
                    </Box>
                )}
        </FormikStep>
    );
};

export default MedlemsskapStep;
