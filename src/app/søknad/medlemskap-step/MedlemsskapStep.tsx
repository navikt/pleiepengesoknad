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
import { ForrigeSøknadMetadata } from '../../types/ForrigeSøknad';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { ForrigeSøknadImportEndringType } from '../../utils/innsendtSøknadToFormValues/importForrigeSøknad';
import { getMedlemsskapDateRanges } from '../../utils/medlemsskapUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { validateUtenlandsoppholdNeste12Mnd, validateUtenlandsoppholdSiste12Mnd } from './medlemskapFieldValidations';

type Props = {
    søknadsdato: Date;
    forrigeSøknadMetadata?: ForrigeSøknadMetadata;
};

const MedlemsskapStep = ({
    onValidSubmit,
    søknadsdato,
    forrigeSøknadMetadata: forrigeSøknadMetadata,
}: StepConfigProps & Props) => {
    const { values } = useFormikContext<SøknadFormValues>();
    const intl = useIntl();
    const { neste12Måneder, siste12Måneder } = getMedlemsskapDateRanges(søknadsdato);

    const bostederEndretVedImport =
        forrigeSøknadMetadata !== undefined &&
        forrigeSøknadMetadata.endringer.some((e) => e.type === ForrigeSøknadImportEndringType.endretBostedUtland);

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
                <Box padBottom="l">
                    <AlertStripeInfo>
                        Når vi hentet opp din forrige søknad så måtte vil gjøre noen endringer i listen under. Vennligst
                        se over at all informasjon fortsatt stemmer.
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
