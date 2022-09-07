import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { SøknadsimportEndringstype } from '../../types/ImportertSøknad';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { getMedlemsskapDateRanges } from '../../utils/medlemsskapUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { validateUtenlandsoppholdNeste12Mnd, validateUtenlandsoppholdSiste12Mnd } from './medlemskapFieldValidations';
import { useSøknadsdataContext } from '../SøknadsdataContext';

type Props = {
    søknadsdato: Date;
};

const MedlemsskapStep = ({ onValidSubmit, søknadsdato }: StepConfigProps & Props) => {
    const { values } = useFormikContext<SøknadFormValues>();
    const intl = useIntl();
    const { neste12Måneder, siste12Måneder } = getMedlemsskapDateRanges(søknadsdato);
    const { importertSøknadMetadata } = useSøknadsdataContext();

    const bostederEndretVedImport =
        importertSøknadMetadata !== undefined &&
        importertSøknadMetadata.endringer.some((e) => e.type === SøknadsimportEndringstype.endretBostedUtland);

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
            {bostederEndretVedImport && (
                <Box padBottom="xl">
                    <AlertStripeInfo>
                        Informasjonen nedenfor er endret fra det du sendte inn i forrige søknad. Dette er fordi
                        søknadsdatoen er en annen. Vennligst se over at all informasjon fortsatt stemmer.
                    </AlertStripeInfo>
                </Box>
            )}
            <SøknadFormComponents.YesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                name={SøknadFormField.harBoddUtenforNorgeSiste12Mnd}
                validate={getYesOrNoValidator()}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'HvaBetyrDette')}>
                        {intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                    </ExpandableInfo>
                }
            />
            {values.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
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
                />
            </FormBlock>
            {values.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.utenlandsoppholdNeste12Mnd}
                        minDate={neste12Måneder.from}
                        maxDate={neste12Måneder.to}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemskap.leggTilKnapp'),
                            listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
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
