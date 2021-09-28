import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { getArbeidsgivere } from '../../../utils/arbeidsforholdUtils';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { getSøknadsperiodeFromFormData } from '../../../utils/formDataUtils';
import { erFrilanserISøknadsperiode } from '../../../utils/frilanserUtils';
import FormikStep from '../../formik-step/FormikStep';
import AndreYtelserFormPart from './parts/AndreYtelserFormPart';
import ArbeidssituasjonAnsatt from './parts/ArbeidssituasjonAnsatt';
import ArbeidssituasjonFrilans from './parts/ArbeidssituasjonFrilans';
import ArbeidssituasonSN from './parts/ArbeidssituasjonSN';
import AppForm from '../../app-form/AppForm';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';

interface LoadState {
    isLoading: boolean;
    isLoaded: boolean;
}

export const visVernepliktSpørsmål = ({
    ansatt_arbeidsforhold = [],
    frilans_harHattInntektSomFrilanser,
    selvstendig_harHattInntektSomSN,
}: PleiepengesøknadFormData): boolean => {
    return (
        frilans_harHattInntektSomFrilanser === YesOrNo.NO &&
        selvstendig_harHattInntektSomSN === YesOrNo.NO &&
        ansatt_arbeidsforhold.some((a) => a.erAnsatt === YesOrNo.YES) === false
    );
};

const cleanupArbeidsforhold =
    () =>
    (formValues: PleiepengesøknadFormData): PleiepengesøknadFormData => {
        const values: PleiepengesøknadFormData = { ...formValues };
        if (values.mottarAndreYtelser === YesOrNo.NO) {
            values.andreYtelser = [];
        }
        if (values.frilans_harHattInntektSomFrilanser === YesOrNo.NO) {
            values.frilans_jobberFortsattSomFrilans = undefined;
            values.frilans_startdato = undefined;
            values.frilans_arbeidsforhold = undefined;
        }
        if (
            values.frilans_harHattInntektSomFrilanser === YesOrNo.YES &&
            values.frilans_jobberFortsattSomFrilans === YesOrNo.NO &&
            !erFrilanserISøknadsperiode(values)
        ) {
            values.frilans_arbeidsforhold = undefined;
        }

        if (values.selvstendig_harHattInntektSomSN === YesOrNo.NO) {
            values.selvstendig_virksomhet = undefined;
            values.selvstendig_arbeidsforhold = undefined;
        }
        if (!visVernepliktSpørsmål(values)) {
            values.harVærtEllerErVernepliktig = undefined;
        }

        return values;
    };

const ArbeidssituasjonStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const intl = useIntl();
    const {
        values,
        values: { ansatt_arbeidsforhold },
    } = formikProps;
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: false, isLoaded: false });
    const søkerdata = useContext(SøkerdataContext);

    const { isLoading, isLoaded } = loadState;
    const søknadsperiode = getSøknadsperiodeFromFormData(values);

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
        <FormikStep
            id={StepID.ARBEIDSSITUASJON}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={isLoading}
            onStepCleanup={søknadsperiode ? cleanupArbeidsforhold() : undefined}>
            {isLoading && <LoadingSpinner type="XS" blockTitle="Henter arbeidsforhold" />}
            {!isLoading && søknadsperiode && (
                <>
                    <Box padBottom="m">
                        <CounsellorPanel>
                            <FormattedMessage id="steg.arbeidssituasjon.veileder" />
                        </CounsellorPanel>
                    </Box>
                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.tittel')}>
                        <Box>
                            <p>
                                {ansatt_arbeidsforhold.length > 0 && (
                                    <FormattedMessage
                                        id="steg.arbeidssituasjon.veileder.medArbeidsgiver"
                                        values={{ antall: ansatt_arbeidsforhold.length }}
                                    />
                                )}
                                {ansatt_arbeidsforhold.length === 0 && (
                                    <FormattedMessage id="steg.arbeidssituasjon.veileder.ingenArbeidsgiverFunnet" />
                                )}
                            </p>
                            <p>
                                <FormattedMessage id="steg.arbeidssituasjon.veileder.manglerDetArbeidsgiver" />
                            </p>
                        </Box>
                        {ansatt_arbeidsforhold.length > 0 && (
                            <>
                                {ansatt_arbeidsforhold.map((forhold, index) => (
                                    <FormBlock key={forhold.organisasjonsnummer}>
                                        <ArbeidssituasjonAnsatt arbeidsforhold={forhold} index={index} />
                                    </FormBlock>
                                ))}
                            </>
                        )}
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.frilanser.tittel')}>
                        <ArbeidssituasjonFrilans formValues={values} />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.sn.tittel')}>
                        <ArbeidssituasonSN formValues={values} />
                    </FormSection>

                    {visVernepliktSpørsmål(values) && (
                        <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.tittel')}>
                            <Box margin="l">
                                <AppForm.YesOrNoQuestion
                                    name={AppFormField.harVærtEllerErVernepliktig}
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
        </FormikStep>
    );
};

export default ArbeidssituasjonStep;