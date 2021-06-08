import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { Element, Undertittel } from 'nav-frontend-typografi';
import FormattedTimeText from '../omsorgstilbud/FormattedTimeText';
import { OmsorgstilbudDag } from '../omsorgstilbud/types';
import './omsorgsdagerListe.less';
import { Time } from '@navikt/sif-common-formik/lib';

interface Props {
    omsorgsdager: OmsorgstilbudDag[];
    visMåned?: boolean;
    viseUke?: boolean;
}

const sortDays = (d1: OmsorgstilbudDag, d2: OmsorgstilbudDag): number =>
    dayjs(d1.dato).isSameOrBefore(d2.dato) ? -1 : 1;

const bem = bemUtils('omsorgsdagerListe');

const summerTid = (omsorgsdager: OmsorgstilbudDag[]): Time => {
    let timer = 0;
    let minutter = 0;
    omsorgsdager.forEach(({ tid: { hours = '0', minutes = '0' } }) => {
        if (hours && parseInt(hours, 10) >= 0) {
            timer += parseInt(hours, 10) || 0;
        }
        if (hours && parseInt(minutes, 10) >= 0) {
            minutter += parseInt(minutes, 10) || 0;
        }
    });
    const heleTimerIMinutter = Math.floor(minutter / 60);
    if (heleTimerIMinutter > 0) {
        timer += heleTimerIMinutter;
        minutter -= heleTimerIMinutter * 60;
    }
    return {
        hours: `${timer}`,
        minutes: `${minutter}`,
    };
};

export const OmsorgsdagerListe = ({ omsorgsdager, viseUke, visMåned }: Props) => {
    if (omsorgsdager.length === 0) {
        return <>Ingen omsorgsdager registrert</>;
    }

    const weeksWithDays = groupBy(omsorgsdager, (dag) => `${dag.dato.getFullYear()}-${dayjs(dag.dato).isoWeek()}`);
    const tidTotalt = summerTid(omsorgsdager);
    return (
        <div className={bem.block}>
            {visMåned && <Undertittel className="m-caps">{dayjs(omsorgsdager[0].dato).format('MMM YYYY')}</Undertittel>}
            {omsorgsdager.length > 1 && (
                <p className={bem.element('tidTotalt')}>
                    Tid totalt:{' '}
                    <FormattedTimeText
                        time={{ hours: tidTotalt.hours, minutes: tidTotalt.minutes }}
                        fullText={true}
                        hideEmptyValues={true}
                    />
                    {` `}
                    fordelt på {omsorgsdager.length} dager.
                </p>
            )}

            <div className={bem.element('uker')}>
                {Object.keys(weeksWithDays).map((key) => {
                    const days = weeksWithDays[key];
                    return (
                        <div key={key} className={bem.element('uke')}>
                            {viseUke && (
                                <Element tag="h4" className={bem.element('uketittel')}>
                                    Uke {dayjs(days[0].dato).isoWeek()}
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
