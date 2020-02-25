import React from 'react';
import { ApiStringDate } from 'common/types/ApiStringDate';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';

interface Props {
    apiDato: ApiStringDate;
}
export const prettifyApiDate = (apiDato: ApiStringDate): string => prettifyDate(apiStringDateToDate(apiDato));

const DatoSvar: React.FunctionComponent<Props> = ({ apiDato }) => <>{prettifyApiDate(apiDato)}</>;

export default DatoSvar;
