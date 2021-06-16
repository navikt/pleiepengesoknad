import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { EtikettInfo } from 'nav-frontend-etiketter';
import CalendarGrid from '../calendar-grid/CalendarGrid';
import FormattedTimeText from './FormattedTimeText';
import { OmsorgstilbudDag } from './types';

interface Props {
    måned: Date;
    omsorgsdager: OmsorgstilbudDag[];
    fraDato: Date;
    tilDato: Date;
    brukEtikettForInnhold?: boolean;
    visSomListe?: boolean;
    skjulTommeDagerIListe?: boolean;
}

export const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};

const DagContent = ({
    tid,
    brukEtikettForInnhold = true,
    desimalTid,
}: {
    tid: Partial<Time>;
    brukEtikettForInnhold?: boolean;
    desimalTid?: boolean;
}) => {
    const bem = bemUtils('tidIOmsorgstilbud');
    const intl = useIntl();
    const content = (
        <div className={bem.element('info')}>
            <span className={bem.element('info__tid')}>
                <AriaAlternative
                    visibleText={<FormattedTimeText time={tid} decimal={desimalTid} />}
                    ariaText={formatTime(intl, tid)}
                />
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
                return <span />; //Undertekst className={'ingenTidRegistrert'}>Ingen tid registrert</span>;
            }}
            content={omsorgsdager.map((dag) => ({
                date: dag.dato,
                content: <DagContent tid={dag.tid} brukEtikettForInnhold={brukEtikettForInnhold} desimalTid={false} />,
            }))}
            hideEmptyContentInListMode={skjulTommeDagerIListe}
        />
    );
};

export default OmsorgstilbudCalendar;
