import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../../../common/components/yes-or-no-question/YesOrNoQuestion';
import { validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import { YesOrNo } from 'common/types/YesOrNo';
import { dateToday, date1YearFromNow, date1YearAgo } from 'common/utils/dateUtils';
import { isFeatureEnabled, Feature } from 'app/utils/featureToggleUtils';
import BostedsoppholdIUtlandetFormPart from './BostedsoppholdIUtlandetFormPart';

type Props = CommonStepFormikProps & HistoryProps & StepConfigProps;

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, nextStepRoute, ...stepProps }) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { formValues } = stepProps;
    const intl = useIntl();

    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={navigate} history={history} {...stepProps}>
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
                        <BostedsoppholdIUtlandetFormPart
                            periode={{ from: date1YearAgo, to: dateToday }}
                            name={AppFormField.utenlandsoppholdSiste12Mnd}
                            labels={{
                                addLabel: 'Legg til nytt utenlandsopphold',
                                listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                                modalTitle: 'Utenlandsopphold siste 12 måneder'
                            }}
                        />
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
                        <BostedsoppholdIUtlandetFormPart
                            periode={{ from: dateToday, to: date1YearFromNow }}
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
