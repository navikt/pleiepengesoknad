import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { Element, Undertittel } from 'nav-frontend-typografi';
import FormattedTimeText from '../../formatted-time-text/FormattedTimeText';
import { DagMedTid } from '../TidEnkeltdager';
import './dagerMedTidListe.less';

interface Props {
    dagerMedTid: DagMedTid[];
    visMåned?: boolean;
    viseUke?: boolean;
}

const sortDays = (d1: DagMedTid, d2: DagMedTid): number => (dayjs(d1.dato).isSameOrBefore(d2.dato, 'day') ? -1 : 1);

const bem = bemUtils('dagerMedTidListe');

export const DagerMedTidListe = ({ dagerMedTid: dagerMedTid, viseUke, visMåned }: Props) => {
    const weeksWithDays = groupBy(dagerMedTid, (dag) => `${dag.dato.getFullYear()}-${dayjs(dag.dato).isoWeek()}`);
    return (
        <div className={bem.block}>
            {visMåned && <Undertittel className="m-caps">{dayjs(dagerMedTid[0].dato).format('MMM YYYY')}</Undertittel>}
            <div className={bem.element('uker')}>
                {Object.keys(weeksWithDays).map((key) => {
                    const days = weeksWithDays[key];
                    return (
                        <div key={key} className={bem.element('uke')}>
                            {viseUke && (
                                <Element tag="h4" className={bem.element('uketittel')}>
                                    <FormattedMessage
                                        id="dagerMedTid.uke"
                                        values={{ uke: dayjs(days[0].dato).isoWeek() }}
                                    />
                                </Element>
                            )}
                            <ul className={bem.element('dager')}>
                                {days.sort(sortDays).map((dag, idx) => {
                                    const timer = dag.tid.hours || '0';
                                    const minutter = dag.tid.minutes || '0';

                                    return (
                                        <li key={idx}>
                                            <div className={bem.element('dag')}>
                                                <span className={bem.element('dag__dato')}>
                                                    {dayjs(dag.dato).format('dddd DD.MM.YYYY')}:
                                                </span>
                                                <span className={bem.element('dag__tid')}>
                                                    <FormattedTimeText
                                                        time={{ hours: timer, minutes: minutter }}
                                                        fullText={true}
                                                    />
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DagerMedTidListe;
