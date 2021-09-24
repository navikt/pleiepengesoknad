import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import Knapp from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { TidEnkeltdag } from '../../types';
import { getCleanedTidIOmsorgstilbud } from '../../utils/omsorgstilbudUtils';
import TidUkerInput from '../tid-uker-input/TidUkerInput';
import { TidPerDagValidator } from '../../validation/fieldValidations';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

interface Props {
    tittel: JSX.Element;
    intro?: JSX.Element;
    periode: DateRange;
    tid: TidEnkeltdag;
    tidPerDagValidator: TidPerDagValidator;
    onSubmit: (tid: TidEnkeltdag) => void;
    onCancel?: () => void;
}

enum FormField {
    tid = 'tid',
}
interface FormValues {
    [FormField.tid]: TidEnkeltdag;
}

const Form = getTypedFormComponents<FormField, FormValues, ValidationError>();

const TidKalenderForm = ({ periode, tid, tittel, intro, tidPerDagValidator, onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    if (dayjs(periode.from).isAfter(periode.to, 'day')) {
        return <div>Fra dato er før til-dato</div>;
    }

    const onFormikSubmit = ({ tid = {} }: Partial<FormValues>) => {
        const cleanedTidIOmsorg = getCleanedTidIOmsorgstilbud(tid);
        onSubmit(cleanedTidIOmsorg);
    };

    return (
        <Normaltekst tag="div">
            <Form.FormikWrapper
                initialValues={{ tid }}
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
                                            <FormattedMessage id="omsorgstilbud.form.knapp.ok" />
                                        </Knapp>
                                        <Knapp htmlType="button" type="standard" onClick={onCancel}>
                                            <FormattedMessage id="omsorgstilbud.form.knapp.avbryt" />
                                        </Knapp>
                                    </Knapperad>
                                </FormBlock>
                            }>
                            <Systemtittel tag="h1">{tittel}</Systemtittel>
                            {intro ? <Box margin="l">{intro}</Box> : undefined}
                            <TidUkerInput
                                fieldName={FormField.tid}
                                periode={periode}
                                tidPerDagValidator={tidPerDagValidator}
                            />
                        </Form.Form>
                    );
                }}
            />
        </Normaltekst>
    );
};

export default TidKalenderForm;
