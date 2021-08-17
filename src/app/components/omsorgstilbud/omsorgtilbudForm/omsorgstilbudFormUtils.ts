import React from 'react';
import { dateToISOString, Time } from '@navikt/sif-common-formik/lib';
import { TimeInputLayoutProps } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import dayjs from 'dayjs';
import groupBy from 'lodash.groupby';
import { Daginfo, Ukeinfo } from '../types';

const getEmptyElements = (num: number): JSX.Element[] | undefined => {
    return num === 0
        ? undefined
        : Array.from({ length: num }).map((_, index) => React.createElement('span', { key: index }));
};

const getUker = (dager: Daginfo[]): Ukeinfo[] => {
    const ukerOgDager = groupBy(dager, (dag) => dag.årOgUke);
    const uker = Object.keys(ukerOgDager).map((key): Ukeinfo => {
        const dagerIUke = ukerOgDager[key];
        return { år: dagerIUke[0].år, ukenummer: dagerIUke[0].ukenummer, dager: dagerIUke };
    });
    return uker;
};

const getTimeInputLayout = (isNarrow: boolean, isWide: boolean): TimeInputLayoutProps => ({
    justifyContent: 'right',
    direction: isNarrow || isWide ? 'vertical' : 'horizontal',
});

const getTidIOmsorgValidator = (dag: Daginfo) => (tid: Time) => {
    const error = getTimeValidator({
        required: false,
        max: { hours: 7, minutes: 30 },
    })(tid);
    return error
        ? {
              key: `omsorgstilbud.validation.${error}`,
              values: {
                  dag: dag.labelFull,
                  maksTimer: 7,
              },
              keepKeyUnaltered: true,
          }
        : undefined;
};

const getOmsorgstilbudTidFieldName = (fieldName: string, dag: Daginfo): string => `${fieldName}.${dag.isoDateString}`;

const getDagInfo = (date: Date): Daginfo => {
    const dayjsDato = dayjs(date);
    return {
        isoDateString: dateToISOString(dayjsDato.toDate()),
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

const getDatoerForOmsorgstilbudPeriode = (from: Date, to: Date): Daginfo[] => {
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

const getForegåendeDagerIUke = (dag: Daginfo): Daginfo[] => {
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

const omsorgstilbudFormUtils = {
    getEmptyElements,
    getUker,
    getDagInfo,
    getDatoerForOmsorgstilbudPeriode,
    getTidIOmsorgValidator,
    getOmsorgstilbudTidFieldName,
    getTimeInputLayout,
    getForegåendeDagerIUke,
};

export default omsorgstilbudFormUtils;
