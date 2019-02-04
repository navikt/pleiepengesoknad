import * as moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
export const formatDate = (date: Date) => moment(date).format(dateFormat);
