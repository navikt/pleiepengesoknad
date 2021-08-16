import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMediaQuery } from 'react-responsive';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import Knapp from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { getCleanedTidIOmsorgstilbud } from '../../../utils/omsorgstilbudUtils';
import { Daginfo, TidIOmsorgstilbud } from '../types';
import formUtils from './omsorgstilbudFormUtils';
import OmsorgstilbudUkeForm from './OmsorgstilbudUkeForm';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import './omsorgstilbudForm.less';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

interface Props {
    fraDato: Date;
    tilDato: Date;
    tidIOmsorgstilbud: TidIOmsorgstilbud;
    onSubmit: (tidIOmsorgstilbud: TidIOmsorgstilbud) => void;
    onCancel?: () => void;
}

enum FormField {
    tidIOmsorg = 'tidIOmsorg',
}
interface FormValues {
    [FormField.tidIOmsorg]: TidIOmsorgstilbud;
}

const Form = getTypedFormComponents<FormField, FormValues, ValidationError>();

const bem = bemUtils('omsorgstilbudForm');

const OmsorgstilbudForm = ({ fraDato, tilDato, tidIOmsorgstilbud, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const isNarrow = useMediaQuery({ maxWidth: 450 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    const datoerIForm = formUtils.getDatoerForOmsorgstilbudPeriode(fraDato, tilDato);
    const gjelderFortid = dayjs(tilDato).isBefore(dateToday, 'day');

    const uker = formUtils.getUker(datoerIForm);

    if (dayjs(fraDato).isAfter(tilDato, 'day')) {
        return <div>Fra dato er før til-dato</div>;
    }

    const onFormikSubmit = ({ tidIOmsorg = {} }: Partial<FormValues>) => {
        const cleanedTidIOmsorg = getCleanedTidIOmsorgstilbud(tidIOmsorg);
        onSubmit(cleanedTidIOmsorg);
    };

    return (
        <Normaltekst tag="div" className={bem.block}>
            <Form.FormikWrapper
                initialValues={{ tidIOmsorg: tidIOmsorgstilbud }}
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
                            <Systemtittel tag="h1">
                                <FormattedMessage
                                    id="omsorgstilbud.form.tittel"
                                    values={{ måned: dayjs(fraDato).format('MMMM YYYY') }}
                                />
                            </Systemtittel>
                            <Box margin="l">
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
                            </Box>
                            <div>
                                {uker.map((week) => {
                                    return (
                                        <Box key={week.ukenummer} margin="m">
                                            <OmsorgstilbudUkeForm
                                                getFieldName={(dag: Daginfo) =>
                                                    formUtils.getOmsorgstilbudTidFieldName(FormField.tidIOmsorg, dag)
                                                }
                                                ukeinfo={week}
                                                isNarrow={isNarrow}
                                                isWide={isWide}
                                            />
                                        </Box>
                                    );
                                })}
                            </div>
                        </Form.Form>
                    );
                }}
            />
        </Normaltekst>
    );
};

export default OmsorgstilbudForm;
