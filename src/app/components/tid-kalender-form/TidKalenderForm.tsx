import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents, InputTime } from '@navikt/sif-common-formik/lib';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import Knapp from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { DatoTidMap, ISODate } from '../../types';
import { cleanupDatoTidMap } from '../../utils/datoTidUtils';
import { TidPerDagValidator } from '../../validation/fieldValidations';
import TidUkerInput from '../tid-uker-input/TidUkerInput';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

type FormDatoTidMap = { [isoDate: ISODate]: Partial<InputTime> };

interface Props {
    tittel: JSX.Element;
    intro?: JSX.Element;
    periode: DateRange;
    tid: DatoTidMap;
    tidPerDagValidator: TidPerDagValidator;
    onSubmit: (tid: DatoTidMap) => void;
    onCancel?: () => void;
}

enum FormField {
    tid = 'tid',
}
interface FormValues {
    [FormField.tid]: FormDatoTidMap;
}

const Form = getTypedFormComponents<FormField, FormValues, ValidationError>();

const TidKalenderForm = ({ periode, tid, tittel, intro, tidPerDagValidator, onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    if (dayjs(periode.from).isAfter(periode.to, 'day')) {
        return <div>Fra dato er før til-dato</div>;
    }

    const onFormikSubmit = ({ tid = {} }: Partial<FormValues>) => {
        const data: DatoTidMap = {};
        Object.keys(tid).forEach((key) => {
            const value = tid[key];
            data[key] = {
                tid: value,
            };
        });
        onSubmit(cleanupDatoTidMap(data));
    };

    const mapDatoTidToFormDatoTid = (tid: DatoTidMap): FormDatoTidMap => {
        const data: FormDatoTidMap = {};
        Object.keys(tid).forEach((key) => {
            const value = tid[key];
            data[key] = value.tid;
        });
        return data;
    };

    return (
        <Normaltekst tag="div">
            <Form.FormikWrapper
                initialValues={{ tid: mapDatoTidToFormDatoTid(tid) }}
                onSubmit={onFormikSubmit}
                renderForm={() => {
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            formErrorHandler={getFormErrorHandler(intl, 'tidsperiodeForm')}
                            includeValidationSummary={true}
                            includeButtons={false}
                            formFooter={
                                <FormBlock margin="l">
                                    <Knapperad align="left">
                                        <Knapp htmlType="submit" type="hoved">
                                            <FormattedMessage id="tidKalenderForm.ok.label" />
                                        </Knapp>
                                        <Knapp htmlType="button" type="standard" onClick={onCancel}>
                                            <FormattedMessage id="tidKalenderForm.avbryt.label" />
                                        </Knapp>
                                    </Knapperad>
                                </FormBlock>
                            }>
                            <Systemtittel tag="h1">{tittel}</Systemtittel>
                            {intro ? <Box margin="l">{intro}</Box> : undefined}
                            <ResponsivePanel>
                                <TidUkerInput
                                    fieldName={FormField.tid}
                                    periode={periode}
                                    brukPanel={false}
                                    tidPerDagValidator={tidPerDagValidator}
                                />
                            </ResponsivePanel>
                        </Form.Form>
                    );
                }}
            />
        </Normaltekst>
    );
};

export default TidKalenderForm;
