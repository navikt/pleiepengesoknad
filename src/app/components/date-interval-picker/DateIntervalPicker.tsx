import * as React from 'react';
import { Fieldset } from 'nav-frontend-skjema';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import bemHelper from 'common/utils/bemUtils';
import './dateIntervalPicker.less';
import HelperTextButton from 'common/components/helper-text-button/HelperTextButton';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import FormikDatepicker, { FormikDatepickerProps } from '../../../common/formik/formik-datepicker/FormikDatepicker';

interface DateIntervalPickerProps {
    legend: string;
    fromDatepickerProps: FormikDatepickerProps<AppFormField>;
    toDatepickerProps: FormikDatepickerProps<AppFormField>;
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
                <FormikDatepicker<AppFormField> {...fromDatepickerProps} />
                <FormikDatepicker<AppFormField> {...toDatepickerProps} />
            </div>
        </Fieldset>
    );
};

export default DateIntervalPicker;
