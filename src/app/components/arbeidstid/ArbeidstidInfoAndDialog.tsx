import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import Knapp from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { TidsbrukDag } from '../../types';
import { getDagerMedTidITidsrom } from '../../utils/tidsbrukUtils';
import TidsbrukKalender from '../tidsbruk-kalender/TidsbrukKalender';
import TidKalenderForm from '../tid-kalender-form/TidKalenderForm';
import { getArbeidstimerDatoValidator } from '../../validation/fieldValidations';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    periode: DateRange;
}

function ArbeidstidInfoAndDialog<FieldNames>({ name, periode, labels, validate }: Props<FieldNames>) {
    const gjelderFortid = dayjs(periode.to).isBefore(dateToday, 'day');
    return (
        <FormikModalFormAndInfo<FieldNames, TidsbrukDag, ValidationError>
            name={name}
            validate={validate}
            labels={labels}
            renderEditButtons={false}
            renderDeleteButton={false}
            dialogClassName={'calendarDialog'}
            wrapInfoInPanel={false}
            defaultValue={{}}
            formRenderer={({ onSubmit, onCancel, data = {} }) => {
                return (
                    <TidKalenderForm
                        periode={periode}
                        tid={data}
                        tittel={
                            <FormattedMessage
                                id="omsorgstilbud.form.tittel"
                                values={{ måned: dayjs(periode.from).format('MMMM YYYY') }}
                            />
                        }
                        intro={
                            <>
                                <p>
                                    <FormattedMessage
                                        id={
                                            gjelderFortid
                                                ? 'omsorgstilbud.form.intro_fortid.1'
                                                : 'omsorgstilbud.form.intro.1'
                                        }
                                    />
                                </p>
                                <p>
                                    <strong>
                                        <FormattedMessage id="omsorgstilbud.form.intro.2" />
                                    </strong>
                                </p>
                            </>
                        }
                        tidPerDagValidator={getArbeidstimerDatoValidator}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data, onEdit }) => {
                const dager = getDagerMedTidITidsrom(data, periode);
                const tittelId = `mndTittel_${dayjs(periode.from).format('MM_YYYY')}`;
                const måned = dager.length > 0 ? dager[0].dato : periode.from;
                const mndOgÅr = dayjs(måned).format('MMMM YYYY');
                return (
                    <>
                        <Undertittel tag="h3">
                            <FormattedMessage id="arbeidIPeriode.periodetittel" values={{ periode: mndOgÅr }} />
                        </Undertittel>
                        <TidsbrukKalender
                            måned={måned}
                            periode={periode}
                            dager={dager}
                            visSomListe={false}
                            skjulTommeDagerIListe={true}
                        />
                        <FormBlock margin="l">
                            <Knapp
                                htmlType="button"
                                mini={true}
                                onClick={() => onEdit(data)}
                                aria-describedby={tittelId}>
                                {labels.addLabel}
                                {/* <FormattedMessage id="arbeidstid.registrerTid.knapp" values={{ periode: mndOgÅr }} /> */}
                            </Knapp>
                        </FormBlock>
                    </>
                );
            }}
        />
    );
}

export default ArbeidstidInfoAndDialog;
