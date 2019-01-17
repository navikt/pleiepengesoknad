import * as React from 'react';
import NAVDatepicker, { Props as NAVDatepickerProps } from 'nav-datovelger/dist/datovelger/Datovelger';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import { guid } from 'nav-frontend-js-utils';
import { SkjemaelementFeil as ValidationError } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';

const placeholder = 'dd.mm.åååå';

interface DatepickerBaseProps {
    label: string;
    name: string;
    id?: string;
    feil?: ValidationError;
    onChange: (date: Date) => void;
    datepickerProps?: NAVDatepickerProps;
}

const DatepickerBase: React.FunctionComponent<DatepickerBaseProps> = ({
    label,
    id,
    feil,
    name,
    datepickerProps,
    ...otherProps
}) => {
    const elementId = id || guid();
    return (
        <CustomInputElement label={label} id={elementId} validationError={feil}>
            <NAVDatepicker
                input={{ name, placeholder, id: elementId }}
                id={elementId}
                {...otherProps}
                {...datepickerProps}
            />
        </CustomInputElement>
    );
};

export default DatepickerBase;
