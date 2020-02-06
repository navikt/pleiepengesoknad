import React from 'react';
import { ApiStringDate } from 'common/types/ApiStringDate';
import { prettifyDate, apiStringDateToDate } from 'common/utils/dateUtils';

interface Props {
    apiDato: ApiStringDate;
}

const DatoSvar: React.FunctionComponent<Props> = ({ apiDato }) => <>{prettifyDate(apiStringDateToDate(apiDato))}</>;

export default DatoSvar;
