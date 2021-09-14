import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import {
    arbeidsforholdGjelderSøknadsperiode,
    getArbeidsgivere,
    harAnsettelsesforholdISøknadsperiode,
} from '../../../utils/arbeidsforholdUtils';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { getSøknadsperiodeFromFormData } from '../../../utils/formDataUtils';
import { erFrilanserISøknadsperiode } from '../../../utils/frilanserUtils';
import FormikStep from '../../formik-step/FormikStep';
import AndreYtelserFormPart from './parts/AndreYtelserFormPart';
import ArbeidsforholdFormPart from './parts/ArbeidsforholdFormPart';
import FrilansFormPart from './parts/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './parts/SelvstendigNæringsdrivendeFormPart';
import VernepliktigFormPart from './parts/VernepliktigFormPart';

interface LoadState {
    isLoading: boolean;
    isLoaded: boolean;
}

export const visVernepliktSpørsmål = (
    {
        arbeidsforhold = [],
        frilans_harHattInntektSomFrilanser,
        selvstendig_harHattInntektSomSN,
    }: PleiepengesøknadFormData,
    søknadsperiode: DateRange
): boolean => {
    return (
        frilans_harHattInntektSomFrilanser === YesOrNo.NO &&
        selvstendig_harHattInntektSomSN === YesOrNo.NO &&
        harAnsettelsesforholdISøknadsperiode(arbeidsforhold, søknadsperiode) === false
    );
};

const cleanupArbeidsforhold =
    (søknadsperiode: DateRange) =>
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
        if (!visVernepliktSpørsmål(values, søknadsperiode)) {
            values.harVærtEllerErVernepliktig = undefined;
        }

        values.arbeidsforhold = values.arbeidsforhold.map((arbeidsforhold) => {
            if (arbeidsforhold.erAnsatt === YesOrNo.YES) {
                arbeidsforhold.sluttdato = undefined;
            }
            if (arbeidsforholdGjelderSøknadsperiode(arbeidsforhold, søknadsperiode) === false) {
                arbeidsforhold.jobberNormaltTimer = undefined;
                arbeidsforhold.skalJobbe = undefined;
                arbeidsforhold.skalJobbeHvorMye = undefined;
                arbeidsforhold.skalJobbeProsent = undefined;
                arbeidsforhold.skalJobbeTimer = undefined;
                arbeidsforhold.timerEllerProsent = undefined;
                arbeidsforhold.arbeidsform = undefined;
            }
            return arbeidsforhold;
        });

        return values;
    };

const ArbeidsforholdStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const intl = useIntl();
    const {
        values,
        values: { arbeidsforhold },
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
            id={StepID.ARBEIDSFORHOLD}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={isLoading}
            onStepCleanup={søknadsperiode ? cleanupArbeidsforhold(søknadsperiode) : undefined}>
            {isLoading && <LoadingSpinner type="XS" blockTitle="Henter arbeidsforhold" />}
            {!isLoading && søknadsperiode && (
                <>
                    <Box padBottom="m">
                        <CounsellorPanel>
                            For å vurdere/beregne pleiepenger for deg må vi vite litt om din arbeidssituasjon.
                        </CounsellorPanel>
                    </Box>
                    <FormSection title={intlHelper(intl, 'steg.arbeidsforhold.tittel')}>
                        <Box>
                            <p>
                                {arbeidsforhold.length > 0 && (
                                    <FormattedMessage
                                        id="steg.arbeidsforhold.veileder.medArbeidsgiver"
                                        values={{ antall: arbeidsforhold.length }}
                                    />
                                )}
                                {arbeidsforhold.length === 0 && (
                                    <FormattedMessage id="steg.arbeidsforhold.veileder.ingenArbeidsgiverFunnet" />
                                )}
                            </p>
                            <p>
                                <FormattedMessage id="steg.arbeidsforhold.veileder.manglerDetArbeidsgiver" />
                            </p>
                        </Box>
                        {arbeidsforhold.length > 0 && (
                            <>
                                {arbeidsforhold.map((forhold, index) => (
                                    <FormBlock key={forhold.organisasjonsnummer}>
                                        <ArbeidsforholdFormPart
                                            arbeidsforhold={forhold}
                                            søknadsperiode={søknadsperiode}
                                            index={index}
                                        />
                                    </FormBlock>
                                ))}
                            </>
                        )}
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidsforhold.frilanser.tittel')}>
                        <FrilansFormPart formValues={values} />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidsforhold.sn.tittel')}>
                        <SelvstendigNæringsdrivendeFormPart formValues={values} />
                    </FormSection>

                    {visVernepliktSpørsmål(values, søknadsperiode) && (
                        <FormSection title={intlHelper(intl, 'steg.arbeidsforhold.verneplikt.tittel')}>
                            <VernepliktigFormPart />
                        </FormSection>
                    )}

                    {isFeatureEnabled(Feature.ANDRE_YTELSER) && (
                        <FormSection title={intlHelper(intl, 'steg.arbeidsforhold.andreYtelser.tittel')}>
                            <AndreYtelserFormPart formValues={values} />
                        </FormSection>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdStep;
