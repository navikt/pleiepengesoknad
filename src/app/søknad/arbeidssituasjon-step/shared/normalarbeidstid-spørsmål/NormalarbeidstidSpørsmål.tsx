import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidsforholdType,
    getArbeidstimerFastDagValidator,
    TidFasteUkedagerInput,
    validateFasteArbeidstimerIUke,
} from '@navikt/sif-common-pleiepenger/lib';
import {
    ArbeidsforholdFormData,
    ArbeidsforholdFormField,
    ArbeidsforholdFrilanserFormData,
    ArbeidsforholdSelvstendigFormData,
} from '../../../../types/ArbeidsforholdFormData';
import { getArbeidsforholdIntlValues } from '../../utils/arbeidsforholdIntlValues';
import InfoJobberNormaltTimerIUken from '../info/InfoJobberNormaltTimerIUken';
import { getJobberNormaltTimerIUkenValidator } from '../validation/jobberNormaltTimerValidator';
import InfoJobberLiktHverUke from '../info/InfoJobberLiktHverUke';

interface Props {
    arbeidsforholdFieldName: string;
    arbeidsstedNavn?: string;
    arbeidsforhold: ArbeidsforholdFormData | ArbeidsforholdFrilanserFormData | ArbeidsforholdSelvstendigFormData;
    arbeidsforholdType: ArbeidsforholdType;
    jobberFortsatt: boolean;
}

const FormComponents = getTypedFormComponents<ArbeidsforholdFormField, ArbeidsforholdFormData, ValidationError>();

const NormalarbeidstidSpørsmål: React.FunctionComponent<Props> = ({
    arbeidsforholdFieldName,
    arbeidsforhold,
    arbeidsforholdType,
    jobberFortsatt,
    arbeidsstedNavn,
}) => {
    const intl = useIntl();
    const getFieldName = (fieldName: ArbeidsforholdFormField) => `${arbeidsforholdFieldName}.${fieldName}` as any;
    const intlValues = getArbeidsforholdIntlValues(intl, {
        arbeidsforhold: {
            arbeidsstedNavn,
            type: arbeidsforholdType,
        },
    });

    const renderTimerPerUkeSpørsmål = (spørOmTimerISnitt: boolean) => {
        return (
            <FormComponents.NumberInput
                label={intlHelper(
                    intl,
                    jobberFortsatt === false
                        ? spørOmTimerISnitt
                            ? `arbeidsforhold.jobberNormaltTimerPerUke.snitt.avsluttet.spm`
                            : 'arbeidsforhold.jobberNormaltTimerPerUke.avsluttet.spm'
                        : spørOmTimerISnitt
                        ? `arbeidsforhold.jobberNormaltTimerPerUke.snitt.spm`
                        : `arbeidsforhold.jobberNormaltTimerPerUke.spm`,
                    intlValues
                )}
                name={getFieldName(ArbeidsforholdFormField.jobberNormaltTimerPerUke)}
                description={
                    spørOmTimerISnitt ? (
                        <InfoJobberNormaltTimerIUken arbeidsforholdType={arbeidsforholdType} />
                    ) : undefined
                }
                suffix={intlHelper(intl, `arbeidsforhold.timerPerUke.suffix`)}
                suffixStyle="text"
                bredde="XS"
                validate={getJobberNormaltTimerIUkenValidator({
                    ...intlValues,
                    jobber: jobberFortsatt ? 'jobber' : 'jobbet',
                })}
                value={arbeidsforhold.normalarbeidstid ? arbeidsforhold.normalarbeidstid.timerPerUke || '' : ''}
            />
        );
    };
    return (
        <>
            <FormBlock>
                <FormComponents.YesOrNoQuestion
                    name={getFieldName(ArbeidsforholdFormField.erLiktHverUke)}
                    legend={intlHelper(intl, `arbeidsforhold.erLiktHverUke.spm`, intlValues)}
                    description={<InfoJobberLiktHverUke arbeidsforholdType={arbeidsforholdType} />}
                    validate={(value: any) => {
                        const error = getRequiredFieldValidator()(value);
                        return error
                            ? {
                                  key: 'validation.arbeidsforhold.erLiktHverUke',
                                  values: intlValues,
                                  keepKeyUnaltered: true,
                              }
                            : undefined;
                    }}
                    useTwoColumns={true}
                    labels={{
                        yes: intlHelper(intl, `arbeidsforhold.erLiktHverUke.ja`),
                        no: intlHelper(intl, `arbeidsforhold.erLiktHverUke.nei`),
                    }}
                />
            </FormBlock>
            {arbeidsforhold.normalarbeidstid?.erLiktHverUke === YesOrNo.NO && (
                <FormBlock>{renderTimerPerUkeSpørsmål(true)}</FormBlock>
            )}
            {arbeidsforhold.normalarbeidstid?.erLiktHverUke === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <FormComponents.YesOrNoQuestion
                            name={getFieldName(ArbeidsforholdFormField.jobberNormaltTimerLiktHverDag)}
                            legend={intlHelper(intl, `arbeidsforhold.erLiktHverDag.spm`, intlValues)}
                            labels={{
                                yes: intlHelper(intl, `arbeidsforhold.erLiktHverDag.ja`),
                                no: intlHelper(intl, `arbeidsforhold.erLiktHverDag.nei`),
                            }}
                            useTwoColumns={true}
                        />
                    </FormBlock>
                    {arbeidsforhold.normalarbeidstid.liktHverDag === YesOrNo.NO && (
                        <FormBlock>
                            <FormComponents.InputGroup
                                legend={
                                    jobberFortsatt
                                        ? intlHelper(intl, 'arbeidsforhold.ukedager.tittel', intlValues)
                                        : intlHelper(intl, 'arbeidsforhold.ukedager.avsluttet.tittel', intlValues)
                                }
                                validate={() => {
                                    const error = validateFasteArbeidstimerIUke(
                                        arbeidsforhold.normalarbeidstid?.fasteDager
                                    );
                                    return error
                                        ? {
                                              key: `validation.arbeidsforhold.fasteDager.${error.key}`,
                                              values: { ...intlValues, jobber: jobberFortsatt ? 'jobber' : 'jobbet' },
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined;
                                }}
                                name={'fasteDager.gruppe' as any}>
                                <TidFasteUkedagerInput
                                    name={getFieldName(ArbeidsforholdFormField.jobberNormaltTimerFasteDager)}
                                    validateDag={(dag, value) => {
                                        const error = getArbeidstimerFastDagValidator()(value);
                                        return error
                                            ? {
                                                  key: `validation.arbeidsforhold.fastDag.tid.${error}`,
                                                  keepKeyUnaltered: true,
                                                  values: { ...intlValues, dag },
                                              }
                                            : undefined;
                                    }}
                                />
                            </FormComponents.InputGroup>
                        </FormBlock>
                    )}
                    {arbeidsforhold.normalarbeidstid.liktHverDag === YesOrNo.YES && (
                        <FormBlock>{renderTimerPerUkeSpørsmål(false)}</FormBlock>
                    )}
                </>
            )}
        </>
    );
};

export default NormalarbeidstidSpørsmål;
