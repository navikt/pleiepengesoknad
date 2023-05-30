import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Duration, durationsAreEqual, ensureDuration } from '@navikt/sif-common-utils';
import { Undertekst } from 'nav-frontend-typografi';
import DurationText from '../../common/duration-text/DurationText';
import { TidRenderer } from './TidsbrukKalender';
import './tidsbrukKalenderDag.less';

export type TidsbrukKalenderDagFooterRenderer = (dato: Date) => JSX.Element | undefined;

interface Props {
    dato: Date;
    tid?: Duration;
    prosent?: number;
    tidOpprinnelig?: Duration;
    visOpprinneligTid?: boolean;
    erUtilgjengelig?: boolean;
    tidRenderer?: TidRenderer;
    opprinneligTidRenderer?: TidRenderer;
    footerRenderer?: TidsbrukKalenderDagFooterRenderer;
}

const bem = bemUtils('tidsbrukKalenderDag');

const TidsbrukKalenderDag: React.FunctionComponent<Props> = ({
    dato,
    prosent,
    tid,
    tidOpprinnelig,
    visOpprinneligTid,
    tidRenderer,
    opprinneligTidRenderer,
    footerRenderer,
}) => {
    const erEndret = durationsAreEqual(tid, tidOpprinnelig) === false;

    const renderTid = (duration: Duration) =>
        tidRenderer ? tidRenderer({ tid: duration, dato, prosent }) : <DurationText duration={duration} />;

    const renderOpprinneligTid = (duration: Duration) =>
        opprinneligTidRenderer ? (
            opprinneligTidRenderer({ tid: duration, dato, prosent })
        ) : (
            <DurationText duration={duration} />
        );

    return (
        <>
            {tid && (
                <>
                    {erEndret ? (
                        <>
                            <span className={bem.block}>{renderTid(ensureDuration(tid))}</span>
                            {visOpprinneligTid && (
                                <>
                                    {tidOpprinnelig ? (
                                        <div className={bem.element('opprinneligTidWrapper')}>
                                            <Undertekst tag="span" className={bem.element('opprinneligTid')}>
                                                (<span className="sr-only">Endret fra: </span>
                                                {renderOpprinneligTid(tidOpprinnelig)})
                                            </Undertekst>
                                        </div>
                                    ) : (
                                        <Undertekst>(lagt til)</Undertekst>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <span className={bem.block}>
                            {renderTid(tid)} <span className="sr-only">(uendret)</span>
                        </span>
                    )}
                    {footerRenderer && <>{footerRenderer(dato)}</>}
                </>
            )}
            {tidOpprinnelig && !tid && <>{renderTid(tidOpprinnelig)}</>}
        </>
    );
};

export default TidsbrukKalenderDag;
