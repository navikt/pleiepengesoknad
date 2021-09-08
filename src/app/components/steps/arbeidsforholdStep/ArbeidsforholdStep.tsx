import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import {
    sluttdatoErISøknadsperiode,
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
import { DateRange } from '@navikt/sif-common-formik/lib';

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
            !erFrilanserISøknadsperiode(values.periodeFra, values.frilans_sluttdato)
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
            const erAvsluttetArbeidsforhold = arbeidsforhold.erAnsatt === YesOrNo.NO;
            const erAvsluttetISøknadsperioden =
                arbeidsforhold.erAnsatt === YesOrNo.NO &&
                sluttdatoErISøknadsperiode(arbeidsforhold.sluttdato, søknadsperiode) === true;

            if (erAvsluttetArbeidsforhold && erAvsluttetISøknadsperioden === false) {
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
                    <FormSection title={intlHelper(intl, 'steg.arbeidsforhold.tittel')}>
                        {arbeidsforhold.length > 0 && (
                            <>
                                <Box margin="m">
                                    <ExpandableInfo title={intlHelper(intl, 'steg.arbeidsforhold.info.tittel')}>
                                        <FormattedMessage id="steg.arbeidsforhold.info.tekst" />
                                    </ExpandableInfo>
                                </Box>
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
                        {arbeidsforhold.length === 0 && (
                            <Box margin="l">
                                <AlertStripeInfo>
                                    <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />
                                    <p style={{ marginBottom: 0 }}>
                                        <FormattedMessage id="steg.arbeidsforhold.info.tekst" />
                                    </p>
                                </AlertStripeInfo>
                            </Box>
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
