import * as React from 'react';
import { Fieldset } from 'nav-frontend-skjema';
import bemHelper from 'common/utils/bemUtils';
import HelperTextButton from 'common/components/helper-text-button/HelperTextButton';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import FormikDatepicker, { FormikDatepickerProps } from '../formik-datepicker/FormikDatepicker';

import './dateIntervalPicker.less';

interface DateIntervalPickerProps<T> {
    legend: string;
    fromDatepickerProps: FormikDatepickerProps<T>;
    toDatepickerProps: FormikDatepickerProps<T>;
    helperText?: string;
}

const bem = bemHelper('dateIntervalPicker');

function FormikDateIntervalPicker<T>({
    legend,
    fromDatepickerProps,
    toDatepickerProps,
    helperText
}: DateIntervalPickerProps<T>) {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const legendContent = helperText ? (
        <>
            {legend}
            <HelperTextButton
                onClick={() => setShowHelperText(!showHelperText)}
                ariaLabel={legend}
                ariaPressed={showHelperText}
            />
            {showHelperText && <HelperTextPanel>{helperText}</HelperTextPanel>}
        </>
    ) : (
        legend
    );

    return (
        <Fieldset legend={legendContent} className={bem.block}>
            <div className={bem.element('flexContainer')}>
                <FormikDatepicker<T> {...fromDatepickerProps} />
                <FormikDatepicker<T> {...toDatepickerProps} />
            </div>
        </Fieldset>
    );
}

export default FormikDateIntervalPicker;
