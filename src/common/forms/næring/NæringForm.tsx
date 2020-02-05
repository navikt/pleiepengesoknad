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
                            <Systemtittel tag="h1">Frilansoppdrag</Systemtittel>
                        </Box>

                        <FormikCheckboxPanelGroup<NæringFormField>
                            name={NæringFormField.næringstyper}
                            legend="Næringstype"
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

                        {(values.registrertINorge === YesOrNo.YES || hasValue(values.registrertILand)) && (
                            <Box margin="xl">
                                <FormikDateIntervalPicker<NæringFormField>
                                    legend={`Når startet du ${navnPåNæringen}?`}
                                    fromDatepickerProps={{
                                        label: 'Startdato',
                                        name: NæringFormField.oppstartsdato
                                    }}
                                    toDatepickerProps={{
                                        label: 'Eventuell avsluttet dato',
                                        name: NæringFormField.avsluttetdato
                                    }}
                                />
                            </Box>
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
