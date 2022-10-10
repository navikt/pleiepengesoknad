import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, date1YearFromNow } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { BostedUtland } from '@navikt/sif-common-forms/lib/bosted-utland/types';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { validateUtenlandsoppholdNeste12Mnd, validateUtenlandsoppholdSiste12Mnd } from './medlemskapFieldValidations';

const getFomForBostedNeste12 = (bosted: BostedUtland[], søknadsdato: Date): Date => {
    const sisteBosted = bosted.length > 0 ? bosted[bosted.length - 1] : undefined;
    if (sisteBosted) {
        return dayjs(sisteBosted.tom).isSame(søknadsdato, 'day')
            ? dayjs(søknadsdato).add(1, 'day').toDate()
            : søknadsdato;
    }
    return søknadsdato;
};

type Props = {
    søknadsdato: Date;
};
const MedlemsskapStep = ({ onValidSubmit, søknadsdato }: StepConfigProps & Props) => {
    const { values } = useFormikContext<SøknadFormData>();
    const intl = useIntl();
    const neste12FomDate = getFomForBostedNeste12(values.utenlandsoppholdSiste12Mnd, søknadsdato);
    return (
        <SøknadFormStep id={StepID.MEDLEMSKAP} onValidFormSubmit={onValidSubmit}>
            <Box padBottom="xxl">
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    {intlHelper(intl, 'step.medlemskap.veileder')}{' '}
                    <Lenke href={getLenker().medlemskap} target="_blank">
                        nav.no
                    </Lenke>
                    .
                </CounsellorPanel>
            </Box>
            <SøknadFormComponents.YesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                name={SøknadFormField.harBoddUtenforNorgeSiste12Mnd}
                validate={getYesOrNoValidator()}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'HvaBetyrDette')}>
                        {intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                    </ExpandableInfo>
                }
                data-testid="medlemsskap-annetLandSiste12"
            />
            {values.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.utenlandsoppholdSiste12Mnd}
                        minDate={date1YearAgo}
                        maxDate={dayjs(søknadsdato).subtract(1, 'day').toDate()}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemskap.leggTilKnapp'),
                            listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                            modalTitle: intlHelper(intl, 'step.medlemskap.utenlandsoppholdSiste12'),
                        }}
                        validate={validateUtenlandsoppholdSiste12Mnd}
                        data-testid="utenlandsoppholdSiste12Mnd"
                    />
                </FormBlock>
            )}
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={SøknadFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'HvaBetyrDette')}>
                            {intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                        </ExpandableInfo>
                    }
                    data-testid="medlemsskap-annetLandNeste12"
                />
            </FormBlock>
            {values.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l" data-testid="bostedUtlandList-annetLandNeste12">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.utenlandsoppholdNeste12Mnd}
                        minDate={neste12FomDate}
                        maxDate={date1YearFromNow}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemskap.leggTilKnapp'),
                            listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.listeTittel'),
                            modalTitle: intlHelper(intl, 'step.medlemskap.utenlandsoppholdNeste12'),
                        }}
                        validate={validateUtenlandsoppholdNeste12Mnd}
                    />
                </FormBlock>
            )}
        </SøknadFormStep>
    );
};

export default MedlemsskapStep;
