import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import {
    AppFormField,
    ArbeidsforholdAnsatt,
    ArbeidsforholdField,
    ArbeidsforholdSNF,
    Arbeidsform,
    isArbeidsforholdAnsatt,
} from '../../../../types/PleiepengesøknadFormData';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformInfo from '../info/ArbeidsformInfo';

interface Props {
    arbeidsforhold?: ArbeidsforholdAnsatt | ArbeidsforholdSNF;
    validator: {
        arbeidsform: ValidationFunction<ValidationError>;
        jobberNormaltTimer: ValidationFunction<ValidationError>;
    };
    spørsmål: {
        arbeidsform: string;
        jobberNormaltTimer: (arbeidsform: Arbeidsform) => string;
    };
    parentFieldName: string;
}

const ArbeidsforholdFormPart: React.FunctionComponent<Props> = ({
    arbeidsforhold,
    spørsmål,
    parentFieldName,
    validator,
}) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as AppFormField;
    const erAnsattArbeidsforhold = isArbeidsforholdAnsatt(arbeidsforhold);
    return (
        <>
            <FormBlock margin="none">
                <AppForm.RadioPanelGroup
                    legend={spørsmål.arbeidsform}
                    name={getFieldName(ArbeidsforholdField.arbeidsform)}
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.fast'),
                            value: Arbeidsform.fast,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.turnus'),
                            value: Arbeidsform.turnus,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.varierende'),
                            value: Arbeidsform.varierende,
                        },
                    ]}
                    validate={validator.arbeidsform}
                />
            </FormBlock>
            {arbeidsforhold?.arbeidsform !== undefined && (
                <FormBlock>
                    <AppForm.NumberInput
                        label={spørsmål.jobberNormaltTimer(arbeidsforhold?.arbeidsform)}
                        name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                        suffix={intlHelper(
                            intl,
                            `arbeidsforhold.arbeidsform.${arbeidsforhold.arbeidsform}.timer.suffix`
                        )}
                        suffixStyle="text"
                        description={
                            <div style={{ width: '100%' }}>
                                {arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                    <Box margin="m">
                                        <ArbeidsformInfo
                                            arbeidsform={Arbeidsform.fast}
                                            gjelderSnFri={erAnsattArbeidsforhold === false}
                                        />
                                    </Box>
                                )}
                                {arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                    <Box margin="m">
                                        <ArbeidsformInfo
                                            arbeidsform={Arbeidsform.turnus}
                                            gjelderSnFri={erAnsattArbeidsforhold === false}
                                        />
                                    </Box>
                                )}
                                {arbeidsforhold.arbeidsform === Arbeidsform.varierende && (
                                    <>
                                        <Box margin="m">
                                            <ArbeidsformInfo
                                                arbeidsform={Arbeidsform.varierende}
                                                gjelderSnFri={erAnsattArbeidsforhold === false}
                                            />
                                        </Box>
                                    </>
                                )}
                            </div>
                        }
                        bredde="XS"
                        validate={validator.jobberNormaltTimer}
                        value={arbeidsforhold.jobberNormaltTimer || ''}
                    />
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidsforholdFormPart;
