import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { Duration, durationToDecimalDuration } from '@navikt/sif-common-utils/lib';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFormField,
    ArbeidsforholdFrilanserFormValues,
    ArbeidsforholdSelvstendigFormValues,
} from '../../../../types/ArbeidsforholdFormValues';
import { getArbeidsforholdIntlValues } from '../../utils/arbeidsforholdIntlValues';
import { getArbeiderNormaltTimerIUkenValidator } from '../../validation/arbeiderNormaltTimerIUkenValidator';
import InfoArbeiderNormaltTimerIUken from '../info/InfoArbeiderNormaltTimerIUken';

interface Props {
    arbeidsforholdFieldName: string;
    arbeidsstedNavn?: string;
    arbeidsforhold: ArbeidsforholdFormValues | ArbeidsforholdFrilanserFormValues | ArbeidsforholdSelvstendigFormValues;
    arbeidsforholdType: ArbeidsforholdType;
    erAktivtArbeidsforhold: boolean;
    brukKunSnittPerUke: boolean;
    timerPerUkeISnittForrigeSøknad?: Duration;
}

const FormComponents = getTypedFormComponents<ArbeidsforholdFormField, ArbeidsforholdFormValues, ValidationError>();

const NormalarbeidstidSpørsmål: React.FunctionComponent<Props> = ({
    arbeidsforholdFieldName,
    arbeidsforhold,
    arbeidsforholdType,
    erAktivtArbeidsforhold,
    arbeidsstedNavn,
    brukKunSnittPerUke,
    timerPerUkeISnittForrigeSøknad,
}) => {
    const intl = useIntl();
    const getFieldName = (fieldName: ArbeidsforholdFormField) => `${arbeidsforholdFieldName}.${fieldName}` as any;
    const intlValues = getArbeidsforholdIntlValues(intl, {
        arbeidsforhold: {
            arbeidsstedNavn,
            type: arbeidsforholdType,
        },
    });

    const inputTestID = ArbeidsforholdFormField.normalarbeidstid_TimerPerUke;

    const renderTimerPerUkeSpørsmål = () => {
        return (
            <FormComponents.NumberInput
                label={intlHelper(
                    intl,
                    erAktivtArbeidsforhold === false
                        ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.avsluttet.spm`
                        : `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.spm`,
                    intlValues
                )}
                data-testid={inputTestID}
                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_TimerPerUke)}
                description={<InfoArbeiderNormaltTimerIUken arbeidsforholdType={arbeidsforholdType} />}
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

    if (brukKunSnittPerUke) {
        return <FormBlock>{renderTimerPerUkeSpørsmål()}</FormBlock>;
    }

    return (
        <>
            {timerPerUkeISnittForrigeSøknad !== undefined && (
                <>
                    <FormComponents.YesOrNoQuestion
                        name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_erLiktSomForrigeSøknad)}
                        legend={`I forrige søknad oppga du at du normalt jobber ${durationToDecimalDuration(
                            timerPerUkeISnittForrigeSøknad
                        )} timer per uke hos ${arbeidsstedNavn}. Stemmer dette fremdeles?`}
                        data-testid="normalarbeidstidErLikForrigeSøknad"
                        validate={(value: any) => {
                            const error = getRequiredFieldValidator()(value);
                            return error
                                ? {
                                      key: 'validation.arbeidsforhold.erLiktSomForrigeSøknad',
                                      values: intlValues,
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                        useTwoColumns={true}
                    />
                </>
            )}

            <FormComponents.NumberInput
                label={intlHelper(
                    intl,
                    erAktivtArbeidsforhold === false
                        ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.avsluttet.spm`
                        : `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.spm`,
                    intlValues
                )}
                data-testid={inputTestID}
                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_TimerPerUke)}
                description={<InfoArbeiderNormaltTimerIUken arbeidsforholdType={arbeidsforholdType} />}
                suffix={intlHelper(intl, `arbeidsforhold.timerPerUke.suffix`)}
                suffixStyle="text"
                bredde="XS"
                validate={getArbeiderNormaltTimerIUkenValidator({
                    ...intlValues,
                    jobber: erAktivtArbeidsforhold ? 'jobber' : 'jobbet',
                })}
                value={arbeidsforhold.normalarbeidstid ? arbeidsforhold.normalarbeidstid.timerPerUke || '' : ''}
            />
        </>
    );
};

export default NormalarbeidstidSpørsmål;
