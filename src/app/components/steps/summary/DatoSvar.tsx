import React from 'react';
import { ApiStringDate } from '@sif-common/core/types/ApiStringDate';
import { apiStringDateToDate, prettifyDate } from '@sif-common/core/utils/dateUtils';

interface Props {
    apiDato: ApiStringDate;
}
export const prettifyApiDate = (apiDato: ApiStringDate): string => prettifyDate(apiStringDateToDate(apiDato));

const DatoSvar = ({ apiDato }: Props) => <>{prettifyApiDate(apiDato)}</>;

export default DatoSvar;
