import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToISODate } from '@navikt/sif-common-utils';
import dateFormatter from '../../utils/common/dateFormatterUtils';

interface Props {
    date: Date;

    dateRendererShort?: (date: Date) => React.ReactNode;
    dateRendererFull?: (date: Date) => React.ReactNode;
}

const bem = bemUtils('calendarGrid');

const CalendarGridDate: React.FunctionComponent<Props> = ({
    date,

    dateRendererShort = dateFormatter.short,
    dateRendererFull = dateFormatter.dayDateAndMonth,
}) => {
    const id = `${dateToISODate(date)}_date`;

    const content = (
        <>
            <span className={bem.classNames(bem.element('date__full'))}>
                <span>{dateRendererFull(date)}</span>
            </span>
            <span className={bem.element('date__short')} id={id}>
                {dateRendererShort(date)}
            </span>
        </>
    );

    return <span className={bem.element('date')}>{content}</span>;
};
export default CalendarGridDate;
