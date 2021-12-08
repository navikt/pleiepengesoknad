import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents, InputTime } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import { Tid } from '../../types';
import { ensureTime } from '../../utils/common/inputTimeUtils';
import dateFormatter from '../../utils/common/dateFormatterUtils';

interface Props {
    dato: Date;
    tid?: Partial<InputTime>;
    onSubmit: (tid: Tid) => void;
    onCancel: () => void;
}

enum FormFields {
    'tid' = 'tid',
}

interface FormValues {
    [FormFields.tid]: Partial<InputTime>;
}

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const bem = bemUtils('omsorgstilbudEnkeltdagEdit');

const OmsorgstilbudEnkeltdagForm: React.FunctionComponent<Props> = ({ dato, tid, onSubmit, onCancel }) => {
    const intl = useIntl();
    const erHistorisk = dayjs(dato).isBefore(dateToday, 'day');
    const onValidSubmit = (value: FormValues) => {
        onSubmit({ varighet: ensureTime(value.tid) });
    };
    return (
        <div>
            <Undertittel tag="h1" className={bem.element('tittel')}>
                Tid i omsorgstilbud {dateFormatter.full(dato)}
            </Undertittel>
            <FormBlock margin="l">
                <FormComponents.FormikWrapper
                    initialValues={{
                        tid,
                    }}
                    onSubmit={onValidSubmit}
                    renderForm={() => {
                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(intl, 'omsorgstilbudEnkeltdag')}
                                includeValidationSummary={false}
                                includeButtons={true}
                                submitButtonLabel="Lagre"
                                cancelButtonLabel="Avbryt">
                                <FormComponents.TimeInput
                                    name={FormFields.tid}
                                    label={`Hvor mye ${
                                        erHistorisk ? 'var barnet' : 'skal barnet være'
                                    } i omsorgstilbud ${dateFormatter.extended(dato)}?`}
                                    validate={getTimeValidator({ max: { hours: 7, minutes: 30 } })}
                                    timeInputLayout={{ justifyContent: 'left', compact: false, direction: 'vertical' }}
                                />
                            </FormComponents.Form>
                        );
                    }}
                />
            </FormBlock>
        </div>
    );
};

export default OmsorgstilbudEnkeltdagForm;
