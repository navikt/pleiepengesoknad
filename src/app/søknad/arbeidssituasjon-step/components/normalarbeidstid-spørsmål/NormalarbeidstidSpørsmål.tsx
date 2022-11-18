import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import {
    ArbeidsforholdFormField,
    ArbeidsforholdFormValues,
    ArbeidsforholdSelvstendigFormValues,
    ArbeidsforholdFrilansoppdragFormValues,
} from '../../../../types/ArbeidsforholdFormValues';
import { getArbeidsforholdIntlValues } from '../../utils/arbeidsforholdIntlValues';
import { getArbeiderNormaltTimerIUkenValidator } from '../../validation/arbeiderNormaltTimerIUkenValidator';
import InfoArbeiderNormaltTimerIUken from '../info/InfoArbeiderNormaltTimerIUken';
import { FrilansoppdragType } from '../../../../types/FrilansoppdragFormData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    arbeidsforholdFieldName: string;
    arbeidsstedNavn?: string;
    arbeidsforhold:
        | ArbeidsforholdFormValues
        | ArbeidsforholdFrilansoppdragFormValues
        | ArbeidsforholdSelvstendigFormValues;
    arbeidsforholdType: ArbeidsforholdType;
    erAktivtArbeidsforhold: boolean;
    brukKunSnittPerUke: boolean;
    frilanserOppdragType?: FrilansoppdragType;
}

const FormComponents = getTypedFormComponents<ArbeidsforholdFormField, ArbeidsforholdFormValues, ValidationError>();

const NormalarbeidstidSpørsmål: React.FunctionComponent<Props> = ({
    arbeidsforholdFieldName,
    arbeidsforhold,
    arbeidsforholdType,
    erAktivtArbeidsforhold,
    arbeidsstedNavn,
    brukKunSnittPerUke,
    frilanserOppdragType,
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

    const getLabelTilNumberInput = () => {
        if (arbeidsforholdType === ArbeidsforholdType.FRILANSER && frilanserOppdragType) {
            return erAktivtArbeidsforhold === false
                ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.avsluttet.${frilanserOppdragType}.spm`
                : `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.${frilanserOppdragType}.spm`;
        }

        return arbeidsforholdType !== ArbeidsforholdType.FRILANSER && erAktivtArbeidsforhold === false
            ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.avsluttet.spm`
            : `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.spm`;
    };

    const renderTimerPerUkeSpørsmål = () => {
        return (
            <FormComponents.NumberInput
                label={intlHelper(intl, getLabelTilNumberInput(), intlValues)}
                data-testid={inputTestID}
                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_TimerPerUke)}
                description={
                    <InfoArbeiderNormaltTimerIUken
                        arbeidsforholdType={arbeidsforholdType}
                        frilanserOppdragType={frilanserOppdragType}
                    />
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

    if (brukKunSnittPerUke) {
        return <Box margin="l">{renderTimerPerUkeSpørsmål()}</Box>;
    }

    return (
        <Box margin="l" padBottom="l">
            <FormComponents.NumberInput
                label={intlHelper(intl, getLabelTilNumberInput(), intlValues)}
                data-testid={inputTestID}
                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_TimerPerUke)}
                description={
                    <InfoArbeiderNormaltTimerIUken
                        arbeidsforholdType={arbeidsforholdType}
                        frilanserOppdragType={frilanserOppdragType}
                    />
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
        </Box>
    );
};

export default NormalarbeidstidSpørsmål;
