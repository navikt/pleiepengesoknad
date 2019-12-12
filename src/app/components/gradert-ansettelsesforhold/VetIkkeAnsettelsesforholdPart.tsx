import React from 'react';
import Box from 'common/components/box/Box';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import Input from '../input/Input';
import { AnsettelsesforholdForm, AnsettelsesforholdField, Field } from '../../types/PleiepengesøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { validateReduserteArbeidProsent } from '../../validation/fieldValidations';
import { injectIntl, InjectedIntlProps } from 'react-intl';

interface Props {
    ansettelsesforhold: AnsettelsesforholdForm;
    getFieldName: (name: AnsettelsesforholdField) => Field;
}

const VetIkkeAnsettelsesforholdPart: React.FunctionComponent<Props & InjectedIntlProps> = ({
    ansettelsesforhold: { navn, timerEllerProsent, jobberNormaltTimer, skalJobbeTimer, skalJobbeProsent },
    getFieldName,
    intl
}) => {
    return (
        <>
            <Box margin="xl">
                <SkjemaGruppe
                    title={intlHelper(intl, 'gradertAnsettelsesforhold.iDag.spm', {
                        arbeidsforhold: navn
                    })}>
                    <Input
                        name={getFieldName(AnsettelsesforholdField.jobberNormaltTimer)}
                        type="number"
                        label={intlHelper(intl, 'gradertAnsettelsesforhold.iDag.utledet')}
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

export default injectIntl(VetIkkeAnsettelsesforholdPart);
