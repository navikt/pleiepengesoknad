import * as moment from 'moment';

const apiDateFormat = 'YYYY-MM-DD';
const prettyDateFormat = 'DD.MM.YYYY';

export const formatDate = (date: Date) => moment(date).format(apiDateFormat);
export const prettifyDate = (date: Date) => moment(date).format(prettyDateFormat);
