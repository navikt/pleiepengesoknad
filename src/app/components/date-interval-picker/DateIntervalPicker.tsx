import * as React from 'react';
import { Fieldset } from 'nav-frontend-skjema';
import { FormikDatepickerProps } from '../formik-datepicker/FormikDatepicker';
import { Field } from '../../types/PleiepengesøknadFormData';
import Datepicker from '../datepicker/Datepicker';
import bemHelper from '../../utils/bemUtils';
import './dateIntervalPicker.less';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';

interface DateIntervalPickerProps {
    legend: string;
    fromDatepickerProps: FormikDatepickerProps<Field>;
    toDatepickerProps: FormikDatepickerProps<Field>;
    helperText?: string;
}

const bem = bemHelper('dateIntervalPicker');
const DateIntervalPicker: React.FunctionComponent<DateIntervalPickerProps> = ({
    legend,
    fromDatepickerProps,
    toDatepickerProps,
    helperText
}) => {
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
                <Datepicker {...fromDatepickerProps} />
                <Datepicker {...toDatepickerProps} />
            </div>
        </Fieldset>
    );
};

export default DateIntervalPicker;
