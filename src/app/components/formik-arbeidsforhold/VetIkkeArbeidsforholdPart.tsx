import React from 'react';
import Box from 'common/components/box/Box';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Arbeidsforhold, ArbeidsforholdField, AppFormField } from '../../types/PleiepengesøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { validateReduserteArbeidProsent } from '../../validation/fieldValidations';
import { useIntl } from 'react-intl';
import FormikInput from '../../../common/formik/formik-input/FormikInput';

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
                    title={intlHelper(intl, 'arbeidsforhold.iDag.spm', {
                        arbeidsforhold: navn
                    })}>
                    <FormikInput<AppFormField>
                        name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                        type="number"
                        label={intlHelper(intl, 'arbeidsforhold.iDag.utledet')}
                        inputClassName="input--timer"
                        validate={(value) => validateReduserteArbeidProsent(value, true)}
                        value={jobberNormaltTimer || ''}
                        labelRight={true}
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
