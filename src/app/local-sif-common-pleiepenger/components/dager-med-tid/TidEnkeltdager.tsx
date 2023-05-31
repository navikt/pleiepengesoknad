import React from 'react';
import { FormattedMessage } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import { ISODate, ISODateToDate, ISODuration, ISODurationToDuration } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import groupBy from 'lodash.groupby';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { DagMedTid } from '../../types/DagMedTid';
import DagerMedTidListe from '../dager-med-tid-liste/DagerMedTidListe';

interface ISODagMedTid {
    dato: ISODate;
    tid: ISODuration;
}

interface Props {
    dager: ISODagMedTid[];
}

const TidEnkeltdager: React.FunctionComponent<Props> = ({ dager }) => {
    const days: DagMedTid[] = [];
    dager.forEach((dag) => {
        const dato = ISODateToDate(dag.dato);
        const tid = ISODurationToDuration(dag.tid);
        if (dato && tid) {
            days.push({ dato, tid });
        }
    });

    const ingenDagerRegistrertMelding = <FormattedMessage id="dagerMedTid.ingenDagerRegistrert" />;
    if (dager.length === 0) {
        return ingenDagerRegistrertMelding;
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
                    <Block margin="m" key={key}>
                        <EkspanderbartPanel
                            tittel={
                                <span style={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                                    {dayjs(dagerMedTid[0].dato).format('MMMM YYYY')}
                                </span>
                            }>
                            <DagerMedTidListe dagerMedTid={dagerMedTid} viseUke={true} />
                        </EkspanderbartPanel>
                    </Block>
                );
            })}
        </div>
    );
};

export default TidEnkeltdager;
