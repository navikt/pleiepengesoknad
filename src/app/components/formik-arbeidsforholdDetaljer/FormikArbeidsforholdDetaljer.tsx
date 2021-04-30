import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FieldArray } from 'formik';
import {
    AppFormField,
    Arbeidsforhold,
    ArbeidsforholdField,
    ArbeidsforholdSkalJobbeSvar,
} from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import RedusertArbeidsforholdDetaljerPart from './RedusertArbeidsforholdDetaljerPart';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';

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
                    <>
                        <AppForm.RadioPanelGroup
                            legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm')}
                            description={
                                <ExpandableInfo title="Hva betyr dette?">
                                    For å kunne beregne hvor mye pleiepenger du kan få trenger vi å vite om du skal
                                    jobbe i samme periode som du skal ha pleiepenger. Velg det som passer best i din
                                    situasjon.
                                </ExpandableInfo>
                            }
                            name={getFieldName(ArbeidsforholdField.skalJobbe)}
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
                            validate={getRequiredFieldValidator()}
                        />
                        {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                            <RedusertArbeidsforholdDetaljerPart
                                arbeidsforhold={arbeidsforhold}
                                getFieldName={getFieldName}
                            />
                        )}
                    </>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforholdDetaljer;
