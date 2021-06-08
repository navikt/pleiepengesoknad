import React from 'react';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Undertekst } from 'nav-frontend-typografi';
import CalendarGrid from '../calendar-grid/CalendarGrid';
import FormattedTimeText from './FormattedTimeText';
import { OmsorgstilbudDag } from './types';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';

interface Props {
    måned: Date;
    omsorgsdager: OmsorgstilbudDag[];
    fraDato: Date;
    tilDato: Date;
    brukEtikettForInnhold?: boolean;
    visSomListe?: boolean;
    skjulTommeDagerIListe?: boolean;
}

const formatTimeFull = (time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return `${timer} ${pluralize(timer, 'time', 'timer')}, ${minutter} ${pluralize(minutter, 'minutt', 'minutter')}`;
};

const pluralize = (tall: number | string, singular: string, plural: string): string =>
    typeof tall === 'number' ? (tall === 1 ? singular : plural) : tall === '1' ? singular : plural;

const DagContent = ({ tid, brukEtikettForInnhold = true }: { tid: Partial<Time>; brukEtikettForInnhold?: boolean }) => {
    const bem = bemUtils('tidIOmsorgstilbud');
    const content = (
        <div className={bem.element('info')}>
            <span className={bem.element('info__tid')}>
                <AriaAlternative visibleText={<FormattedTimeText time={tid} />} ariaText={formatTimeFull(tid)} />
            </span>
        </div>
    );
    return brukEtikettForInnhold ? (
        <EtikettInfo className={bem.block}>{content}</EtikettInfo>
    ) : (
        <div className={bem.block}>{content}</div>
    );
};
const OmsorgstilbudCalendar: React.FunctionComponent<Props> = ({
    måned,
    fraDato,
    tilDato,
    omsorgsdager,
    brukEtikettForInnhold,
    visSomListe,
    skjulTommeDagerIListe,
}) => {
    return (
        <CalendarGrid
            month={måned}
            min={fraDato}
            max={tilDato}
            renderAsList={visSomListe}
            dateFormatter={(date: Date) => (
                <AriaAlternative
                    visibleText={dayjs(date).format('D.')}
                    ariaText={dayjs(date).format('dddd DD. MMM YYYY')}
                />
            )}
            noContentRenderer={() => {
                return <Undertekst className={'ingenTidRegistrert'}>Ingen tid registrert</Undertekst>;
            }}
            content={omsorgsdager.map((dag) => ({
                date: dag.dato,
                content: <DagContent tid={dag.tid} brukEtikettForInnhold={brukEtikettForInnhold} />,
            }))}
            hideEmptyContentInListMode={skjulTommeDagerIListe}
        />
    );
};

export default OmsorgstilbudCalendar;
