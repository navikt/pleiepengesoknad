import moment from 'moment';

const dateIsWithinRange = (date: Date, minDate: Date, maxDate: Date) => {
    return moment(date).isBetween(minDate, maxDate, 'day', '[]');
};

const validateDateInRange = (date: Date | undefined, minDate: Date, maxDate: Date) => {
    if (date === undefined) {
        return {
            key: 'ferieuttak.form.validation.required'
        };
    }
    if (!dateIsWithinRange(date, minDate, maxDate)) {
        return {
            key: 'ferieuttak.form.validation.dateOutsideRange'
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
            key: 'ferieuttak.form.validation.fromDateAfterToDate'
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
            key: 'ferieuttak.form.validation.toDateBeforeFromDate'
        };
    }
    return undefined;
};

const ferieuttakFormValidation = {
    validateFromDate,
    validateToDate
};

export default ferieuttakFormValidation;
