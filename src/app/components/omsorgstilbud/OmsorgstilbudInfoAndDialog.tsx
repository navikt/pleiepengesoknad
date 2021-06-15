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
import Knapp from 'nav-frontend-knapper';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Undertittel } from 'nav-frontend-typografi';
import dayjs from 'dayjs';

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
            renderEditButtons={false}
            renderDeleteButton={false}
            dialogClassName={'omsorgstilbudDialog'}
            wrapInfoInPanel={false}
            defaultValue={{}}
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
            infoRenderer={({ data, onEdit }) => {
                const omsorgsdager: OmsorgstilbudDag[] = [];
                Object.keys(data || {}).forEach((isoDateString) => {
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
                const tittelId = `mndTittel_${dayjs(fraDato).format('MM_YYYY')}`;
                return (
                    <>
                        <OmsorgstilbudInfo
                            omsorgsdager={omsorgsdager}
                            fraDato={fraDato}
                            tilDato={tilDato}
                            skjulTommeDagerIListe={skjulTommeDagerIListe}
                            tittelRenderer={(fraDato) => (
                                <Undertittel tag="h3" id={tittelId}>
                                    Omsorgstilbud {dayjs(fraDato).format('MMMM YYYY')}
                                </Undertittel>
                            )}
                        />
                        <FormBlock margin="l">
                            <Knapp
                                htmlType="button"
                                mini={true}
                                onClick={() => onEdit(data)}
                                aria-describedby={tittelId}>
                                {omsorgsdager.length === 0 ? 'Registrer tid' : 'Endre tid'}
                            </Knapp>
                        </FormBlock>
                    </>
                );
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudInfoAndDialog;
