import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldArray } from 'formik';
import {
    AppFormField,
    Arbeidsforhold,
    ArbeidsforholdField,
    ArbeidsforholdSkalJobbeSvar,
} from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import RedusertArbeidsforholdDetaljerPart from './RedusertArbeidsforholdDetaljerPart';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    index: number;
}

const FormikArbeidsforholdDetaljer = ({ arbeidsforhold, index }: Props) => {
    const intl = useIntl();
    return (
        <FieldArray name={AppFormField.arbeidsforhold}>
            {({ name }) => {
                const getFieldName = (field: ArbeidsforholdField) => `${name}.${index}.${field}` as AppFormField;
                return (
                    <FormBlock>
                        <AppForm.RadioPanelGroup
                            legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm')}
                            name={getFieldName(ArbeidsforholdField.skalJobbe)}
                            validate={validateRequiredField}
                            radios={[
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.nei'),
                                    value: ArbeidsforholdSkalJobbeSvar.nei,
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.vetIkke'),
                                    value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.ja'),
                                    value: ArbeidsforholdSkalJobbeSvar.ja,
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.redusert'),
                                    value: ArbeidsforholdSkalJobbeSvar.redusert,
                                },
                            ]}
                        />
                        {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                            <RedusertArbeidsforholdDetaljerPart
                                arbeidsforhold={arbeidsforhold}
                                getFieldName={getFieldName}
                            />
                        )}
                    </FormBlock>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforholdDetaljer;
