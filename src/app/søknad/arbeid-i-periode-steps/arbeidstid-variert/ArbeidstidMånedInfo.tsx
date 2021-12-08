import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, dateToISOString, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import ArbeidstidEnkeltdagDialog from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagDialog';
import { ArbeidstidEnkeltdagEndring } from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { DatoTidMap } from '../../../types';
import { inputTimeDurationIsZero } from '../../../utils/common/inputTimeUtils';
import { getDagerMedTidITidsrom } from '../../../utils/datoTidUtils';

interface Props {
    måned: DateRange;
    arbeidsstedNavn: string;
    tidArbeidstid: DatoTidMap;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    periode: DateRange;
    åpentEkspanderbartPanel?: boolean;
    onEnkeltdagChange?: (evt: ArbeidstidEnkeltdagEndring) => void;
    onRequestEdit: (tid: DatoTidMap) => void;
}

const ArbeidstidMånedInfo: React.FunctionComponent<Props> = ({
    måned,
    arbeidsstedNavn,
    tidArbeidstid,
    // editLabel,
    // addLabel,
    utilgjengeligeDatoer,
    månedTittelHeadingLevel = 2,
    periode,
    åpentEkspanderbartPanel,
    onEnkeltdagChange,
    // onRequestEdit,
}) => {
    const intl = useIntl();

    const [editDate, setEditDate] = useState<{ dato: Date; tid: Partial<InputTime> } | undefined>();

    const dager: DatoTidMap = getDagerMedTidITidsrom(tidArbeidstid, måned);
    const dagerMedRegistrertArbeidstid: string[] = Object.keys(dager).filter((key) => {
        const datoTid = dager[key];
        return (
            datoTid !== undefined &&
            datoTid.varighet !== undefined &&
            inputTimeDurationIsZero(datoTid.varighet) === false
        );
    });

    // const perioder = getPerioderMedLikTidIDatoTidMap(dager);

    // const erDagDelAvPerioder = (dato: Date): number => {
    //     return perioder.findIndex((p) => {
    //         return p.datoer.some((d) => d === dateToISOString(dato));
    //     });
    // };

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            apen={åpentEkspanderbartPanel}
            tittel={
                <>
                    <Element tag={`h${månedTittelHeadingLevel}`}>
                        <span className="m-caps">
                            {intlHelper(intl, 'arbeidstid.ukeOgÅr', {
                                ukeOgÅr: dayjs(måned.from).format('MMMM YYYY'),
                            })}
                        </span>

                        <Normaltekst tag="div">
                            {dagerMedRegistrertArbeidstid.length === 0 ? (
                                <FormattedMessage id="arbeidstid.iPeriodePanel.info.ingenDager" />
                            ) : (
                                <FormattedMessage
                                    id="arbeidstid.iPeriodePanel.info"
                                    values={{ dager: dagerMedRegistrertArbeidstid.length }}
                                />
                            )}
                        </Normaltekst>
                    </Element>
                </>
            }>
            <TidsbrukKalender
                periode={måned}
                dager={dager}
                utilgjengeligeDatoer={utilgjengeligeDatoer}
                skjulTommeDagerIListe={true}
                visEndringsinformasjon={false}
                // footerRenderer={(dato) => {
                //     if (1 + 1 === 2) {
                //         // test på rendering av periode
                //         const periodeIndex = erDagDelAvPerioder(dato);
                //         return periodeIndex >= 0 ? (
                //             <div
                //                 className={`kalenderPeriodeDag kalenderPeriodeDag--${
                //                     periodeIndex % 2 === 0 ? 'odd' : 'even'
                //                 }`}>
                //                 <span className="kalenderPeriodeDag__info">dato</span>
                //             </div>
                //         ) : undefined;
                //     }
                //     return undefined;
                // }}
                tidRenderer={({ tid, prosent }) => {
                    if (prosent !== undefined && prosent > 0) {
                        return (
                            <>
                                <div>{prosent} %</div>
                                {1 + 1 === 2 && (
                                    <div className="beregnetTid">
                                        (<FormattedTimeText time={tid} />)
                                    </div>
                                )}
                            </>
                        );
                    }
                    if (tid.hours === '0' && tid.minutes === '0') {
                        return <></>;
                    }
                    return <FormattedTimeText time={tid} />;
                }}
                onDateClick={
                    onEnkeltdagChange
                        ? (dato) => {
                              const tid: Partial<InputTime> = dager[dateToISOString(dato)]?.varighet || {
                                  hours: '',
                                  minutes: '',
                              };
                              setEditDate({ dato, tid });
                          }
                        : undefined
                }
            />
            {editDate && onEnkeltdagChange && (
                <ArbeidstidEnkeltdagDialog
                    isOpen={editDate !== undefined}
                    dato={editDate.dato}
                    tid={editDate.tid}
                    periode={periode}
                    onSubmit={(evt) => {
                        setEditDate(undefined);
                        setTimeout(() => {
                            /** TimeOut pga komponent unmountes */
                            onEnkeltdagChange(evt);
                        });
                    }}
                    onCancel={() => setEditDate(undefined)}
                    arbeidsstedNavn={arbeidsstedNavn}
                />
            )}
        </Ekspanderbartpanel>
    );
};

export default ArbeidstidMånedInfo;
