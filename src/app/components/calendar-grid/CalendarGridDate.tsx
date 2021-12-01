import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import React from 'react';
import dateFormatter from '../../utils/dateFormatterUtils';
import { dateToISODate } from '../../utils/dateUtils';

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
