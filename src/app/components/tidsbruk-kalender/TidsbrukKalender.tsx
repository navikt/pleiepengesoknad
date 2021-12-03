import React from 'react';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

import CalendarGrid from '../calendar-grid/CalendarGrid';
import TidsbrukKalenderDag, { TidsbrukKalenderDagFooterRenderer } from './TidsbrukKalenderDag';
import { dateToISODate } from '../../utils/dateUtils';
import { DatoTidMap } from '../../types';
import { ensureTime } from '../../utils/timeUtils';

export type TidRenderer = (tid: { tid: InputTime; dato: Date; prosent?: number }) => React.ReactNode;

type KalenderDag = {
    tid?: Partial<InputTime>;
    prosent?: number;
    tidOpprinnelig?: InputTime;
};

type Kalenderdager = {
    [dato: string]: KalenderDag;
};
interface Props {
    periode: DateRange;
    dager: DatoTidMap;
    dagerOpprinnelig?: DatoTidMap;
    utilgjengeligeDatoer?: Date[];
    utilgjengeligDagInfo?: string;
    skjulTommeDagerIListe?: boolean;
    visEndringsinformasjon?: boolean;
    onDateClick?: (date: Date) => void;
    tomUkeContentRenderer?: () => React.ReactNode;
    tidRenderer?: TidRenderer;
    footerRenderer?: TidsbrukKalenderDagFooterRenderer;
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
    footerRenderer,
}) => {
    const kalenderdager: Kalenderdager = {};
    Object.keys(dagerMedTid).forEach((key) => {
        kalenderdager[key] = {
            ...kalenderdager[key],
            tid: dagerMedTid[key].tid,
            prosent: dagerMedTid[key].prosent,
        };
    });
    Object.keys(dagerOpprinnelig).forEach((key) => {
        kalenderdager[key] = {
            ...kalenderdager[key],
            tidOpprinnelig: dagerOpprinnelig[key],
            prosent: dagerOpprinnelig[key].prosent,
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
                        tid={dag.tid ? ensureTime(dag.tid) : undefined}
                        prosent={dag.prosent}
                        tidRenderer={tidRenderer}
                        tidOpprinnelig={dag.tidOpprinnelig}
                        visEndringsinformasjon={visEndringsinformasjon}
                        footerRenderer={footerRenderer}
                    />
                ) : (
                    <span />
                );
            }}
        />
    );
};

export default TidsbrukKalender;
