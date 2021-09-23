import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { DagMedTid } from '../../../../types';
import FormattedTimeText from '../../../formatted-time-text/FormattedTimeText';
import './omsorgsdagerListe.less';

interface Props {
    omsorgsdager: DagMedTid[];
    visMåned?: boolean;
    viseUke?: boolean;
}

const sortDays = (d1: DagMedTid, d2: DagMedTid): number => (dayjs(d1.dato).isSameOrBefore(d2.dato, 'day') ? -1 : 1);

const bem = bemUtils('omsorgsdagerListe');

export const OmsorgsdagerListe = ({ omsorgsdager, viseUke, visMåned }: Props) => {
    if (omsorgsdager.length === 0) {
        return <FormattedMessage id="omsorgstilbud.ingenDagerRegistrert" />;
    }
    const weeksWithDays = groupBy(omsorgsdager, (dag) => `${dag.dato.getFullYear()}-${dayjs(dag.dato).isoWeek()}`);
    return (
        <div className={bem.block}>
            {visMåned && <Undertittel className="m-caps">{dayjs(omsorgsdager[0].dato).format('MMM YYYY')}</Undertittel>}
            <div className={bem.element('uker')}>
                {Object.keys(weeksWithDays).map((key) => {
                    const days = weeksWithDays[key];
                    return (
                        <div key={key} className={bem.element('uke')}>
                            {viseUke && (
                                <Element tag="h4" className={bem.element('uketittel')}>
                                    <FormattedMessage
                                        id="omsorgstilbud.uke"
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

export default OmsorgsdagerListe;
