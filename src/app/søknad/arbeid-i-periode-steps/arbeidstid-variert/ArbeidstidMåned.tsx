import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ModalFormAndInfoLabels, TypedFormInputValidationProps } from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { DatoTidMap } from '../../../types';
import { ArbeidIPeriodeIntlValues } from '../ArbeidIPeriodeSpørsmål';
import ArbeidstidMånedInfo from './ArbeidstidMånedInfo';
import { useFormikContext } from 'formik';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { ArbeidstidEnkeltdagEndring } from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import { getUtilgjengeligeDatoerIMåned } from '../utils/getUtilgjengeligeDatoerIMåned';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    arbeidsstedNavn: string;
    arbeidstid: DatoTidMap;
    formFieldName: FieldNames;
    labels: ModalFormAndInfoLabels;
    måned: DateRange;
    søknadsdato: Date;
    periode: DateRange;
    intlValues: ArbeidIPeriodeIntlValues;
    åpentEkspanderbartPanel?: boolean;
    onAfterChange?: (tid: DatoTidMap) => void;
}

function ArbeidstidMåned<FieldNames>({
    formFieldName,
    arbeidsstedNavn,
    måned,
    arbeidstid,
    periode,
    åpentEkspanderbartPanel,
    onAfterChange,
}: Props<FieldNames>) {
    const { setFieldValue } = useFormikContext<SøknadFormData>() || {};

    const handleOnEnkeltdagChange = (evt: ArbeidstidEnkeltdagEndring) => {
        const newValues = { ...arbeidstid, ...evt.dagerMedTid };
        setFieldValue(formFieldName as any, newValues);
        onAfterChange ? onAfterChange(newValues) : undefined;
    };

    const utilgjengeligeDatoer = getUtilgjengeligeDatoerIMåned(måned.from, periode);

    return (
        <ArbeidstidMånedInfo
            arbeidsstedNavn={arbeidsstedNavn}
            måned={måned}
            åpentEkspanderbartPanel={åpentEkspanderbartPanel}
            tidArbeidstid={arbeidstid}
            utilgjengeligeDatoer={utilgjengeligeDatoer}
            periode={periode}
            onEnkeltdagChange={handleOnEnkeltdagChange}
        />
    );
}

export default ArbeidstidMåned;
