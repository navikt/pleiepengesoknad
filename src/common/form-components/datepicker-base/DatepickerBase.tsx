import * as React from 'react';
import NAVDatepicker from 'nav-datovelger/dist/datovelger/Datovelger';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import { guid } from 'nav-frontend-js-utils';
import { SkjemaelementFeil as ValidationError } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { DatovelgerAvgrensninger } from 'nav-datovelger';
import { dateToISOFormattedDateString } from 'common/utils/dateUtils';
import useMedia from 'use-media';

import './datepickerBase.less';

const placeholder = 'dd.mm.åååå';

interface DateRange {
    fom: Date;
    tom: Date;
}

export interface DateLimitiations {
    minDato?: Date;
    maksDato?: Date;
    ugyldigeTidsperioder?: DateRange[];
    helgedagerIkkeTillatt?: boolean;
}

interface DatepickerBaseProps {
    label: string;
    name: string;
    id: string;
    feil?: ValidationError;
    onChange: (date: Date | undefined) => void;
    value?: Date;
    dateLimitations?: DateLimitiations;
    fullScreenOnMobile?: boolean;
}

const parseDateLimitations = (dateLimitations: DateLimitiations): DatovelgerAvgrensninger => {
    return {
        maksDato: dateToISOFormattedDateString(dateLimitations.maksDato),
        minDato: dateToISOFormattedDateString(dateLimitations.minDato),
        helgedagerIkkeTillatt: dateLimitations.helgedagerIkkeTillatt,
        ugyldigeTidsperioder:
            dateLimitations.ugyldigeTidsperioder &&
            dateLimitations.ugyldigeTidsperioder.map((t: { fom: Date; tom: Date }) => ({
                fom: dateToISOFormattedDateString(t.fom)!,
                tom: dateToISOFormattedDateString(t.tom)!
            }))
    };
};

const DatepickerBase: React.FunctionComponent<DatepickerBaseProps> = ({
    label,
    id,
    feil,
    name,
    value,
    onChange,
    fullScreenOnMobile = true,
    dateLimitations,
    ...otherProps
}) => {
    const isWide = useMedia({ minWidth: 736 });
    const elementId = id || guid();
    return (
        <CustomInputElement label={label} labelId={elementId} validationError={feil}>
            <NAVDatepicker
                input={{ name, placeholder, id: elementId }}
                id={elementId}
                valgtDato={dateToISOFormattedDateString(value)}
                avgrensninger={dateLimitations ? parseDateLimitations(dateLimitations) : undefined}
                {...otherProps}
                kalender={{ plassering: fullScreenOnMobile && isWide === false ? 'fullskjerm' : undefined }}
                onChange={(dateString: string) => {
                    const newDate = dateString && dateString !== 'Invalid date' ? new Date(dateString) : undefined;
                    if (value !== newDate) {
                        onChange(newDate);
                    }
                }}
            />
        </CustomInputElement>
    );
};

export default DatepickerBase;
