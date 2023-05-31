import React from 'react';
import { useIntl } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import SifGuidePanel from '@navikt/sif-common-core-ds/lib/components/sif-guide-panel/SifGuidePanel';
import ExpandableInfo from '@navikt/sif-common-core-ds/lib/components/expandable-info/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core-ds/lib/atoms/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik-ds/lib/validation';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms-ds/lib/forms/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import getLenker from '../../lenker';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { getMedlemsskapDateRanges } from '../../utils/medlemsskapUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { validateUtenlandsoppholdNeste12Mnd, validateUtenlandsoppholdSiste12Mnd } from './medlemskapFieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik-ds/lib';
import { Link } from '@navikt/ds-react';

type Props = {
    søknadsdato: Date;
};

const MedlemsskapStep = ({ onValidSubmit, søknadsdato }: StepConfigProps & Props) => {
    const { values } = useFormikContext<SøknadFormValues>();
    const intl = useIntl();
    const { neste12Måneder, siste12Måneder } = getMedlemsskapDateRanges(søknadsdato);

    return (
        <SøknadFormStep id={StepID.MEDLEMSKAP} onValidFormSubmit={onValidSubmit}>
            <Block padBottom="xxl">
                <SifGuidePanel>
                    {intlHelper(intl, 'step.medlemskap.veileder')}{' '}
                    <Link href={getLenker().medlemskap} target="_blank">
                        nav.no
                    </Link>
                    .
                </SifGuidePanel>
            </Block>
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
                    <div data-testid="bostedUtlandList-annetLandSiste12">
                        <BostedUtlandListAndDialog<SøknadFormField>
                            name={SøknadFormField.utenlandsoppholdSiste12Mnd}
                            minDate={siste12Måneder.from}
                            maxDate={siste12Måneder.to}
                            labels={{
                                addLabel: intlHelper(intl, 'step.medlemskap.leggTilKnapp'),
                                listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                                modalTitle: intlHelper(intl, 'step.medlemskap.utenlandsoppholdSiste12'),
                            }}
                            validate={validateUtenlandsoppholdSiste12Mnd}
                        />
                    </div>
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
                <FormBlock margin="l">
                    <div data-testid="bostedUtlandList-annetLandNeste12">
                        <BostedUtlandListAndDialog<SøknadFormField>
                            name={SøknadFormField.utenlandsoppholdNeste12Mnd}
                            minDate={neste12Måneder.from}
                            maxDate={neste12Måneder.to}
                            labels={{
                                addLabel: intlHelper(intl, 'step.medlemskap.leggTilKnapp'),
                                listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.listeTittel'),
                                modalTitle: intlHelper(intl, 'step.medlemskap.utenlandsoppholdNeste12'),
                            }}
                            validate={validateUtenlandsoppholdNeste12Mnd}
                        />
                    </div>
                </FormBlock>
            )}
        </SøknadFormStep>
    );
};

export default MedlemsskapStep;
