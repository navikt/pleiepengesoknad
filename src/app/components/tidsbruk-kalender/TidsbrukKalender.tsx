import React from 'react';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

import CalendarGrid from '../calendar-grid/CalendarGrid';
import TidsbrukKalenderDag from './TidsbrukKalenderDag';
import { dateToISODate } from '../../utils/dateUtils';
import { DagMedTid } from '../../types';

export type TidRenderer = (tid: InputTime, dato: Date) => React.ReactNode;

type KalenderDag = {
    tid?: InputTime;
    tidOpprinnelig?: InputTime;
};

type Kalenderdager = {
    [dato: string]: KalenderDag;
};
interface Props {
    periode: DateRange;
    dager: DagMedTid[];
    dagerOpprinnelig?: DagMedTid[];
    utilgjengeligeDatoer?: Date[];
    utilgjengeligDagInfo?: string;
    skjulTommeDagerIListe?: boolean;
    visEndringsinformasjon?: boolean;
    onDateClick?: (date: Date) => void;
    tomUkeContentRenderer?: () => React.ReactNode;
    tidRenderer?: TidRenderer;
}

const TidsbrukKalender: React.FunctionComponent<Props> = ({
    periode,
    dager: dagerMedTid,
    dagerOpprinnelig = [],
    utilgjengeligeDatoer,
    utilgjengeligDagInfo,
    skjulTommeDagerIListe,
    visEndringsinformasjon,
    onDateClick,
    tidRenderer,
    tomUkeContentRenderer,
}) => {
    const kalenderdager: Kalenderdager = {};
    dagerMedTid.forEach((d) => {
        const datostring = dateToISODate(d.dato);
        kalenderdager[datostring] = {
            ...kalenderdager[datostring],
            tid: d.tid,
        };
    });
    dagerOpprinnelig.forEach((d) => {
        const datostring = dateToISODate(d.dato);
        kalenderdager[datostring] = {
            ...kalenderdager[datostring],
            tidOpprinnelig: d.tid,
        };
    });

    return (
        <CalendarGrid
            month={periode}
            disabledDates={utilgjengeligeDatoer}
            disabledDateInfo={utilgjengeligDagInfo}
            hideEmptyContentInListMode={skjulTommeDagerIListe}
            hideWeeksWithOnlyDisabledContent={true}
            onDateClick={onDateClick}
            allDaysInWeekDisabledContentRenderer={tomUkeContentRenderer}
            dateRendererShort={(date: Date) => (
                <AriaAlternative
                    visibleText={dayjs(date).format('D.')}
                    ariaText={dayjs(date).format('dddd DD. MMM YYYY')}
                />
            )}
            dateContentRenderer={(dato) => {
                const dag = kalenderdager[dateToISODate(dato)];
                return dag ? (
                    <TidsbrukKalenderDag
                        dato={dato}
                        tid={dag.tid}
                        tidRenderer={tidRenderer}
                        tidOpprinnelig={dag.tidOpprinnelig}
                        visEndringsinformasjon={visEndringsinformasjon}
                    />
                ) : (
                    <span />
                );
            }}
        />
    );
};

export default TidsbrukKalender;
