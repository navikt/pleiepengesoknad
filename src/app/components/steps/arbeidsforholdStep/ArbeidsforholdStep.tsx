import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import FormSection from '../../../pre-common/form-section/FormSection';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import { getArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import FormikStep from '../../formik-step/FormikStep';
import FrilansFormPart from './FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';

const ArbeidsforholdStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values,
        values: { arbeidsforhold },
    } = formikProps;
    const [isLoading, setIsLoading] = useState(false);
    const søkerdata = useContext(SøkerdataContext);

    useEffect(() => {
        const fraDato = values[AppFormField.periodeFra];
        const tilDato = values[AppFormField.periodeFra];

        const fetchData = async () => {
            if (søkerdata) {
                if (fraDato && tilDato) {
                    await getArbeidsgivere(fraDato, tilDato, formikProps, søkerdata);
                    setIsLoading(false);
                }
            }
        };
        if (fraDato && tilDato) {
            setIsLoading(true);
            fetchData();
        }
    }, []);

    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD} onValidFormSubmit={onValidSubmit} buttonDisabled={isLoading}>
            {isLoading && <LoadingSpinner type="XS" style={'block'} blockTitle="Henter arbeidsforhold" />}
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
                                        titleTag="h4"
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
