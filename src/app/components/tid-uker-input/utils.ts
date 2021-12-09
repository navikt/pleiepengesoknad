import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import React from 'react';
import { Daginfo, Ukeinfo } from './types';

const getEmptyElements = (num: number): JSX.Element[] | undefined => {
    return num === 0
        ? undefined
        : Array.from({ length: num }).map((_, index) => React.createElement('span', { key: index }));
};

export const getDagInfo = (date: Date): Daginfo => {
    const dayjsDato = dayjs(date);
    return {
        isoDate: dateToISOString(dayjsDato.toDate()),
        dato: dayjsDato.toDate(),
        ukedag: dayjsDato.isoWeekday(),
        ukenummer: dayjsDato.isoWeek(),
        år: dayjsDato.year(),
        årOgUke: `${dayjsDato.year()}.${dayjsDato.isoWeek()}`,
        labelDag: `${dayjsDato.format('dddd')}`,
        labelDato: `${dayjsDato.format('DD.MM.YYYY')}`,
        labelFull: `${dayjsDato.format('dddd')} ${dayjsDato.format('D. MMMM')}`,
    };
};

export const getDagInfoForPeriode = ({ from, to }: DateRange): Daginfo[] => {
    const dager: Daginfo[] = [];
    let dayjsDato = dayjs(from);
    while (dayjsDato.isSameOrBefore(to, 'day')) {
        const ukedag = dayjsDato.isoWeekday();
        if (ukedag <= 5) {
            dager.push(getDagInfo(dayjsDato.toDate()));
        }
        dayjsDato = dayjsDato.add(1, 'day');
    }
    return dager;
};

export const getUkerFraDager = (dager: Daginfo[]): Ukeinfo[] => {
    const ukerOgDager = groupBy(dager, (dag) => dag.årOgUke);
    const uker = Object.keys(ukerOgDager).map((key): Ukeinfo => {
        const dagerIUke = ukerOgDager[key];
        return { år: dagerIUke[0].år, ukenummer: dagerIUke[0].ukenummer, dager: dagerIUke };
    });
    return uker;
};

export const getTidKalenderFieldName = (fieldName: string, dag: Daginfo): string => `${fieldName}.${dag.isoDate}`;

export const getForegåendeDagerIUke = (dag: Daginfo): Daginfo[] => {
    const dager = getEmptyElements(dag.ukedag - 1);
    if (dager && dager.length > 0) {
        const firstDayOfWeek = dayjs(dag.dato).subtract(dag.ukedag - 1, 'days');
        return dager.map((c, idx) => {
            const date = firstDayOfWeek.add(idx, 'days').toDate();
            return getDagInfo(date);
        });
    }
    return [];
};
