import * as React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@sif-common/core/components/form-block/FormBlock';
import { BostedUtland } from '@sif-common/forms/bosted-utland/types';
import { useFormikContext } from 'formik';
import moment from 'moment';
import Lenke from 'nav-frontend-lenker';
import Box from '@sif-common/core/components/box/Box';
import CounsellorPanel from '@sif-common/core/components/counsellor-panel/CounsellorPanel';
import { date1YearAgo, date1YearFromNow, dateToday } from '@sif-common/core/utils/dateUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@sif-common/core/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import getLenker from '../../../lenker';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import BostedsoppholdIUtlandetFormPart from './BostedsoppholdIUtlandetFormPart';
import { medlemskapQuestions } from './medlemskapConfig';
import ExpandableInfo from '@sif-common/core/components/expandable-content/ExpandableInfo';

const getFomForBostedNeste12 = (bosted: BostedUtland[]): Date => {
    const sisteBosted = bosted.length > 0 ? bosted[bosted.length - 1] : undefined;
    if (sisteBosted) {
        return moment(sisteBosted.tom).isSame(dateToday, 'day') ? moment(dateToday).add(1, 'day').toDate() : dateToday;
    }
    return dateToday;
};

const MedlemsskapStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const intl = useIntl();
    const questions = medlemskapQuestions.getVisbility(values);

    const neste12FomDate = getFomForBostedNeste12(values.utenlandsoppholdSiste12Mnd);

    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={onValidSubmit}>
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
            <AppForm.YesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                name={AppFormField.harBoddUtenforNorgeSiste12Mnd}
                validate={questions.validate(AppFormField.harBoddUtenforNorgeSiste12Mnd)}
                description={
                    <ExpandableInfo title="Hva betyr dette?">
                        {intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                    </ExpandableInfo>
                }
            />
            {questions.isVisible(AppFormField.utenlandsoppholdSiste12Mnd) && (
                <FormBlock margin="l">
                    <BostedsoppholdIUtlandetFormPart
                        periode={{ from: date1YearAgo, to: dateToday }}
                        name={AppFormField.utenlandsoppholdSiste12Mnd}
                        labels={{
                            addLabel: 'Legg til nytt utenlandsopphold',
                            listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                            modalTitle: 'Utenlandsopphold siste 12 måneder',
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title="Hva betyr dette?">
                            {intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {questions.isVisible(AppFormField.utenlandsoppholdNeste12Mnd) && (
                <FormBlock margin="l">
                    <BostedsoppholdIUtlandetFormPart
                        periode={{ from: neste12FomDate, to: date1YearFromNow }}
                        name={AppFormField.utenlandsoppholdNeste12Mnd}
                        labels={{
                            addLabel: 'Legg til nytt utenlandsopphold',
                            listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                            modalTitle: 'Utenlandsopphold neste 12 måneder',
                        }}
                    />
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default MedlemsskapStep;
