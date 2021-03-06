import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { useFormikContext } from 'formik';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { getArbeidsgivere } from '../../../utils/arbeidsforholdUtils';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
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

export const visVernepliktSpørsmål = ({
    arbeidsforhold = [],
    harHattInntektSomFrilanser,
    selvstendig_harHattInntektSomSN,
}: PleiepengesøknadFormData): boolean => {
    if (harHattInntektSomFrilanser === YesOrNo.NO && selvstendig_harHattInntektSomSN === YesOrNo.NO) {
        if (arbeidsforhold.length > 0) {
            return !arbeidsforhold.some(
                ({ erAnsattIPerioden }) => erAnsattIPerioden === undefined || erAnsattIPerioden === YesOrNo.YES
            );
        }
        return true;
    }
    return false;
};

const cleanupArbeidsforhold = (formValues: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const values: PleiepengesøknadFormData = { ...formValues };
    if (values.mottarAndreYtelser === YesOrNo.NO) {
        values.andreYtelser = [];
    }
    if (values.harHattInntektSomFrilanser === YesOrNo.NO) {
        values.frilans_jobberFortsattSomFrilans = undefined;
        values.frilans_startdato = undefined;
        values.frilans_arbeidsforhold = undefined;
    }
    if (
        values.harHattInntektSomFrilanser === YesOrNo.YES &&
        values.frilans_jobberFortsattSomFrilans === YesOrNo.NO &&
        !erFrilanserISøknadsperiode(values.periodeFra, values.frilans_sluttdato)
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
    const { periodeFra, periodeTil } = values;

    useEffect(() => {
        const fraDato = datepickerUtils.getDateFromDateString(periodeFra);
        const tilDato = datepickerUtils.getDateFromDateString(periodeTil);

        const fetchData = async () => {
            if (søkerdata) {
                if (fraDato && tilDato) {
                    await getArbeidsgivere(fraDato, tilDato, formikProps, søkerdata);
                    setLoadState({ isLoading: false, isLoaded: true });
                }
            }
        };
        if (fraDato && tilDato && !isLoaded && !isLoading) {
            setLoadState({ isLoading: true, isLoaded: false });
            fetchData();
        }
    }, [formikProps, søkerdata, isLoaded, isLoading, periodeFra, periodeTil]);

    return (
        <FormikStep
            id={StepID.ARBEIDSFORHOLD}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={isLoading}
            onStepCleanup={cleanupArbeidsforhold}>
            {isLoading && <LoadingSpinner type="XS" blockTitle="Henter arbeidsforhold" />}
            {!isLoading && (
                <>
                    <FormSection title={intlHelper(intl, 'steg.arbeidsforhold.tittel')}>
                        {arbeidsforhold.length > 0 && (
                            <>
                                <FormattedMessage id="steg.arbeidsforhold.intro" />
                                <Box margin="m">
                                    <ExpandableInfo title={intlHelper(intl, 'steg.arbeidsforhold.info.tittel')}>
                                        <FormattedMessage id="steg.arbeidsforhold.info.tekst" />
                                    </ExpandableInfo>
                                </Box>
                                {arbeidsforhold.map((forhold, index) => (
                                    <FormBlock key={forhold.organisasjonsnummer}>
                                        <ArbeidsforholdFormPart arbeidsforhold={forhold} index={index} />
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

                    {visVernepliktSpørsmål(values) && (
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
