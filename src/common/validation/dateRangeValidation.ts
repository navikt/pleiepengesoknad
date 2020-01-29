import moment from 'moment';
import { prettifyDateExtended } from 'common/utils/dateUtils';

const dateIsWithinRange = (date: Date, minDate: Date, maxDate: Date) => {
    return moment(date).isBetween(minDate, maxDate, 'day', '[]');
};

const validateDateInRange = (date: Date | undefined, minDate: Date, maxDate: Date) => {
    if (date === undefined) {
        return {
            key: 'utenlandsopphold.form.validation.required'
        };
    }
    if (!dateIsWithinRange(date, minDate, maxDate)) {
        return {
            key: 'utenlandsopphold.form.validation.dateOutsideRange',
            values: {
                fom: prettifyDateExtended(minDate),
                tom: prettifyDateExtended(maxDate)
            }
        };
    }
    return undefined;
};

const validateFromDate = (date: Date | undefined, minDate: Date, maxDate: Date, toDate?: Date) => {
    const error = validateDateInRange(date, minDate, maxDate);
    if (error !== undefined) {
        return error;
    }
    if (toDate && moment(date).isAfter(toDate, 'day')) {
        return {
            key: 'utenlandsopphold.form.validation.fromDateAfterToDate'
        };
    }
    return undefined;
};

const validateToDate = (date: Date | undefined, minDate: Date, maxDate: Date, fromDate?: Date) => {
    const error = validateDateInRange(date, minDate, maxDate);
    if (error !== undefined) {
        return error;
    }
    if (fromDate && moment(date).isBefore(fromDate, 'day')) {
        return {
            key: 'utenlandsopphold.form.validation.toDateBeforeFromDate'
        };
    }
    return undefined;
};

const dateRangeValidation = {
    validateToDate,
    validateFromDate
};

export default dateRangeValidation;
