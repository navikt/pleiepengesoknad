import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import TidKalenderForm from '../../../components/tid-kalender-form/TidKalenderForm';
import { DatoTidMap } from '../../../types';
import { getTidIOmsorgValidator } from '../../../validation/validateOmsorgstilbudFields';
import OmsorgstilbudMånedInfo from './OmsorgstilbudMånedInfo';
import { getDagerMedTidITidsrom } from '../../../utils/datoTidUtils';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { useFormikContext } from 'formik';
import { getDatesInMonthOutsideDateRange, getMonthsInDateRange } from '../../../utils/common/dateRangeUtils';
import { OmsorgstilbudEnkeltdagEndring } from '../../../pre-common/omsorgstilbud-enkeltdag/OmsorgstilbudEnkeltdagForm';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    formFieldName: FieldNames;
    labels: ModalFormAndInfoLabels;
    måned: DateRange;
    periode: DateRange;
    søknadsdato: Date;
    kanLeggeTilPeriode: boolean;
    onAfterChange?: (omsorgsdager: DatoTidMap) => void;
}

function OmsorgstilbudMåned<FieldNames>({
    formFieldName,
    periode,
    labels,
    søknadsdato,
    måned,
    kanLeggeTilPeriode,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const intl = useIntl();
    const erHistorisk = dayjs(periode.to).isBefore(søknadsdato, 'day');
    const { setFieldValue } = useFormikContext<SøknadFormData>() || {};
    const antallMåneder = getMonthsInDateRange(periode).length;
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
                    <TidKalenderForm
                        periode={måned}
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
                                </p>
                                <p>
                                    <FormattedMessage id="omsorgstilbud.form.intro.2" />
                                </p>
                                <ExpandableInfo title={intlHelper(intl, 'omsorgstilbud.flereBarn.tittel')}>
                                    <p>
                                        <FormattedMessage id={'omsorgstilbud.flereBarn'} />
                                    </p>
                                </ExpandableInfo>
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
                const utilgjengeligeDatoer = getDatesInMonthOutsideDateRange(måned.from, periode);

                const handleOnEnkeltdagChange = (evt: OmsorgstilbudEnkeltdagEndring) => {
                    const newValues = { ...omsorgsdager, ...evt.dagerMedTid };
                    setFieldValue(formFieldName as any, newValues);
                    onAfterChange ? onAfterChange(newValues) : undefined;
                };

                return (
                    <OmsorgstilbudMånedInfo
                        måned={måned}
                        periode={periode}
                        tidOmsorgstilbud={omsorgsdager}
                        utilgjengeligeDatoer={utilgjengeligeDatoer}
                        åpentEkspanderbartPanel={antallMåneder === 1 || kanLeggeTilPeriode === false}
                        onRequestEdit={onEdit}
                        editLabel={labels.editLabel}
                        addLabel={labels.addLabel}
                        onEnkeltdagChange={handleOnEnkeltdagChange}
                    />
                );
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudMåned;
