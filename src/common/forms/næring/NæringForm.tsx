import moment from 'moment';
import React, { useState } from 'react';
import Box from 'common/components/box/Box';
import { Formik } from 'formik';
import { Systemtittel } from 'nav-frontend-typografi';
import { NæringFormData, NæringFormField, Næringstype } from './types';
import FormKnapperad from '../components/FormKnapperad';
import { validateRequiredField } from 'app/validation/fieldValidations';
import FormikCheckboxPanelGroup from 'common/formik/formik-checkbox-panel-group/FormikCheckboxPanelGroup';
import FormikInput from 'common/formik/formik-input/FormikInput';
import { harFiskerNæringstype } from './næringUtils';
import { hasValue } from 'common/validation/hasValue';
import InfoTilFisker from './parts/InfoTilFisker';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import FormikCountrySelect from 'common/formik/formik-country-select/FormikCountrySelect';
import { YesOrNo } from 'common/types/YesOrNo';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import FormikCheckbox from 'common/formik/formik-checkbox/FormikCheckbox';
import { date4YearsAgo } from 'common/utils/dateUtils';
import FormikDatepicker from 'common/formik/formik-datepicker/FormikDatepicker';
import FormikTextarea from 'common/formik/formik-textarea/FormikTextarea';
import { Panel } from 'nav-frontend-paneler';

interface Props {
    næring?: NæringFormData;
    onSubmit: (oppdrag: NæringFormData) => void;
    onCancel: () => void;
}

const initialValues: Partial<NæringFormData> = {
    næringstyper: []
};

const NæringForm: React.FunctionComponent<Props> = ({ onCancel, næring = initialValues, onSubmit }) => {
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (values: NæringFormData) => {
        onSubmit(values);
    };

    return (
        <Formik initialValues={næring} onSubmit={onFormikSubmit} validateOnMount={true} validateOnChange={true}>
            {({ handleSubmit, isValid, setFieldValue, setFieldTouched, values }) => {
                const { navnPåNæringen = 'virksomheten' } = values;
                return (
                    <form onSubmit={handleSubmit}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">Opplysninger om virksomheten din</Systemtittel>
                        </Box>

                        <FormikCheckboxPanelGroup<NæringFormField>
                            name={NæringFormField.næringstyper}
                            legend="Hvilken type virksomhet har du?"
                            showValidationErrors={showErrors}
                            checkboxes={[
                                {
                                    key: Næringstype.FISKER,
                                    value: Næringstype.FISKER,
                                    label: 'Fisker'
                                },
                                {
                                    key: Næringstype.JORDBRUK,
                                    value: Næringstype.JORDBRUK,
                                    label: 'Jordbruker'
                                },
                                {
                                    key: Næringstype.DAGMAMMA,
                                    value: Næringstype.DAGMAMMA,
                                    label: 'Dagmamma'
                                },
                                {
                                    key: Næringstype.ANNET,
                                    value: Næringstype.ANNET,
                                    label: 'Annet'
                                }
                            ]}
                            singleColumn={true}
                            validate={validateRequiredField}
                        />

                        <Box margin="xl">
                            <FormikInput<NæringFormField>
                                name={NæringFormField.navnPåNæringen}
                                label="Hva heter virksomheten din?"
                                validate={validateRequiredField}
                            />
                        </Box>

                        {harFiskerNæringstype(values.næringstyper || []) &&
                            values.navnPåNæringen !== undefined &&
                            hasValue(navnPåNæringen) && (
                                <Box margin="xl">
                                    <InfoTilFisker navnPåNæringen={values.navnPåNæringen} />
                                </Box>
                            )}

                        <Box margin="xl">
                            <FormikYesOrNoQuestion<NæringFormField>
                                name={NæringFormField.registrertINorge}
                                legend={`Er ${navnPåNæringen} registrert i Norge`}
                                validate={validateRequiredField}
                            />
                        </Box>

                        {values.registrertINorge === YesOrNo.NO && (
                            <Box margin="xl">
                                <FormikCountrySelect<NæringFormField>
                                    name={NæringFormField.registrertILand}
                                    label={`I hvilket land er ${navnPåNæringen} din registrert i?`}
                                    validate={validateRequiredField}
                                />
                            </Box>
                        )}

                        {values.registrertINorge === YesOrNo.YES && (
                            <Box margin="xl">
                                <FormikInput<NæringFormField>
                                    name={NæringFormField.organisasjonsnummer}
                                    label="Hva er organisasjonsnummeret?"
                                    validate={validateRequiredField}
                                />
                            </Box>
                        )}

                        {(values.registrertINorge === YesOrNo.YES || values.registrertINorge === YesOrNo.NO) && (
                            <Box margin="xl">
                                <FormikDateIntervalPicker<NæringFormField>
                                    legend={`Når startet du ${navnPåNæringen}?`}
                                    fromDatepickerProps={{
                                        label: 'Startdato',
                                        name: NæringFormField.fom,
                                        showYearSelector: true
                                    }}
                                    toDatepickerProps={{
                                        label: 'Eventuell avsluttet dato',
                                        name: NæringFormField.tom,
                                        disabled: values.erPågående === true,
                                        showYearSelector: true
                                    }}
                                />
                                <FormikCheckbox<NæringFormField>
                                    label="Er pågående"
                                    name={NæringFormField.erPågående}
                                    afterOnChange={(checked) => {
                                        if (checked) {
                                            setFieldValue(NæringFormField.tom, undefined);
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        {values.fom && moment(values.fom).isAfter(date4YearsAgo) && (
                            <>
                                <Box margin="xl">
                                    <FormikInput<NæringFormField>
                                        name={NæringFormField.næringsinntekt}
                                        label="Næringsinntekt"
                                        validate={validateRequiredField}
                                    />
                                </Box>
                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<NæringFormField>
                                        name={NæringFormField.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene}
                                        legend="Har du begynt å jobbe i løpet av de tre siste ferdigliknede årene?"
                                    />
                                </Box>
                                {values.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES && (
                                    <Panel>
                                        <FormikDatepicker<NæringFormField>
                                            name={NæringFormField.oppstartsdato}
                                            label="Oppgi dato for når du ble yrkesaktiv"
                                            showYearSelector={true}
                                        />
                                    </Panel>
                                )}
                            </>
                        )}
                        {values.fom && moment(values.fom).isAfter(date4YearsAgo) === false && (
                            <>
                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<NæringFormField>
                                        name={NæringFormField.hattVarigEndringAvNæringsinntektSiste4Kalenderår}
                                        legend="Har du hatt en varig endring i arbeidsforholdet ditt, virksomheten eller arbeidssituasjonen din de siste fire årene?"
                                    />
                                </Box>
                                {values.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES && (
                                    <>
                                        <Box margin="xl">
                                            <FormikDatepicker<NæringFormField>
                                                name={NæringFormField.varigEndringINæringsinntekt_dato}
                                                label="Oppgi dato for endringen"
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <FormikInput<NæringFormField>
                                                name={NæringFormField.varigEndringINæringsinntekt_inntektEtterEndring}
                                                label="Oppgi næringsinntekten din etter endringen. Oppgi årsinntekten i hele kroner."
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <FormikTextarea<NæringFormField>
                                                name={NæringFormField.varigEndringINæringsinntekt_forklaring}
                                                label="Her kan du skrive kort hva som har endret seg i arbeidsforholdet ditt, virksomheten eller arbeidssituasjonen din"
                                                validate={validateRequiredField}
                                                maxLength={1000}
                                            />
                                        </Box>
                                    </>
                                )}
                            </>
                        )}

                        {(values.fom || values.registrertINorge === YesOrNo.YES) && (
                            <>
                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<NæringFormField>
                                        name={NæringFormField.harRevisor}
                                        legend="Har du revisor?"
                                    />
                                </Box>

                                {values.harRevisor === YesOrNo.YES && (
                                    <Panel>
                                        <FormikInput<NæringFormField>
                                            name={NæringFormField.revisor_navn}
                                            label="Oppgi navnet til revisor"
                                            validate={validateRequiredField}
                                        />
                                        <Box margin="xl">
                                            <FormikInput<NæringFormField>
                                                name={NæringFormField.revisor_telefon}
                                                label="Oppgi telefonnummeret til revisor"
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <FormikYesOrNoQuestion<NæringFormField>
                                                name={NæringFormField.revisor_erNærVennEllerFamilie}
                                                legend="Er dere nære venner eller i familie?"
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                        {values.revisor_erNærVennEllerFamilie === YesOrNo.YES && (
                                            <Box margin="xl">
                                                <FormikYesOrNoQuestion<NæringFormField>
                                                    name={NæringFormField.kanInnhenteOpplsyningerFraRevisor}
                                                    legend="Gir du NAV fullmakt til å innhente opplysninger direkte fra revisor?"
                                                    validate={validateRequiredField}
                                                />
                                            </Box>
                                        )}
                                    </Panel>
                                )}
                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<NæringFormField>
                                        name={NæringFormField.harRegnskapsfører}
                                        legend="Har du regnskapsfører?"
                                    />
                                </Box>

                                {values.harRegnskapsfører === YesOrNo.YES && (
                                    <Panel>
                                        <FormikInput<NæringFormField>
                                            name={NæringFormField.regnskapsfører_navn}
                                            label="Oppgi navnet til regnskapsfører"
                                            validate={validateRequiredField}
                                        />
                                        <Box margin="xl">
                                            <FormikInput<NæringFormField>
                                                name={NæringFormField.regnskapsfører_telefon}
                                                label="Oppgi telefonnummeret til regnskapsfører"
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <FormikYesOrNoQuestion<NæringFormField>
                                                name={NæringFormField.regnskapsfører_erNærVennEllerFamilie}
                                                legend="Er dere nære venner eller i familie?"
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                    </Panel>
                                )}
                            </>
                        )}

                        <Box margin="xl">
                            <FormKnapperad
                                onSubmit={() => {
                                    setShowErrors(true);
                                    if (isValid) {
                                        onFormikSubmit(values as NæringFormData);
                                    }
                                }}
                                onCancel={onCancel}
                            />
                        </Box>
                    </form>
                );
            }}
        </Formik>
    );
};

export default NæringForm;
