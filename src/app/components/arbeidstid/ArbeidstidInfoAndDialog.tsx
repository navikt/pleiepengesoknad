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
import { Element } from 'nav-frontend-typografi';
import { TidEnkeltdag } from '../../types';
import { getDagerMedTidITidsrom } from '../../utils/tidsbrukUtils';
import { getArbeidstimerDatoValidator } from '../../validation/validateArbeidFields';
import TidKalenderForm from '../tid-kalender-form/TidKalenderForm';
import TidsbrukKalender from '../tidsbruk-kalender/TidsbrukKalender';
import { ArbeidIPeriodeIntlValues } from './ArbeidIPeriodeSpørsmål';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    periode: DateRange;
    intlValues: ArbeidIPeriodeIntlValues;
}

function ArbeidstidInfoAndDialog<FieldNames>({ name, periode, labels, intlValues, validate }: Props<FieldNames>) {
    const erHistorisk = dayjs(periode.to).isBefore(dateToday, 'day');
    return (
        <FormikModalFormAndInfo<FieldNames, TidEnkeltdag, ValidationError>
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
                                id="arbeidstid.form.tittel"
                                values={{ måned: dayjs(periode.from).format('MMMM YYYY') }}
                            />
                        }
                        intro={
                            <p>
                                <FormattedMessage
                                    id={
                                        erHistorisk
                                            ? 'arbeidstid.form.intro.historisk'
                                            : 'arbeidstid.form.intro.planlagt'
                                    }
                                />
                            </p>
                        }
                        tidPerDagValidator={getArbeidstimerDatoValidator(intlValues)}
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
                        <Element tag="h3">
                            <FormattedMessage id="arbeidstid.periodetittel" values={{ periode: mndOgÅr }} />
                        </Element>
                        {dager.length === 0 ? (
                            <p style={{ marginTop: '0.5rem' }}>
                                <FormattedMessage id="arbeidstid.ingenDagerRegistrert" />
                            </p>
                        ) : (
                            <TidsbrukKalender
                                måned={måned}
                                periode={periode}
                                dager={dager}
                                visSomListe={false}
                                skjulTommeDagerIListe={true}
                            />
                        )}
                        <FormBlock margin="l">
                            <Knapp
                                htmlType="button"
                                mini={true}
                                onClick={() => onEdit(data)}
                                aria-describedby={tittelId}>
                                {labels.addLabel}
                            </Knapp>
                        </FormBlock>
                    </>
                );
            }}
        />
    );
}

export default ArbeidstidInfoAndDialog;
