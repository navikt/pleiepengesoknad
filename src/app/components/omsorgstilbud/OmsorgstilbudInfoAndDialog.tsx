import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import Knapp from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { TidEnkeltdag } from '../../types';
import { getDagerMedTidITidsrom } from '../../utils/tidsbrukUtils';
import TidKalenderForm from '../tid-kalender-form/TidKalenderForm';
import TidsbrukKalender from '../tidsbruk-kalender/TidsbrukKalender';
import { getTidIOmsorgValidator } from '../../validation/validateOmsorgstilbudFields';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    periode: DateRange;
    søknadsdato: Date;
    skjulTommeDagerIListe?: boolean;
    onAfterChange?: (omsorgsdager: TidEnkeltdag) => void;
}

function OmsorgstilbudInfoAndDialog<FieldNames>({
    name,
    periode,
    labels,
    søknadsdato,
    skjulTommeDagerIListe,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const intl = useIntl();
    const erHistorisk = dayjs(periode.to).isBefore(søknadsdato, 'day');
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
                                id="omsorgstilbud.form.tittel"
                                values={{ måned: dayjs(periode.from).format('MMMM YYYY') }}
                            />
                        }
                        intro={
                            <>
                                <p>
                                    <FormattedMessage
                                        id={
                                            erHistorisk
                                                ? 'omsorgstilbud.form.intro_fortid.1'
                                                : 'omsorgstilbud.form.intro.1'
                                        }
                                    />
                                    <ExpandableInfo title={intlHelper(intl, 'omsorgstilbud.flereBarn.tittel')}>
                                        <p>
                                            <FormattedMessage id={'omsorgstilbud.flereBarn'} />
                                        </p>
                                    </ExpandableInfo>
                                </p>
                                <p>
                                    <strong>
                                        <FormattedMessage id="omsorgstilbud.form.intro.2" />
                                    </strong>
                                </p>
                            </>
                        }
                        tidPerDagValidator={getTidIOmsorgValidator}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data, onEdit }) => {
                const omsorgsdager = getDagerMedTidITidsrom(data, periode);
                const tittelIdForAriaDescribedBy = `mndTittel_${dayjs(periode.from).format('MM_YYYY')}`;
                const måned = omsorgsdager.length > 0 ? omsorgsdager[0].dato : periode.from;
                return (
                    <>
                        <Undertittel tag="h3" id={tittelIdForAriaDescribedBy}>
                            <FormattedMessage
                                id="omsorgstilbud.ukeOgÅr"
                                values={{ ukeOgÅr: dayjs(periode.from).format('MMMM YYYY') }}
                            />
                        </Undertittel>
                        <Box margin="s">
                            {omsorgsdager.length === 0 ? (
                                <FormattedMessage tagName="p" id="omsorgstilbud.ingenDagerRegistrert" />
                            ) : (
                                <TidsbrukKalender
                                    måned={måned}
                                    periode={periode}
                                    dager={omsorgsdager}
                                    visSomListe={false}
                                    skjulTommeDagerIListe={skjulTommeDagerIListe}
                                />
                            )}
                        </Box>
                        <FormBlock margin="l">
                            <Knapp
                                htmlType="button"
                                mini={true}
                                onClick={() => onEdit(data)}
                                aria-describedby={tittelIdForAriaDescribedBy}>
                                {omsorgsdager.length === 0 ? labels.addLabel : labels.editLabel}
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
