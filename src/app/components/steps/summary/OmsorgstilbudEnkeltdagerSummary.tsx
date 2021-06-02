import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, ISOStringToDate, Time } from '@navikt/sif-common-formik/lib';
import OmsorgstilbudCalendar from '@navikt/sif-common-forms/lib/omsorgstilbud/OmsorgstilbudCalendar';
import { OmsorgstilbudDag } from '@navikt/sif-common-forms/lib/omsorgstilbud/types';
import dayjs from 'dayjs';
import groupBy from 'lodash.groupby';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { OmsorgstilbudDagApi } from '../../../types/PleiepengesøknadApiData';

interface Props {
    dager: OmsorgstilbudDagApi[];
}

const OmsorgstilbudEnkeltdagerSummary: React.FunctionComponent<Props> = ({ dager }) => {
    const days: OmsorgstilbudDag[] = [];
    dager.forEach((dag) => {
        const dato = ISOStringToDate(dag.dato);
        const tid = iso8601DurationToTime(dag.tid);
        if (dato && tid) {
            days.push({ dato, tid: tid as any });
        }
    });
    const months = groupBy(days, ({ dato }) => `${dato.getFullYear()}.${dato.getMonth()}`);
    return (
        <div>
            {Object.keys(months).map((key) => {
                const days = months[key];
                const dateRange: DateRange = { from: days[0].dato, to: days[days.length - 1].dato };

                return (
                    <Box margin="m" key={key}>
                        <EkspanderbartPanel
                            className={'ekspanderbartPanel--omsorgstilbud'}
                            tittel={
                                <span style={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                                    {dayjs(days[0].date).format('MMMM YYYY')}
                                </span>
                            }>
                            <OmsorgstilbudCalendar
                                måned={dateRange.from}
                                fraDato={dateRange.from}
                                tilDato={dateRange.to}
                                omsorgsdager={days}
                            />
                        </EkspanderbartPanel>
                    </Box>
                );
            })}
        </div>
    );
};

export default OmsorgstilbudEnkeltdagerSummary;
