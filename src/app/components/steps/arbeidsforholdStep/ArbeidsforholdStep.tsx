import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { useFormikContext } from 'formik';
// import AlertStripe from 'nav-frontend-alertstriper';
import FormSection from '../../../pre-common/form-section/FormSection';
import { getArbeidsgivere } from '../../../utils/arbeidsforholdUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import FormikStep from '../../formik-step/FormikStep';
// import FrilansFormPart from './FrilansFormPart';
// import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';
import { Undertittel } from 'nav-frontend-typografi';
import AppForm from '../../app-form/AppForm';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FrilansEksempeltHtml from './FrilansEksempelHtml';

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
    const intl = useIntl();

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

                    <Box margin="xl">
                        <FormSection title="Frilansere og selvstendig næringsdrivende">
                            <FormBlock>
                                <AppForm.YesOrNoQuestion
                                    name={AppFormField.frilans_harHattInntektSomFrilanser}
                                    legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                                    validate={validateYesOrNoIsAnswered}
                                    description={
                                        <ExpandableInfo title={intlHelper(intl, 'frilanser.hjelpetekst.spm')}>
                                            <FrilansEksempeltHtml />
                                        </ExpandableInfo>
                                    }
                                />
                                {/* <FrilansFormPart formValues={values} /> */}
                            </FormBlock>
                            <FormBlock>
                                <AppForm.YesOrNoQuestion
                                    name={AppFormField.selvstendig_harHattInntektSomSN}
                                    legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </FormBlock>
                        </FormSection>
                    </Box>
                </>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdStep;
