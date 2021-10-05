import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { DagMedTid } from '../../types';
import CalendarGrid from '../calendar-grid/CalendarGrid';
import FormattedTimeText from '../formatted-time-text/FormattedTimeText';

interface Props {
    måned: Date;
    dager: DagMedTid[];
    periode: DateRange;
    brukEtikettForInnhold?: boolean;
    visSomListe?: boolean;
    skjulTommeDagerIListe?: boolean;
}

const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
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
    const intl = useIntl();
    const content = (
        <AriaAlternative
            visibleText={<FormattedTimeText time={tid} decimal={desimalTid} />}
            ariaText={formatTime(intl, tid)}
        />
    );
    return brukEtikettForInnhold ? <EtikettInfo>{content}</EtikettInfo> : content;
};
const TidsbrukKalender: React.FunctionComponent<Props> = ({
    måned,
    periode,
    dager,
    brukEtikettForInnhold,
    visSomListe,
    skjulTommeDagerIListe,
}) => {
    return (
        <CalendarGrid
            month={måned}
            min={periode.from}
            max={periode.to}
            renderAsList={visSomListe}
            dateFormatter={(date: Date) => (
                <AriaAlternative
                    visibleText={dayjs(date).format('D.')}
                    ariaText={dayjs(date).format('dddd DD. MMM YYYY')}
                />
            )}
            noContentRenderer={() => {
                return <span />;
            }}
            days={dager.map((dag) => ({
                date: dag.dato,
                content: <DagContent tid={dag.tid} brukEtikettForInnhold={brukEtikettForInnhold} desimalTid={false} />,
            }))}
            hideEmptyContentInListMode={skjulTommeDagerIListe}
        />
    );
};

export default TidsbrukKalender;
