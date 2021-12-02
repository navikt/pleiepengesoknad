import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { DatoTidMap } from '../../../types';
import { ArbeidIPeriodeIntlValues } from '../ArbeidIPeriodeSpørsmål';
import ArbeidstidMånedForm from '../../../pre-common/arbeidstid-måned-form/ArbeidstidMånedForm';
import ArbeidstidMånedInfo from './ArbeidstidMånedInfo';
import { useFormikContext } from 'formik';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { ArbeidstidEnkeltdagEndring } from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import { dateToISODate } from '../../../utils/dateUtils';
import { getDagerSomSkalEndresFraEnkeltdagEndring } from './arbeidstidUtils';
import { getUtilgjengeligeDatoerIMåned } from '../../../utils/getUtilgjengeligeDatoerIMåned';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    arbeidsstedNavn: string;
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
    labels,
    intlValues,
    søknadsdato,
    periode,
    åpentEkspanderbartPanel,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const erHistorisk = dayjs(måned.to).isBefore(søknadsdato, 'day');
    const { setFieldValue } = useFormikContext<SøknadFormData>() || {};

    return (
        <FormikModalFormAndInfo<FieldNames, DatoTidMap, ValidationError>
            name={formFieldName}
            validate={validate}
            labels={labels}
            renderEditButtons={false}
            renderDeleteButton={false}
            dialogClassName={'calendarDialog'}
            wrapInfoInPanel={false}
            defaultValue={{}}
            formRenderer={({ onSubmit, onCancel, data = {} }) => {
                return (
                    <ArbeidstidMånedForm
                        tid={data}
                        intlValues={intlValues}
                        periode={måned}
                        erHistorisk={erHistorisk}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data, onEdit }) => {
                const handleOnEnkeltdagChange = (evt: ArbeidstidEnkeltdagEndring) => {
                    const newValues = { ...data };
                    const dagerSomSkalEndres = getDagerSomSkalEndresFraEnkeltdagEndring(evt, periode);
                    dagerSomSkalEndres.forEach((isoDate) => {
                        newValues[isoDate] = { tid: evt.tid };
                    });
                    newValues[dateToISODate(evt.dato)] = { tid: evt.tid };
                    setFieldValue(formFieldName as any, newValues);
                    onAfterChange ? onAfterChange(newValues) : undefined;
                };

                const utilgjengeligeDatoer = getUtilgjengeligeDatoerIMåned(måned.from, periode);

                return (
                    <ArbeidstidMånedInfo
                        arbeidsstedNavn={arbeidsstedNavn}
                        måned={måned}
                        åpentEkspanderbartPanel={åpentEkspanderbartPanel}
                        tidArbeidstid={data}
                        utilgjengeligeDatoer={utilgjengeligeDatoer}
                        periode={periode}
                        onRequestEdit={onEdit}
                        onEnkeltdagChange={handleOnEnkeltdagChange}
                        editLabel={labels.editLabel}
                        addLabel={labels.addLabel}
                    />
                );
            }}
        />
    );
}

export default ArbeidstidMåned;
