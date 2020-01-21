import * as React from 'react';
import { Fieldset } from 'nav-frontend-skjema';
import { FormikDatepickerProps, NewFormikDatepicker } from '../formik-datepicker/FormikDatepicker';
import bemHelper from 'common/utils/bemUtils';
import HelperTextButton from 'common/components/helper-text-button/HelperTextButton';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';

import './dateIntervalPicker.less';

interface DateIntervalPickerProps<FormFields> {
    legend: string;
    fromDatepickerProps: FormikDatepickerProps<FormFields>;
    toDatepickerProps: FormikDatepickerProps<FormFields>;
    helperText?: string;
}

const bem = bemHelper('dateIntervalPicker');

function DateIntervalPicker<FormFields>({
    legend,
    fromDatepickerProps,
    toDatepickerProps,
    helperText
}: DateIntervalPickerProps<FormFields>) {
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
                <NewFormikDatepicker<FormFields> {...fromDatepickerProps} />
                <NewFormikDatepicker<FormFields> {...toDatepickerProps} />
            </div>
        </Fieldset>
    );
}

export default DateIntervalPicker;
