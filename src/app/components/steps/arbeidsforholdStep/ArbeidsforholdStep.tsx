import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { useFormikContext } from 'formik';
// import FrilansFormPart from './FrilansFormPart';
// import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';
import { Undertittel } from 'nav-frontend-typografi';
// import AlertStripe from 'nav-frontend-alertstriper';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { getArbeidsgivere } from '../../../utils/arbeidsforholdUtils';
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
                            Her skal du gi opplysninger om arbeidsforhold som du har. Vi trenger blant annet å vite om
                            du jobber fast antall timer per uke, eller om det varierer. Du får veiledning underveis når
                            du skriver inn opplysningene i søknaden.
                            {/* <FormattedMessage
                                id="steg.arbeidsforhold.aktivtArbeidsforhold.info.html"
                                values={{ p: (msg: string) => <p>{msg}</p> }}
                            /> */}
                        </CounsellorPanel>
                    </Box>
                    <Box margin="xl">
                        <Undertittel tag="h2">Arbeidsforhold</Undertittel>
                        <p>
                            Nedenfor ser du de arbeidsforholdene vi har registrert på deg. Dersom det mangler et
                            arbeidsforhold her, må du be arbeidsgiveren din sende ny A-melding, enten via lønns- og
                            personalsystemet eller gjennom Altinn.
                        </p>
                    </Box>
                    {arbeidsforhold.length > 0 && (
                        <div className="arbeidsforhold">
                            {arbeidsforhold.map((forhold, index) => (
                                <FormBlock key={forhold.organisasjonsnummer}>
                                    <FormSection
                                        titleTag="h3"
                                        title={forhold.navn}
                                        titleIcon={<BuildingIcon />}
                                        indentContent={false}>
                                        <FormikArbeidsforhold arbeidsforhold={forhold} index={index} />
                                    </FormSection>
                                </FormBlock>
                            ))}
                        </div>
                    )}

                    {arbeidsforhold.length === 0 && <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />}

                    {/* <Box margin="l">
                        <AlertStripe type="info">
                            <FormattedMessage id="steg.arbeidsforhold.manglesOpplysninger" />
                        </AlertStripe>
                    </Box> */}

                    <Box margin="xxl">
                        <FormSection title="Frilansere og selvstendig næringsdrivende">
                            <FormBlock margin="l">
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
