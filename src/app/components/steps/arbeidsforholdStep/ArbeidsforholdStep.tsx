import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { useFormikContext } from 'formik';
import { Undertittel } from 'nav-frontend-typografi';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { getArbeidsgivere } from '../../../utils/arbeidsforholdUtils';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import FormikStep from '../../formik-step/FormikStep';
import FrilansFormPart from './FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';
import VernepliktigFormPart from './VernepliktigFormPart';
import AndreYtelserFormPart from './AndreYtelserFormPart';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';

interface LoadState {
    isLoading: boolean;
    isLoaded: boolean;
}

const cleanupArbeidsforhold = (formValues: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const values: PleiepengesøknadFormData = { ...formValues };
    if (values.mottarAndreYtelser === YesOrNo.NO) {
        values.andreYtelser = [];
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
    const { periodeFra } = values;

    useEffect(() => {
        const fraDato = datepickerUtils.getDateFromDateString(periodeFra);
        const tilDato = datepickerUtils.getDateFromDateString(periodeFra);

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
    }, [formikProps, søkerdata, isLoaded, isLoading, periodeFra]);

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
                        <FormattedMessage id="steg.arbeidsforhold.intro" />
                        {arbeidsforhold.length > 0 && (
                            <>
                                {arbeidsforhold.map((forhold, index) => (
                                    <FormBlock key={forhold.organisasjonsnummer} margin="xl">
                                        <Box padBottom="m">
                                            <Undertittel tag="h3" style={{ fontWeight: 'normal' }}>
                                                {forhold.navn}
                                            </Undertittel>
                                        </Box>
                                        <FormikArbeidsforhold arbeidsforhold={forhold} index={index} />
                                    </FormBlock>
                                ))}
                            </>
                        )}
                        {arbeidsforhold.length === 0 && (
                            <Box>
                                <AlertStripeInfo>
                                    <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />
                                </AlertStripeInfo>
                            </Box>
                        )}
                    </FormSection>

                    <FormSection title="Frilansere">
                        <FrilansFormPart formValues={values} />
                    </FormSection>

                    <FormSection title="Selvstendig næringsdrivende">
                        <SelvstendigNæringsdrivendeFormPart formValues={values} />
                    </FormSection>

                    <FormSection title="Vernepliktige">
                        <VernepliktigFormPart />
                    </FormSection>

                    {isFeatureEnabled(Feature.ANDRE_YTELSER) && (
                        <FormSection title="Andre ytelser">
                            <AndreYtelserFormPart formValues={values} />
                        </FormSection>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdStep;
