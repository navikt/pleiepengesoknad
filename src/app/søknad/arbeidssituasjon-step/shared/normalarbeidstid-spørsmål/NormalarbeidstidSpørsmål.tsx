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
import InfoArbeiderLiktHverUke from '../info/InfoArbeiderLiktHverUke';
import InfoArbeiderNormaltTimerIUken from '../info/InfoArbeiderNormaltTimerIUken';
import { getArbeiderNormaltTimerIUkenValidator } from '../validation/arbeiderNormaltTimerIUkenValidator';

interface Props {
    arbeidsforholdFieldName: string;
    arbeidsstedNavn?: string;
    arbeidsforhold: ArbeidsforholdFormData | ArbeidsforholdFrilanserFormData | ArbeidsforholdSelvstendigFormData;
    arbeidsforholdType: ArbeidsforholdType;
    erAktivtArbeidsforhold: boolean;
}

const FormComponents = getTypedFormComponents<ArbeidsforholdFormField, ArbeidsforholdFormData, ValidationError>();

const NormalarbeidstidSpørsmål: React.FunctionComponent<Props> = ({
    arbeidsforholdFieldName,
    arbeidsforhold,
    arbeidsforholdType,
    erAktivtArbeidsforhold,
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
                    erAktivtArbeidsforhold === false
                        ? spørOmTimerISnitt
                            ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.avsluttet.spm`
                            : 'arbeidsforhold.arbeiderNormaltTimerPerUke.avsluttet.spm'
                        : spørOmTimerISnitt
                        ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.spm`
                        : `arbeidsforhold.arbeiderNormaltTimerPerUke.spm`,
                    intlValues
                )}
                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_TimerPerUke)}
                description={
                    spørOmTimerISnitt ? (
                        <InfoArbeiderNormaltTimerIUken arbeidsforholdType={arbeidsforholdType} />
                    ) : undefined
                }
                suffix={intlHelper(intl, `arbeidsforhold.timerPerUke.suffix`)}
                suffixStyle="text"
                bredde="XS"
                validate={getArbeiderNormaltTimerIUkenValidator({
                    ...intlValues,
                    jobber: erAktivtArbeidsforhold ? 'jobber' : 'jobbet',
                })}
                value={arbeidsforhold.normalarbeidstid ? arbeidsforhold.normalarbeidstid.timerPerUke || '' : ''}
            />
        );
    };
    return (
        <>
            <FormComponents.YesOrNoQuestion
                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_erLikeMangeTimerHverUke)}
                legend={intlHelper(intl, `arbeidsforhold.erLikeMangeTimerHverUke.spm`, intlValues)}
                description={<InfoArbeiderLiktHverUke arbeidsforholdType={arbeidsforholdType} />}
                validate={(value: any) => {
                    const error = getRequiredFieldValidator()(value);
                    return error
                        ? {
                              key: 'validation.arbeidsforhold.erLikeMangeTimerHverUke',
                              values: intlValues,
                              keepKeyUnaltered: true,
                          }
                        : undefined;
                }}
                useTwoColumns={true}
                labels={{
                    yes: intlHelper(intl, `arbeidsforhold.erLikeMangeTimerHverUke.ja`),
                    no: intlHelper(intl, `arbeidsforhold.erLikeMangeTimerHverUke.nei`),
                }}
            />

            {arbeidsforhold.normalarbeidstid?.erLikeMangeTimerHverUke === YesOrNo.NO && (
                <FormBlock>{renderTimerPerUkeSpørsmål(true)}</FormBlock>
            )}
            {arbeidsforhold.normalarbeidstid?.erLikeMangeTimerHverUke === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <FormComponents.YesOrNoQuestion
                            name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_erFasteUkedager)}
                            legend={intlHelper(intl, `arbeidsforhold.erFasteUkedager.spm`, intlValues)}
                            labels={{
                                yes: intlHelper(intl, `arbeidsforhold.erFasteUkedager.ja`),
                                no: intlHelper(intl, `arbeidsforhold.erFasteUkedager.nei`),
                            }}
                            useTwoColumns={true}
                        />
                    </FormBlock>
                    {arbeidsforhold.normalarbeidstid.erFasteUkedager === YesOrNo.YES && (
                        <FormBlock>
                            <FormComponents.InputGroup
                                legend={
                                    erAktivtArbeidsforhold
                                        ? intlHelper(intl, 'arbeidsforhold.ukedager.tittel', intlValues)
                                        : intlHelper(intl, 'arbeidsforhold.ukedager.avsluttet.tittel', intlValues)
                                }
                                validate={() => {
                                    const error = validateFasteArbeidstimerIUke(
                                        arbeidsforhold.normalarbeidstid?.timerFasteUkedager
                                    );
                                    return error
                                        ? {
                                              key: `validation.arbeidsforhold.erFasteUkedager.${error.key}`,
                                              values: {
                                                  ...intlValues,
                                                  jobber: erAktivtArbeidsforhold ? 'jobber' : 'jobbet',
                                              },
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined;
                                }}
                                name={'erFasteUkedager.gruppe' as any}>
                                <TidFasteUkedagerInput
                                    name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_timerFasteUkedager)}
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
                    {arbeidsforhold.normalarbeidstid.erFasteUkedager === YesOrNo.NO && (
                        <FormBlock>{renderTimerPerUkeSpørsmål(true)}</FormBlock>
                    )}
                </>
            )}
        </>
    );
};

export default NormalarbeidstidSpørsmål;
