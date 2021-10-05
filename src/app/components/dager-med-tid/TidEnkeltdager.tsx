import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import groupBy from 'lodash.groupby';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { DagMedTid } from '../../types';
import { TidEnkeltdagApiData } from '../../types/PleiepengesøknadApiData';
import DagerMedTidListe from './dager-med-tid-liste/DagerMedTidListe';

interface Props {
    dager: TidEnkeltdagApiData[];
}

const TidEnkeltdager: React.FunctionComponent<Props> = ({ dager }) => {
    const days: DagMedTid[] = [];
    dager.forEach((dag) => {
        const dato = ISOStringToDate(dag.dato);
        const tid = iso8601DurationToTime(dag.tid);
        if (dato && tid) {
            days.push({ dato, tid: tid as any });
        }
    });

    const ingenDagerRegistrertMelding = <FormattedMessage id="dagerMedTid.ingenDagerRegistrert" />;
    if (dager.length === 0) {
        return ingenDagerRegistrertMelding;
    }
    if (dager.length < 10) {
        return <DagerMedTidListe dagerMedTid={days} viseUke={true} />;
    }

    const months = groupBy(days, ({ dato }) => `${dato.getFullYear()}.${dato.getMonth()}`);
    return (
        <div>
            {Object.keys(months).map((key) => {
                const dagerMedTid = months[key];
                if (dagerMedTid.length === 0) {
                    return ingenDagerRegistrertMelding;
                }
                return (
                    <Box margin="m" key={key}>
                        <EkspanderbartPanel
                            tittel={
                                <span style={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                                    {dayjs(dagerMedTid[0].dato).format('MMMM YYYY')}
                                </span>
                            }>
                            <DagerMedTidListe dagerMedTid={dagerMedTid} viseUke={true} />
                        </EkspanderbartPanel>
                    </Box>
                );
            })}
        </div>
    );
};

export default TidEnkeltdager;
