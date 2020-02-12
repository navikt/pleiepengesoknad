import * as React from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import { Feature, isFeatureEnabled } from 'app/utils/featureToggleUtils';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { persistAndNavigateTo } from 'app/utils/navigationUtils';
import BostedUtlandListAndDialog from '@navikt/sif-common/lib/common/forms/bosted-utland/BostedUtlandListAndDialog';

type Props = CommonStepFormikProps & HistoryProps & StepConfigProps;

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, nextStepRoute, ...stepProps }) => {
    const { formValues } = stepProps;
    const intl = useIntl();

    return (
        <FormikStep
            id={StepID.MEDLEMSKAP}
            onValidFormSubmit={() => persistAndNavigateTo(history, StepID.MEDLEMSKAP, formValues, nextStepRoute)}
            history={history}
            {...stepProps}>
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
            <FormikYesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                name={AppFormField.harBoddUtenforNorgeSiste12Mnd}
                validate={validateYesOrNoIsAnswered}
                helperText={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
            />
            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) &&
                formValues.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                    <Box margin="m">
                        <BostedUtlandListAndDialog<AppFormField>
                            name={name}
                            minDate={date1YearAgo}
                            maxDate={date1YearFromNow}
                            labels={{
                                addLabel: 'Legg til nytt utenlandsopphold',
                                listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                                modalTitle: 'Utenlandsopphold siste 12 måneder'
                            }}
                        />
                    </Box>
                )}
            <Box margin="xl">
                <FormikYesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    helperText={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                />
            </Box>
            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) &&
                formValues.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                    <Box margin="m">
                        <BostedUtlandListAndDialog<AppFormField>
                            minDate={dateToday}
                            maxDate={date1YearFromNow}
                            name={AppFormField.utenlandsoppholdNeste12Mnd}
                            labels={{
                                addLabel: 'Legg til nytt utenlandsopphold',
                                listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                                modalTitle: 'Utenlandsopphold neste 12 måneder'
                            }}
                        />
                    </Box>
                )}
        </FormikStep>
    );
};

export default MedlemsskapStep;
