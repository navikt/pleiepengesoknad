import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidsforholdType,
    getArbeidstimerFastDagValidator,
    TidFasteUkedagerInput,
    validateFasteArbeidstimerIUke,
} from '@navikt/sif-common-pleiepenger/lib';
import {
    Arbeidsforhold,
    ArbeidsforholdFormField,
    ArbeidsforholdFrilanser,
    ArbeidsforholdSelvstendig,
} from '../../../../types/Arbeidsforhold';
import { getArbeidNormaltErLiktHverUkeValidator } from '../../utils/arbeidNormaltErLiktHverUkeValidator';
import { getArbeidsforholdIntlValues } from '../../utils/arbeidsforholdIntlValues';
import InfoJobberNormaltTimer from '../info/InfoJobberNormaltTimer';
import { getJobberNormaltTimerValidator } from '../validation/jobberNormaltTimerValidator';

interface Props {
    parentFieldName: string;
    arbeidsstedNavn: string;
    arbeidsforhold: Arbeidsforhold | ArbeidsforholdFrilanser | ArbeidsforholdSelvstendig;
    arbeidsforholdType: ArbeidsforholdType;
    jobberFortsatt: boolean;
}

const FormComponents = getTypedFormComponents<ArbeidsforholdFormField, Arbeidsforhold, ValidationError>();

const ArbeidsforholdSpørsmål: React.FunctionComponent<Props> = ({
    parentFieldName,
    arbeidsforhold,
    arbeidsforholdType,
    jobberFortsatt,
    arbeidsstedNavn,
}) => {
    const intl = useIntl();
    const getFieldName = (fieldName: ArbeidsforholdFormField) => `${parentFieldName}.${fieldName}` as any;
    const intlValues = getArbeidsforholdIntlValues(intl, {
        arbeidsforhold: {
            arbeidsstedNavn,
            type: arbeidsforholdType,
        },
    });
    return (
        <>
            <FormBlock>
                <FormComponents.YesOrNoQuestion
                    name={getFieldName(ArbeidsforholdFormField.harFraværIPeriode)}
                    legend={intlHelper(intl, 'arbeidsforholdSpørsmål.harFraværIPerioden.spm', intlValues)}
                    validate={getYesOrNoValidator()}
                />
            </FormBlock>
            <FormBlock>
                <FormComponents.YesOrNoQuestion
                    name={getFieldName(ArbeidsforholdFormField.erLiktHverUke)}
                    legend={intlHelper(intl, `arbeidsforholdSpørsmål.jobberNormaltLiktHverUke.spm`, intlValues)}
                    validate={getArbeidNormaltErLiktHverUkeValidator(intlValues)}
                    useTwoColumns={true}
                    labels={{
                        yes: intlHelper(intl, `arbeidsforholdSpørsmål.jobberNormaltLiktHverUke.ja`),
                        no: intlHelper(intl, `arbeidsforholdSpørsmål.jobberNormaltLiktHverUke.nei`),
                    }}
                />
            </FormBlock>
            {arbeidsforhold?.erLiktHverUke === YesOrNo.NO && (
                <FormBlock>
                    <FormComponents.NumberInput
                        label={intlHelper(
                            intl,
                            jobberFortsatt === false
                                ? 'arbeidsforholdSpørsmål.jobberNormaltTimer.avsluttet.spm'
                                : 'arbeidsforholdSpørsmål.jobberNormaltTimer.spm',
                            intlValues
                        )}
                        name={getFieldName(ArbeidsforholdFormField.jobberNormaltTimer)}
                        suffix={intlHelper(intl, `arbeidsforholdSpørsmål.timer.suffix`)}
                        suffixStyle="text"
                        description={<InfoJobberNormaltTimer arbeidsforholdType={arbeidsforholdType} />}
                        bredde="XS"
                        validate={getJobberNormaltTimerValidator(intlValues)}
                        value={arbeidsforhold ? arbeidsforhold.jobberNormaltTimer || '' : ''}
                    />
                </FormBlock>
            )}
            {arbeidsforhold?.erLiktHverUke === YesOrNo.YES && (
                <FormBlock>
                    <FormComponents.InputGroup
                        legend={intlHelper(intl, 'arbeidNormalt.ukedager.tittel', intlValues)}
                        validate={() => {
                            const error = validateFasteArbeidstimerIUke(arbeidsforhold?.jobberNormaltTimerUkedager);
                            return error
                                ? {
                                      key: `validation.arbeidIPeriode.timer.${error.key}`,
                                      values: intlValues,
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                        name={'fasteDager.gruppe' as any}>
                        <TidFasteUkedagerInput
                            name={getFieldName(ArbeidsforholdFormField.jobberNormaltTimerUkedager)}
                            validateDag={(dag, value) => {
                                const error = getArbeidstimerFastDagValidator()(value);
                                return error
                                    ? {
                                          key: `validation.arbeidIPeriode.fast.tid.${error}`,
                                          keepKeyUnaltered: true,
                                          values: { ...intlValues, dag },
                                      }
                                    : undefined;
                            }}
                        />
                    </FormComponents.InputGroup>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidsforholdSpørsmål;
