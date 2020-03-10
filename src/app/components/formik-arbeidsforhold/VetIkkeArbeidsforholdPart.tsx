import React from 'react';
import { useIntl } from 'react-intl';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import Box from 'common/components/box/Box';
import FormikInput from 'common/formik/components/formik-input/FormikInput';
import intlHelper from 'common/utils/intlUtils';
import {
    AppFormField, Arbeidsforhold, ArbeidsforholdField
} from '../../types/PleiepengesøknadFormData';
import { validateReduserteArbeidProsent } from '../../validation/fieldValidations';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    getFieldName: (name: ArbeidsforholdField) => AppFormField;
}

const VetIkkeArbeidsforholdPart: React.FunctionComponent<Props> = ({
    arbeidsforhold: { navn, jobberNormaltTimer },
    getFieldName
}) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="xl">
                <SkjemaGruppe
                    legend={intlHelper(intl, 'arbeidsforhold.iDag.spm', {
                        arbeidsforhold: navn
                    })}>
                    <FormikInput<AppFormField>
                        name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                        type="number"
                        label={intlHelper(intl, 'arbeidsforhold.iDag.utledet')}
                        inputClassName="input--timer"
                        validate={(value) => validateReduserteArbeidProsent(value, true)}
                        value={jobberNormaltTimer || ''}
                        min={0}
                        max={100}
                        maxLength={2}
                    />
                </SkjemaGruppe>
            </Box>
        </>
    );
};

export default VetIkkeArbeidsforholdPart;
