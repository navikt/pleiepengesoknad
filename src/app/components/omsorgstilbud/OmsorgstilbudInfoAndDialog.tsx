import React from 'react';
import { datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ISOStringToDate,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import OmsorgstilbudForm from './OmsorgstilbudForm';
import OmsorgstilbudInfo from './OmsorgstilbudInfo';
import { OmsorgstilbudDag, TidIOmsorgstilbud } from './types';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    fraDato: Date;
    tilDato: Date;
    skjulTommeDagerIListe?: boolean;
    onAfterChange?: (omsorgsdager: TidIOmsorgstilbud) => void;
}

function OmsorgstilbudInfoAndDialog<FieldNames>({
    name,
    fraDato,
    tilDato,
    labels,
    skjulTommeDagerIListe,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    return (
        <FormikModalFormAndInfo<FieldNames, TidIOmsorgstilbud, ValidationError>
            name={name}
            validate={validate}
            labels={labels}
            renderEditButtons={true}
            renderDeleteButton={false}
            dialogClassName={'omsorgstilbudDialog'}
            wrapInfoInPanel={false}
            formRenderer={({ onSubmit, onCancel, data = {} }) => {
                return (
                    <OmsorgstilbudForm
                        fraDato={fraDato}
                        tilDato={tilDato}
                        tidIOmsorgstilbud={data}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data }) => {
                const omsorgsdager: OmsorgstilbudDag[] = [];
                Object.keys(data).forEach((isoDateString) => {
                    const dato = ISOStringToDate(isoDateString);
                    if (dato && datoErInnenforTidsrom(dato, { from: fraDato, to: tilDato })) {
                        const tid = data[isoDateString];
                        if (tid) {
                            omsorgsdager.push({
                                dato,
                                tid,
                            });
                        }
                    }
                    return false;
                });
                return (
                    <OmsorgstilbudInfo
                        omsorgsdager={omsorgsdager}
                        fraDato={fraDato}
                        tilDato={tilDato}
                        skjulTommeDagerIListe={skjulTommeDagerIListe}
                    />
                );
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudInfoAndDialog;
