import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { cleanupArbeidssituasjonStep } from './utils/cleanupArbeidssituasjonStep';
import AndreYtelserFormPart from './parts/AndreYtelserFormPart';
import ArbeidssituasjonAnsatt from './parts/ArbeidssituasjonAnsatt';
import ArbeidssituasjonFrilans from './parts/ArbeidssituasjonFrilans';
import ArbeidssituasonSN from './parts/ArbeidssituasjonSN';
import { getArbeidsgivere } from './utils/getArbeidsgivere';
import { visVernepliktSpørsmål } from './utils/visVernepliktSpørsmål';

interface LoadState {
    isLoading: boolean;
    isLoaded: boolean;
}

interface Props {
    søknadsdato: Date;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonStep = ({ onValidSubmit, søknadsdato, søknadsperiode }: StepConfigProps & Props) => {
    const formikProps = useFormikContext<SøknadFormData>();
    const intl = useIntl();
    const {
        values,
        values: { ansatt_arbeidsforhold },
    } = formikProps;
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: false, isLoaded: false });
    const søkerdata = useContext(SøkerdataContext);

    const { isLoading, isLoaded } = loadState;

    useEffect(() => {
        const fetchData = async () => {
            if (søkerdata && søknadsperiode) {
                await getArbeidsgivere(søknadsperiode.from, søknadsperiode.to, formikProps, søkerdata);
                setLoadState({ isLoading: false, isLoaded: true });
            }
        };
        if (søknadsperiode && !isLoaded && !isLoading) {
            setLoadState({ isLoading: true, isLoaded: false });
            fetchData();
        }
    }, [formikProps, søkerdata, isLoaded, isLoading, søknadsperiode]);

    return (
        <SøknadFormStep
            id={StepID.ARBEIDSSITUASJON}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={isLoading}
            onStepCleanup={søknadsperiode ? cleanupArbeidssituasjonStep : undefined}>
            {isLoading && <LoadingSpinner type="XS" blockTitle="Henter arbeidsforhold" />}
            {!isLoading && søknadsperiode && (
                <>
                    <Box padBottom="xl">
                        <CounsellorPanel>
                            <p>
                                <FormattedMessage id="steg.arbeidssituasjon.veileder.1" />
                            </p>
                            <p>
                                <FormattedMessage id="steg.arbeidssituasjon.veileder.2" />
                            </p>
                        </CounsellorPanel>
                    </Box>
                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.tittel')}>
                        <Box>
                            <p>
                                {ansatt_arbeidsforhold.length > 0 && (
                                    <FormattedMessage
                                        id={'steg.arbeidssituasjon.veileder.medArbeidsgiver'}
                                        values={{ antall: ansatt_arbeidsforhold.length }}
                                    />
                                )}
                                {ansatt_arbeidsforhold.length === 0 && (
                                    <FormattedMessage id="steg.arbeidssituasjon.veileder.ingenArbeidsgiverFunnet" />
                                )}
                            </p>
                            <p>
                                <FormattedMessage id={'steg.arbeidssituasjon.veileder.manglerDetArbeidsgiver'} />
                            </p>
                        </Box>
                        {ansatt_arbeidsforhold.length > 0 && (
                            <>
                                {ansatt_arbeidsforhold.map((forhold, index) => (
                                    <FormBlock key={forhold.organisasjonsnummer}>
                                        <ArbeidssituasjonAnsatt
                                            arbeidsforhold={forhold}
                                            index={index}
                                            søknadsperiode={søknadsperiode}
                                        />
                                    </FormBlock>
                                ))}
                            </>
                        )}
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.frilanser.tittel')}>
                        <ArbeidssituasjonFrilans
                            formValues={values}
                            søknadsperiode={søknadsperiode}
                            søknadsdato={søknadsdato}
                        />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.sn.tittel')}>
                        <ArbeidssituasonSN formValues={values} />
                    </FormSection>

                    {visVernepliktSpørsmål(values) && (
                        <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.tittel')}>
                            <Box margin="l">
                                <SøknadFormComponents.YesOrNoQuestion
                                    name={SøknadFormField.harVærtEllerErVernepliktig}
                                    legend={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.spm')}
                                    validate={getYesOrNoValidator()}
                                    description={
                                        <ExpandableInfo
                                            title={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.info.tittel')}>
                                            <FormattedMessage id="steg.arbeidssituasjon.verneplikt.info.tekst" />
                                        </ExpandableInfo>
                                    }
                                />
                            </Box>
                        </FormSection>
                    )}

                    {isFeatureEnabled(Feature.ANDRE_YTELSER) && (
                        <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.andreYtelser.tittel')}>
                            <AndreYtelserFormPart formValues={values} />
                        </FormSection>
                    )}
                </>
            )}
        </SøknadFormStep>
    );
};

export default ArbeidssituasjonStep;
