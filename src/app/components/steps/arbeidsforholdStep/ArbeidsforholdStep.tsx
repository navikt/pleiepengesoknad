import React, { useEffect, useState } from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';
import { getArbeidsgiver, persist } from 'app/api/api';
import { Arbeidsgiver, Søkerdata } from 'app/types/Søkerdata';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { PleiepengesøknadFormikProps } from 'app/types/PleiepengesøknadFormikProps';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { apiUtils } from 'app/utils/apiUtils';
import { appIsRunningInDemoMode } from 'app/utils/envUtils';
import demoSøkerdata from 'app/demo/demoData';
import { syndArbeidsforholdWithArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import FormikDatepicker from 'common/formik/formik-datepicker/FormikDatepicker';
import { Field, FieldProps } from 'formik';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import ModalFormAndList from 'common/components/modal-form-and-list/ModalFormAndList';
import { FrilansOppdragFormData } from 'common/forms/frilans/types';
import FrilansOppdragForm from 'common/forms/frilans/FrilansOppdragForm';

interface OwnProps {
    formikProps: PleiepengesøknadFormikProps;
    søkerdata: Søkerdata;
}

type Props = CommonStepFormikProps & OwnProps & HistoryProps & StepConfigProps;

const updateArbeidsforhold = (formikProps: PleiepengesøknadFormikProps, arbeidsgivere: Arbeidsgiver[]) => {
    const updatedArbeidsforhold = syndArbeidsforholdWithArbeidsgivere(
        arbeidsgivere,
        formikProps.values[AppFormField.arbeidsforhold]
    );
    if (updatedArbeidsforhold.length > 0) {
        formikProps.setFieldValue(AppFormField.arbeidsforhold, updatedArbeidsforhold);
    }
};

async function getArbeidsgivere(
    fromDate: Date,
    toDate: Date,
    formikProps: PleiepengesøknadFormikProps,
    søkerdata: Søkerdata
) {
    if (appIsRunningInDemoMode()) {
        søkerdata.setArbeidsgivere(demoSøkerdata.arbeidsgivere);
        updateArbeidsforhold(formikProps, demoSøkerdata.arbeidsgivere);
        return;
    }
    try {
        const response = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
        const { organisasjoner } = response.data;
        søkerdata.setArbeidsgivere!(organisasjoner);
        updateArbeidsforhold(formikProps, organisasjoner);
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        }
    }
}

const ArbeidsforholdStep = ({ history, søkerdata, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const {
        values,
        values: { arbeidsforhold }
    } = formikProps;
    const persistAndNavigateTo = (lastStepID: StepID, data: PleiepengesøknadFormData, nextStep?: string) => {
        persist(data, lastStepID);
        if (nextStep) {
            history.push(nextStep);
        }
    };
    const [isLoading, setIsLoading] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        const fraDato = formikProps.values[AppFormField.periodeFra];
        const tilDato = formikProps.values[AppFormField.periodeFra];

        const fetchData = async () => {
            if (fraDato && tilDato) {
                await getArbeidsgivere(fraDato, tilDato, formikProps, søkerdata);
                setIsLoading(false);
            }
        };
        if (fraDato && tilDato) {
            setIsLoading(true);
            fetchData();
        }
    }, []);

    return (
        <FormikStep
            id={StepID.ARBEIDSFORHOLD}
            onValidFormSubmit={() => persistAndNavigateTo(StepID.ARBEIDSFORHOLD, values, nextStepRoute)}
            history={history}
            {...stepProps}
            buttonDisabled={isLoading}>
            {isLoading && <LoadingSpinner type="XS" style={'block'} blockTitle="Henter arbeidsforhold" />}
            {!isLoading && (
                <>
                    <Box padBottom="xxl">
                        <CounsellorPanel>
                            <FormattedHTMLMessage id="steg.arbeidsforhold.aktivtArbeidsforhold.info.html" />
                        </CounsellorPanel>
                    </Box>
                    {arbeidsforhold.length > 0 && (
                        <>
                            {arbeidsforhold.map((forhold, index) => (
                                <Box padBottom="l" key={forhold.organisasjonsnummer}>
                                    <FormSection titleTag="h4" title={forhold.navn} titleIcon={<BuildingIcon />}>
                                        <FormikArbeidsforhold arbeidsforhold={forhold} index={index} />
                                    </FormSection>
                                </Box>
                            ))}
                        </>
                    )}
                    {arbeidsforhold.length === 0 && <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />}

                    <Box margin="l" padBottom="l">
                        <FormikYesOrNoQuestion<AppFormField>
                            name={AppFormField.frilans_harHattInntektSomFrilanser}
                            legend="Har du jobbet og hatt inntekt som frilanser de siste 10 månedene?"
                            helperText={
                                <>
                                    Eksempel på hvem som kan være frilansere er:
                                    <ul>
                                        <li>Musikere</li>
                                        <li>Tekstforfattere</li>
                                        <li>Skuespillere</li>
                                        <li>Journalister</li>
                                        <li>Oversettere</li>
                                        <li>
                                            Folkevalgt, politikere i kommuner, fylkeskommuner og på Stortinget som får
                                            godtgjørelse for politisk arbeid
                                        </li>
                                        <li>Støttekontakt</li>
                                        <li>Fosterforeldre, og personer med omsorgslønn</li>
                                    </ul>
                                    Hvis du er usikker på om du er frilanser, kan du lese mer om hva det betyr å være
                                    frilanser på skatteetaten sinhjemmeside{' '}
                                </>
                            }
                        />
                        {values[AppFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES && (
                            <>
                                <Box margin="xl">
                                    <FormikDatepicker<AppFormField>
                                        name={AppFormField.frilans_startdato}
                                        label="Når startet du som frilanser?"
                                    />
                                </Box>
                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<AppFormField>
                                        name={AppFormField.frilans_jobberFortsattSomFrilans}
                                        legend="Jobber du fortsatt som frilanser?"
                                    />
                                </Box>
                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<AppFormField>
                                        name={AppFormField.frilans_harHattOppdragForFamilieVenner}
                                        legend="Har du hatt oppdrag for nær venn eller familie de 10 siste månedene?"
                                    />
                                </Box>
                                {values[AppFormField.frilans_harHattOppdragForFamilieVenner] === YesOrNo.YES && (
                                    <Field name={AppFormField.frilans_oppdrag}>
                                        {({
                                            field,
                                            form: { errors, setFieldValue, status, submitCount }
                                        }: FieldProps<FrilansOppdragFormData[]>) => {
                                            const errorMsgProps = isValidationErrorsVisible(status, submitCount)
                                                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                                : {};

                                            return (
                                                <ModalFormAndList<FrilansOppdragFormData>
                                                    labels={{
                                                        listTitle: 'Frilansoppdrag',
                                                        modalTitle: 'Frilansoppdrag',
                                                        addLabel: 'Legg til oppdrag'
                                                    }}
                                                    error={errorMsgProps?.feil}
                                                    items={field.value}
                                                    onChange={(value) => setFieldValue(field.name, value)}
                                                    listRenderer={() => <div>liste</div>}
                                                    formRenderer={(onSubmit, onCancel, oppdrag) => (
                                                        <FrilansOppdragForm oppdrag={oppdrag} />
                                                    )}
                                                />
                                            );
                                        }}
                                    </Field>
                                )}

                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<AppFormField>
                                        name={AppFormField.frilans_harInntektSomFosterforelder}
                                        legend="Har du inntekt som fosterforelder?"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>

                    <Box margin="m" padBottom="m">
                        <AlertStripe type="info">
                            <FormattedMessage id="steg.arbeidsforhold.manglesOpplysninger" />
                        </AlertStripe>
                    </Box>
                </>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdStep;
