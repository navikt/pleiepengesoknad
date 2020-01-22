import moment from 'moment';
import { hasValue } from 'common/validation/hasValue';

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
            key: 'utenlandsopphold.form.validation.dateOutsideRange'
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

const validateCountry = (country: string) => {
    if (country) {
        return undefined;
    }
    return {
        key: 'utenlandsopphold.form.validation.required'
    };
};

const validateReason = (reason: string) => {
    if (!hasValue(reason)) {
        return {
            key: 'utenlandsopphold.form.validation.required'
        };
    } else if (reason.length > 250) {
        return {
            key: 'utenlandsopphold.form.validation.reasonOver250'
        };
    } else if (reason.length < 5) {
        return {
            key: 'utenlandsopphold.form.validation.reasonUnder5'
        };
    }
    return undefined;
};

const utenlandsoppholdFormValidation = {
    validateCountry,
    validateFromDate,
    validateToDate,
    validateReason
};

export default utenlandsoppholdFormValidation;
