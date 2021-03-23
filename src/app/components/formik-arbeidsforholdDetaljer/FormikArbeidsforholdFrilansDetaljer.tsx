import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import {
    AppFormField,
    ArbeidsforholdFrilanser,
    ArbeidsforholdFrilanserField,
    ArbeidsforholdSkalJobbeSvar,
} from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import RedusertArbeidsforholdFrilansDetaljerPart from './RedusertArbeidsforholdFrilanserDetaljerPart';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    frilans_arbeidsforhold: ArbeidsforholdFrilanser;
}

const FormikArbeidsforholdFrilansDetaljer = ({ frilans_arbeidsforhold }: Props) => {
    const intl = useIntl();
    console.log(frilans_arbeidsforhold);
    const getFieldName = (field: ArbeidsforholdFrilanserField) => {
        return `${AppFormField.frilans_arbeidsforhold}.${field}` as AppFormField;
    };
    return (
        <>
            <AppForm.RadioPanelGroup
                legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm')}
                description={
                    <ExpandableInfo title="Hva betyr dette?">
                        For å kunne beregne hvor mye pleiepenger du kan få trenger vi å vite om du skal jobbe i samme
                        periode som du skal ha pleiepenger. Velg det som passer best i din situasjon.
                    </ExpandableInfo>
                }
                name={getFieldName(ArbeidsforholdFrilanserField.skalJobbe)}
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
            {frilans_arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                <RedusertArbeidsforholdFrilansDetaljerPart
                    frilans_arbeidsforhold={frilans_arbeidsforhold}
                    getFieldName={getFieldName}
                />
            )}
        </>
    );
};

export default FormikArbeidsforholdFrilansDetaljer;
