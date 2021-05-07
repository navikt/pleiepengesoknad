import React from 'react';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import {
    AppFormField,
    ArbeidsforholdSkalJobbeSvar,
    ArbeidsforholdSNF,
    ArbeidsforholdSNFField,
} from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import RedusertArbeidsforholdSNFDetaljerPart, {
    FrilansEllerSelvstendig,
} from './RedusertArbeidsforholdSNFDetaljerPart';

interface Props {
    snF_arbeidsforhold: ArbeidsforholdSNF;
    appFormField: AppFormField;
    frilansEllerSelvstendig: FrilansEllerSelvstendig;
}

const FormikArbeidsforholdSNFDetaljer = ({ snF_arbeidsforhold, appFormField, frilansEllerSelvstendig }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdSNFField) => `${appFormField}.${field}` as AppFormField;

    const hvaBetyrDetteTekst =
        appFormField === AppFormField.frilans_arbeidsforhold
            ? intlHelper(intl, 'snF.ArbeidsforholdDetaljer.hvaBetyr.frilanser.info')
            : intlHelper(intl, 'snF.ArbeidsforholdDetaljer.hvaBetyr.SN.info');
    return (
        <>
            <AppForm.RadioPanelGroup
                legend={
                    appFormField === AppFormField.frilans_arbeidsforhold
                        ? intlHelper(intl, 'arbeidsforhold.arbeidsforhold.frilanser.spm')
                        : intlHelper(intl, 'arbeidsforhold.arbeidsforhold.sn.spm')
                }
                description={
                    <ExpandableInfo title={intlHelper(intl, 'snF.ArbeidsforholdDetaljer.hvaBetyr.spm')}>
                        {hvaBetyrDetteTekst}
                    </ExpandableInfo>
                }
                name={getFieldName(ArbeidsforholdSNFField.skalJobbe)}
                validate={getRequiredFieldValidator()}
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
            {snF_arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                <RedusertArbeidsforholdSNFDetaljerPart
                    frilansEllerSelvstendig={frilansEllerSelvstendig}
                    frilans_arbeidsforhold={snF_arbeidsforhold}
                    getFieldName={getFieldName}
                />
            )}
        </>
    );
};

export default FormikArbeidsforholdSNFDetaljer;
