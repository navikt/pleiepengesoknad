import React from 'react';
import { PleiepengesøknadFormData, AppFormField } from 'app/types/PleiepengesøknadFormData';
import ModalFormAndList from 'common/components/modal-form-and-list/ModalFormAndList';
import { Næring } from 'common/forms/næring/types';
import { Field, FieldProps } from 'formik';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import { Panel } from 'nav-frontend-paneler';
import NæringListe from 'common/forms/næring/NæringListe';
import NæringForm from 'common/forms/næring/NæringForm';
import { validateRequiredField } from '@navikt/sif-common/lib/common/validation/fieldValidations';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.sn_harHattInntektSomSN}
                    legend={'Har du hatt inntekt som selvstendig næringsdrivende siste 10 måneder?'}
                    validate={validateRequiredField}
                />
            </Box>
            {formValues.sn_harHattInntektSomSN === YesOrNo.YES && (
                <Box margin="l">
                    <Panel>
                        <Field name={AppFormField}>
                            {({
                                field,
                                form: { errors, setFieldValue, status, submitCount }
                            }: FieldProps<Næring[]>) => {
                                const errorMsgProps = isValidationErrorsVisible(status, submitCount)
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : {};

                                const virksomheter: Næring[] = field.value || [];

                                return (
                                    <ModalFormAndList<Næring>
                                        items={virksomheter}
                                        {...errorMsgProps}
                                        labels={{
                                            listTitle: 'Registrerte virksomheter',
                                            addLabel: 'Legg til virksomhet',
                                            modalTitle: 'Virksomhet'
                                        }}
                                        onChange={(value) => setFieldValue(field.name, value)}
                                        listRenderer={(onEdit, onDelete) => (
                                            <NæringListe næringer={field.value} onEdit={onEdit} onDelete={onDelete} />
                                        )}
                                        formRenderer={(onSubmit, onCancel) => (
                                            <NæringForm onSubmit={onSubmit} onCancel={onCancel} />
                                        )}
                                    />
                                );
                            }}
                        </Field>
                    </Panel>
                </Box>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
