import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import FormSection from '../../../pre-common/form-section/FormSection';
import { getArbeidsgivere } from '../../../utils/arbeidsforholdUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import FormikStep from '../../formik-step/FormikStep';
import FrilansFormPart from './FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';

interface LoadState {
    isLoading: boolean;
    isLoaded: boolean;
}

const ArbeidsforholdStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
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
        <FormikStep id={StepID.ARBEIDSFORHOLD} onValidFormSubmit={onValidSubmit} buttonDisabled={isLoading}>
            {isLoading && <LoadingSpinner type="XS" blockTitle="Henter arbeidsforhold" />}
            {!isLoading && (
                <>
                    <Box padBottom="m">
                        <CounsellorPanel>
                            <FormattedMessage
                                id="steg.arbeidsforhold.aktivtArbeidsforhold.info.html"
                                values={{ p: (msg: string) => <p>{msg}</p> }}
                            />
                        </CounsellorPanel>
                    </Box>
                    {arbeidsforhold.length > 0 && (
                        <>
                            {arbeidsforhold.map((forhold, index) => (
                                <FormBlock key={forhold.organisasjonsnummer}>
                                    <FormSection
                                        titleTag="h2"
                                        title={forhold.navn}
                                        titleIcon={<BuildingIcon />}
                                        indentContent={false}>
                                        <FormikArbeidsforhold arbeidsforhold={forhold} index={index} />
                                    </FormSection>
                                </FormBlock>
                            ))}
                        </>
                    )}

                    {arbeidsforhold.length === 0 && <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />}

                    <Box margin="l">
                        <AlertStripe type="info">
                            <FormattedMessage id="steg.arbeidsforhold.manglesOpplysninger" />
                        </AlertStripe>
                    </Box>

                    <Box margin="xl">
                        <FormSection title="Frilansere og selvstendig næringsdrivende">
                            <FormBlock>
                                <FrilansFormPart formValues={values} />
                            </FormBlock>
                            <FormBlock>
                                <SelvstendigNæringsdrivendeFormPart formValues={values} />
                            </FormBlock>
                        </FormSection>
                    </Box>
                </>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdStep;
