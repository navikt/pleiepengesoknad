import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import {
    ArbeidsforholdFormField,
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilanserFormValues,
    ArbeidsforholdSelvstendigFormValues,
    ArbeidsforholdFrilanserMedOppdragFormValues,
} from '../../../../types/ArbeidsforholdFormValues';
import { getArbeidsforholdIntlValues } from '../../utils/arbeidsforholdIntlValues';
import { getArbeiderNormaltTimerIUkenValidator } from '../../validation/arbeiderNormaltTimerIUkenValidator';
import InfoArbeiderNormaltTimerIUken from '../info/InfoArbeiderNormaltTimerIUken';

interface Props {
    arbeidsforholdFieldName: string;
    arbeidsstedNavn?: string;
    arbeidsforhold:
        | ArbeidsforholdFormValues
        | ArbeidsforholdFrilanserFormValues
        | ArbeidsforholdFrilanserMedOppdragFormValues
        | ArbeidsforholdSelvstendigFormValues;
    arbeidsforholdType: ArbeidsforholdType;
    erAktivtArbeidsforhold: boolean;
    brukKunSnittPerUke: boolean;
}

const FormComponents = getTypedFormComponents<ArbeidsforholdFormField, ArbeidsforholdFormValues, ValidationError>();

const NormalarbeidstidSpørsmål: React.FunctionComponent<Props> = ({
    arbeidsforholdFieldName,
    arbeidsforhold,
    arbeidsforholdType,
    erAktivtArbeidsforhold,
    arbeidsstedNavn,
    brukKunSnittPerUke,
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
