import * as React from 'react';
import { Fieldset } from 'nav-frontend-skjema';
import { FormikDatepickerProps } from '../formik-datepicker/FormikDatepicker';
import { Field } from '../../types/PleiepengesøknadFormData';
import Datepicker from '../datepicker/Datepicker';
import bemHelper from '../../utils/bemUtils';
import './dateIntervalPicker.less';

interface DateIntervalPickerProps {
    legend: string;
    fromDatepickerProps: FormikDatepickerProps<Field>;
    toDatepickerProps: FormikDatepickerProps<Field>;
}

const bem = bemHelper('dateIntervalPicker');
const DateIntervalPicker: React.FunctionComponent<DateIntervalPickerProps> = ({
    legend,
    fromDatepickerProps,
    toDatepickerProps
}) => (
    <Fieldset legend={legend} className={bem.block}>
        <div className={bem.element('flexContainer')}>
            <Datepicker {...fromDatepickerProps} />
            <Datepicker {...toDatepickerProps} />
        </div>
    </Fieldset>
);

export default DateIntervalPicker;
