import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { Arbeidsforhold, ArbeidsforholdFrilanser, SøknadFormField } from '../../../types/SøknadFormData';
import SøknadFormComponents from '../../SøknadFormComponents';

interface Props {
    arbeidsforhold?: Arbeidsforhold | ArbeidsforholdFrilanser;
    validator: ValidationFunction<ValidationError>;
    spørsmål: string;
    fieldName: SøknadFormField;
    description?: React.ReactNode;
}

const JobberNormaltTimerSpørsmål: React.FC<Props> = ({
    arbeidsforhold,
    validator,
    spørsmål,
    description,
    fieldName,
}) => {
    const intl = useIntl();

    return (
        <>
            <SøknadFormComponents.NumberInput
                label={spørsmål}
                name={fieldName}
                suffix={intlHelper(intl, `arbeidsforhold.timer.suffix`)}
                suffixStyle="text"
                description={description}
                bredde="XS"
                validate={validator}
                value={arbeidsforhold ? arbeidsforhold.jobberNormaltTimer || '' : ''}
            />
        </>
    );
};

export default JobberNormaltTimerSpørsmål;
