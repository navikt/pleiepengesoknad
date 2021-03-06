import * as React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { BostedUtland } from '@navikt/sif-common-forms/lib/bosted-utland/types';
import { useFormikContext } from 'formik';
import moment from 'moment';
import Lenke from 'nav-frontend-lenker';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import getLenker from '../../../lenker';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import { validateUtenlandsoppholdNeste12Mnd, validateUtenlandsoppholdSiste12Mnd } from './medlemskapFieldValidations';

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
    const neste12FomDate = getFomForBostedNeste12(values.utenlandsoppholdSiste12Mnd);
    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={onValidSubmit}>
            <Box padBottom="xxl">
                <CounsellorPanel>
                    {intlHelper(intl, 'step.medlemskap.veileder')}{' '}
                    <Lenke href={getLenker().medlemskap} target="_blank">
                        nav.no
                    </Lenke>
                    .
                </CounsellorPanel>
            </Box>
            <AppForm.YesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                name={AppFormField.harBoddUtenforNorgeSiste12Mnd}
                validate={getYesOrNoValidator()}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'HvaBetyrDette')}>
                        {intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                    </ExpandableInfo>
                }
            />
            {values.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<AppFormField>
                        name={AppFormField.utenlandsoppholdSiste12Mnd}
                        minDate={date1YearAgo}
                        maxDate={dateToday}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemskap.leggTilKnapp'),
                            listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                            modalTitle: intlHelper(intl, 'step.medlemskap.utenlandsoppholdSiste12'),
                        }}
                        validate={validateUtenlandsoppholdSiste12Mnd}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'HvaBetyrDette')}>
                            {intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {values.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<AppFormField>
                        name={AppFormField.utenlandsoppholdNeste12Mnd}
                        minDate={neste12FomDate}
                        maxDate={date1YearFromNow}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemskap.leggTilKnapp'),
                            listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                            modalTitle: intlHelper(intl, 'step.medlemskap.utenlandsoppholdNeste12'),
                        }}
                        validate={validateUtenlandsoppholdNeste12Mnd}
                    />
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default MedlemsskapStep;
