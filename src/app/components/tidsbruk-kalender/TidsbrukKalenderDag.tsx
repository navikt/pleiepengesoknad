import React from 'react';
import { Undertekst } from 'nav-frontend-typografi';
import FormattedTimeText from '../formatted-time-text/FormattedTimeText';
import { InputTime } from '@navikt/sif-common-formik/lib';
import { TidRenderer } from './TidsbrukKalender';
import { timeHasSameDuration } from '../../utils/common/inputTimeUtils';

export type TidsbrukKalenderDagFooterRenderer = (dato: Date) => JSX.Element | undefined;

interface Props {
    dato: Date;
    tid?: InputTime;
    prosent?: number;
    tidOpprinnelig?: InputTime;
    visEndringsinformasjon?: boolean;
    erUtilgjengelig?: boolean;
    tidRenderer?: TidRenderer;
    footerRenderer?: TidsbrukKalenderDagFooterRenderer;
}

const TidsbrukKalenderDag: React.FunctionComponent<Props> = ({
    dato,
    prosent,
    tid,
    tidOpprinnelig,
    visEndringsinformasjon,
    tidRenderer,
    footerRenderer,
}) => {
    const erEndret = timeHasSameDuration(tid, tidOpprinnelig) === false;

    const renderTid = (time: InputTime) =>
        tidRenderer ? tidRenderer({ tid: time, dato, prosent }) : <FormattedTimeText time={time} />;

    return (
        <>
            {tid && (
                <>
                    {erEndret ? (
                        <>
                            <span className="tidsbrukTidDag">{renderTid(tid)}</span>
                            {visEndringsinformasjon && (
                                <>
                                    {tidOpprinnelig ? (
                                        <div className={'tidsbruk__opprinneligTid'}>
                                            (
                                            <Undertekst tag="span" style={{ textDecoration: 'line-through' }}>
                                                <span className="sr-only">Endret fra: </span>
                                                {renderTid(tidOpprinnelig)}
                                            </Undertekst>
                                            )
                                        </div>
                                    ) : (
                                        <Undertekst>(lagt til)</Undertekst>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <span className="tidsbrukTidDag">
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
