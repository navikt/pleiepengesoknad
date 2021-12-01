import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { groupBy } from 'lodash';
import dateFormatter from '../../utils/dateFormatterUtils';
import { getDatesInDateRange, getDatesInMonth, isDateInDates } from '../../utils/dateUtils';
import CalendarGridDate from './CalendarGridDate';
import './calendarGrid.less';

dayjs.extend(isSameOrBefore);

interface WeekToRender {
    weekNumber: number;
    dates: Date[];
}

interface Props {
    month: DateRange;
    renderAsList?: boolean;
    disabledDates?: Date[];
    disabledDateInfo?: string;
    hideEmptyContentInListMode?: boolean;
    hideWeeksWithOnlyDisabledContent?: boolean;
    onDateClick?: (date: Date) => void;
    dateContentRenderer: (date: Date, isDisabled?: boolean) => React.ReactNode;
    dateRendererShort?: (date: Date) => React.ReactNode;
    dateRendererFull?: (date: Date) => React.ReactNode;
    allDaysInWeekDisabledContentRenderer?: () => React.ReactNode;
}

const getFullWeeksForDates = (dates: Date[], month: Date): Date[] => {
    const dayOfWeek = dates[0].getUTCDay();
    const firstDateInWeek = dayjs(dates[0]).startOf('isoWeek').toDate();
    if (dayOfWeek > 0 && dayjs(firstDateInWeek).isSame(month, 'month') === false) {
        return [
            ...getDatesInDateRange({ from: firstDateInWeek, to: dayjs(dates[0]).subtract(1, 'day').toDate() }, true),
            ...dates,
        ];
    }
    return dates;
};

const getWeeks = (dates: Date[], month: Date): WeekToRender[] => {
    const datesToRender = getFullWeeksForDates(dates, month);
    const weeksAndDays = groupBy(datesToRender, (date) => `week_${dayjs(date).isoWeek()}`);
    const weeks: WeekToRender[] = [];
    Object.keys(weeksAndDays).forEach((key) => {
        const weekDates = weeksAndDays[key];
        const weekHasDatesInMonth = weekDates.some((d) => dayjs(d).isSame(month, 'month'));
        if (weekHasDatesInMonth && weekDates.length > 0) {
            weeks.push({
                weekNumber: dayjs(weekDates[0]).isoWeek(),
                dates: weekDates,
            });
        }
    });
    return weeks;
};

const bem = bemUtils('calendarGrid');

const CalendarGrid: React.FunctionComponent<Props> = ({
    month,
    disabledDates,
    disabledDateInfo,
    renderAsList,
    hideEmptyContentInListMode,
    hideWeeksWithOnlyDisabledContent,
    onDateClick,
    dateContentRenderer,
    dateRendererShort = dateFormatter.short,
    dateRendererFull = dateFormatter.dayDateAndMonth,
    allDaysInWeekDisabledContentRenderer,
}) => {
    const weeks = getWeeks(getDatesInMonth(month.from), month.from);

    const renderDate = (date: Date) => {
        const dateKey = date.toDateString();
        const dateIsDisabled = isDateInDates(date, disabledDates);
        const renderAsButton = onDateClick !== undefined && dateIsDisabled === false;

        const ComponentToUse = renderAsButton ? 'button' : 'div';

        return dayjs(date).isSame(month.from, 'month') === false ? (
            <div key={dateKey} aria-hidden={true} className={bem.classNames(bem.element('day', 'outsideMonth'))} />
        ) : (
            <ComponentToUse
                key={dateKey}
                {...(renderAsButton
                    ? {
                          onClick: (evt) => {
                              evt.stopPropagation();
                              evt.preventDefault();
                              onDateClick(date);
                          },
                          type: 'button',
                      }
                    : {})}
                title={dateIsDisabled ? disabledDateInfo : undefined}
                aria-hidden={dateIsDisabled}
                className={bem.classNames(
                    bem.child('day').block,
                    bem.child('day').modifierConditional('disabled', dateIsDisabled),
                    bem.child('day').modifierConditional('button', renderAsButton)
                )}>
                <CalendarGridDate
                    date={date}
                    dateRendererFull={dateRendererFull}
                    dateRendererShort={dateRendererShort}
                />
                <div className={bem.child('day').element('content')}>{dateContentRenderer(date, dateIsDisabled)}</div>
            </ComponentToUse>
        );
    };

    const renderWeek = (week: WeekToRender) => {
        const datesInWeek = week.dates;
        const weekNum = week.weekNumber;
        const areAllDaysInWeekDisabledOrOutsideMonth =
            datesInWeek.filter(
                (date) =>
                    isDateInDates(date, disabledDates) === true || dayjs(date).isSame(month.from, 'month') === false
            ).length === datesInWeek.length;

        if (hideWeeksWithOnlyDisabledContent && areAllDaysInWeekDisabledOrOutsideMonth) {
            return null;
        }
        return [
            <div
                key={week.weekNumber}
                aria-hidden={true}
                className={bem.element('weekNum', areAllDaysInWeekDisabledOrOutsideMonth ? 'empty' : undefined)}>
                <span className={bem.element('weekNum_label')} role="presentation" aria-hidden={true}>
                    <FormattedMessage id="Uke" /> {` `}
                </span>
                <span>
                    <span className="sr-only">Uke </span>
                    {weekNum}
                </span>
                {areAllDaysInWeekDisabledOrOutsideMonth && allDaysInWeekDisabledContentRenderer ? (
                    <div className={bem.element('allWeekDisabledContent')}>
                        {allDaysInWeekDisabledContentRenderer()}
                    </div>
                ) : undefined}
            </div>,
            datesInWeek.map(renderDate),
        ];
    };
    return (
        <div
            className={bem.classNames(
                bem.block,
                bem.modifierConditional('hideEmptyContentInListMode', hideEmptyContentInListMode),
                bem.modifier(renderAsList ? 'list' : 'grid')
            )}>
            <span aria-hidden={true} className={bem.element('dayHeader', 'week')}>
                <FormattedMessage id="Uke" />
            </span>
            <span aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Mandag" />
            </span>
            <span aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Tirsdag" />
            </span>
            <span aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Onsdag" />
            </span>
            <span aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Torsdag" />
            </span>
            <span aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Fredag" />
            </span>
            {weeks.map(renderWeek)}
        </div>
    );
};

export default CalendarGrid;
