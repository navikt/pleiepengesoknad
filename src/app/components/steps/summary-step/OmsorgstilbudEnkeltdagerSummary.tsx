import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import groupBy from 'lodash.groupby';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { DagMedTid } from '../../../types';
import { DagMedTidApi } from '../../../types/PleiepengesøknadApiData';
import OmsorgsdagerListe from './omsorgsdagerListe/OmsorgsdagerListe';

interface Props {
    dager: DagMedTidApi[];
}

const OmsorgstilbudEnkeltdagerSummary: React.FunctionComponent<Props> = ({ dager }) => {
    const days: DagMedTid[] = [];
    dager.forEach((dag) => {
        const dato = ISOStringToDate(dag.dato);
        const tid = iso8601DurationToTime(dag.tid);
        if (dato && tid) {
            days.push({ dato, tid: tid as any });
        }
    });

    if (dager.length < 10) {
        return <OmsorgsdagerListe omsorgsdager={days} viseUke={false} />;
    }

    const months = groupBy(days, ({ dato }) => `${dato.getFullYear()}.${dato.getMonth()}`);
    return (
        <div>
            {Object.keys(months).map((key) => {
                const days = months[key];
                return (
                    <Box margin="m" key={key}>
                        <EkspanderbartPanel
                            className={'ekspanderbartPanel--omsorgstilbud'}
                            tittel={
                                <span style={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                                    {dayjs(days[0].dato).format('MMMM YYYY')}
                                </span>
                            }>
                            <OmsorgsdagerListe omsorgsdager={days} viseUke={true} />
                        </EkspanderbartPanel>
                    </Box>
                );
            })}
        </div>
    );
};

export default OmsorgstilbudEnkeltdagerSummary;
