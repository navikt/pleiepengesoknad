import React from 'react';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import {
    AppFormField,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
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

const ArbeidsforholdSNFDetaljer = ({ appFormField, snF_arbeidsforhold, frilansEllerSelvstendig }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdSNFField) => `${appFormField}.${field}` as AppFormField;

    const hvaBetyrDetteTekst =
        appFormField === AppFormField.frilans_arbeidsforhold
            ? intlHelper(intl, 'snF.ArbeidsforholdDetaljer.hvaBetyr.frilanser.info')
            : intlHelper(intl, 'snF.ArbeidsforholdDetaljer.hvaBetyr.SN.info');

    return (
        <>
            <FormBlock>
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
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.ja'),
                            value: ArbeidsforholdSkalJobbeSvar.ja,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.nei'),
                            value: ArbeidsforholdSkalJobbeSvar.nei,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.vetIkke'),
                            value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                        },
                    ]}
                />
            </FormBlock>
            {snF_arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.ja &&
                hasValue(snF_arbeidsforhold.jobberNormaltTimer) && (
                    <>
                        <FormBlock>
                            <AppForm.RadioPanelGroup
                                name={getFieldName(ArbeidsforholdSNFField.skalJobbeHvorMye)}
                                legend={`Hvor mye skal du jobbe som ${
                                    frilansEllerSelvstendig === 'frilans' ? 'frilanser' : 'selvstendig næringsdrivende'
                                }`}
                                radios={[
                                    {
                                        value: ArbeidsforholdSkalJobbeHvorMyeSvar.somVanlig,
                                        label: `Som normalt (${snF_arbeidsforhold.jobberNormaltTimer} timer)`,
                                    },
                                    {
                                        value: ArbeidsforholdSkalJobbeHvorMyeSvar.redusert,
                                        label: `Mindre enn ${snF_arbeidsforhold.jobberNormaltTimer} timer`,
                                    },
                                ]}
                            />
                        </FormBlock>
                        {snF_arbeidsforhold.skalJobbeHvorMye === ArbeidsforholdSkalJobbeHvorMyeSvar.redusert && (
                            <FormBlock>
                                <RedusertArbeidsforholdSNFDetaljerPart
                                    frilansEllerSelvstendig={frilansEllerSelvstendig}
                                    frilans_arbeidsforhold={snF_arbeidsforhold}
                                    getFieldName={getFieldName}
                                />
                            </FormBlock>
                        )}
                    </>
                )}
        </>
    );
};

export default ArbeidsforholdSNFDetaljer;
