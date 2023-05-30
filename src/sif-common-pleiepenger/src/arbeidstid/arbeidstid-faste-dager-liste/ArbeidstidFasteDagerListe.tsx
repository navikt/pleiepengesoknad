import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ISODurationToDuration } from '@navikt/sif-common-utils';
import { ArbeidstimerApiData, ArbeidstimerFasteDagerApiData } from '../../types';

export interface ArbeidstidFasteDagerOppsummeringProps {
    fasteDager?: ArbeidstimerFasteDagerApiData;
    visNormaltid?: boolean;
}

const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};

const ArbeidstidFasteDagerOppsummering: React.FunctionComponent<ArbeidstidFasteDagerOppsummeringProps> = ({
    fasteDager,
    visNormaltid,
}) => {
    const intl = useIntl();

    if (fasteDager) {
        const ukedager = Object.keys(fasteDager).filter((day) => (fasteDager as any)[day] !== undefined);
        if (ukedager.length > 0) {
            return (
                <ul style={{ marginTop: 0 }}>
                    {ukedager.map((ukedag, idx) => {
                        const arbeidstimer: ArbeidstimerApiData = (fasteDager as any)[ukedag];
                        const durationFaktiskTimer = ISODurationToDuration(arbeidstimer.faktiskTimer);
                        const durationNormalTimer = ISODurationToDuration(arbeidstimer.normalTimer);
                        return (
                            <li key={idx} style={{ marginBottom: '.25rem' }}>
                                {`${intlHelper(intl, `dagerMedTid.${ukedag}er`)}: ${
                                    durationFaktiskTimer ? formatTime(intl, durationFaktiskTimer) : 0
                                }`}
                                {visNormaltid && durationNormalTimer && (
                                    <>
                                        .
                                        <br />
                                        {intlHelper(intl, 'dagerMedTid.normaltTimer', {
                                            timer: formatTime(intl, durationNormalTimer),
                                        })}
                                        .
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            );
        }
    }
    return <>{intlHelper(intl, 'dagerMedTid.ingenDagerRegistrert')}</>;
};

export default ArbeidstidFasteDagerOppsummering;
