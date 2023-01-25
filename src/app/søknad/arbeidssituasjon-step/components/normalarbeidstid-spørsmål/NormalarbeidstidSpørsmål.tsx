import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import {
    ArbeidsforholdFormField,
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilanserFormValues,
    ArbeidsforholdSelvstendigFormValues,
} from '../../../../types/ArbeidsforholdFormValues';
import { getArbeidsforholdIntlValues } from '../../utils/arbeidsforholdIntlValues';
import { getArbeiderNormaltTimerIUkenValidator } from '../../validation/arbeiderNormaltTimerIUkenValidator';
import InfoArbeiderNormaltTimerIUken from '../info/InfoArbeiderNormaltTimerIUken';
import { FrilansTyper } from '../../../../types/FrilansFormData';

interface Props {
    arbeidsforholdFieldName: string;
    arbeidsstedNavn?: string;
    arbeidsforhold: ArbeidsforholdFormValues | ArbeidsforholdFrilanserFormValues | ArbeidsforholdSelvstendigFormValues;
    arbeidsforholdType: ArbeidsforholdType;
    erAktivtArbeidsforhold: boolean;
    brukKunSnittPerUke: boolean;
    frilansTyper?: FrilansTyper[];
    misterHonorarStyreverv?: YesOrNo;
}

const FormComponents = getTypedFormComponents<ArbeidsforholdFormField, ArbeidsforholdFormValues, ValidationError>();

const NormalarbeidstidSpørsmål: React.FunctionComponent<Props> = ({
    arbeidsforholdFieldName,
    arbeidsforhold,
    arbeidsforholdType,
    erAktivtArbeidsforhold,
    arbeidsstedNavn,
    brukKunSnittPerUke,
    frilansTyper,
    misterHonorarStyreverv,
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

    const getFrilansTekst = () => {
        if (frilansTyper === undefined || frilansTyper.length === 0) {
            return '';
        }
        const erFrilanser = frilansTyper.some((type) => type === FrilansTyper.FRILANS);
        const erVerv =
            frilansTyper.some((type) => type === FrilansTyper.STYREVERV) && misterHonorarStyreverv === YesOrNo.YES;

        if (erFrilanser && !erVerv) {
            return 'arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.frilanser.spm';
        }
        if (erVerv && !erFrilanser) {
            return 'arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.verv.spm';
        }
        if (erVerv && erFrilanser) {
            return 'arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.frilanserVerv.spm';
        }
        return '';
    };

    const renderTimerPerUkeSpørsmål = () => {
        return (
            <FormComponents.NumberInput
                label={intlHelper(
                    intl,
                    arbeidsforholdType === ArbeidsforholdType.FRILANSER
                        ? getFrilansTekst()
                        : erAktivtArbeidsforhold === false
                        ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.avsluttet.spm`
                        : `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.spm`,
                    intlValues
                )}
                data-testid={inputTestID}
                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_TimerPerUke)}
                description={
                    <InfoArbeiderNormaltTimerIUken
                        arbeidsforholdType={arbeidsforholdType}
                        frilansTyper={frilansTyper}
                        misterHonorarStyreverv={misterHonorarStyreverv}
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
                description={
                    <InfoArbeiderNormaltTimerIUken
                        arbeidsforholdType={arbeidsforholdType}
                        frilansTyper={frilansTyper}
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
        </>
    );
};

export default NormalarbeidstidSpørsmål;
