import moment from 'moment';
moment().format();

export const isEndDateInPeriod = (periodeFra?: string, frilans_slutdato?: string): boolean => {
    if (periodeFra && frilans_slutdato) {
        return moment(periodeFra).isValid() && moment(frilans_slutdato).isValid()
            ? moment(frilans_slutdato) >= moment(periodeFra)
            : false;
    }
    return false;
};
