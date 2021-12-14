import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, dateToISOString, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import ArbeidstidEnkeltdagDialog from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagDialog';
import { ArbeidstidEnkeltdagEndring } from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { ArbeidsforholdType, DatoTidMap } from '../../../types';
import { getAntallDagerMedTidMerEnnNull, getDagerMedTidITidsrom } from '../../../utils/datoTidUtils';
import TidArbeidEnkeltdag from './TidArbeidEnkeltdag';

interface Props {
    måned: DateRange;
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    tidArbeidstid: DatoTidMap;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    periode: DateRange;
    åpentEkspanderbartPanel?: boolean;
    onEnkeltdagChange?: (evt: ArbeidstidEnkeltdagEndring) => void;
    onRequestEdit?: (tid: DatoTidMap) => void;
}

const ArbeidstidMånedTittel = ({
    headingLevel,
    måned,
    antallDagerMedTid,
}: {
    headingLevel: number;
    måned: DateRange;
    antallDagerMedTid: number;
}) => {
    const intl = useIntl();
    return (
        <Element tag={`h${headingLevel}`}>
            <span className="m-caps">
                {intlHelper(intl, 'arbeidstid.ukeOgÅr', {
                    ukeOgÅr: dayjs(måned.from).format('MMMM YYYY'),
                })}
            </span>
            <Normaltekst tag="div">
                {antallDagerMedTid === 0 ? (
                    <FormattedMessage id="arbeidstid.iPeriodePanel.info.ingenDager" />
                ) : (
                    <FormattedMessage id="arbeidstid.iPeriodePanel.info" values={{ dager: antallDagerMedTid }} />
                )}
            </Normaltekst>
        </Element>
    );
};

const ArbeidstidMånedInfo: React.FunctionComponent<Props> = ({
    måned,
    arbeidsstedNavn,
    arbeidsforholdType,
    tidArbeidstid,
    utilgjengeligeDatoer,
    månedTittelHeadingLevel = 2,
    periode,
    åpentEkspanderbartPanel,
    onEnkeltdagChange,
}) => {
    const [editDate, setEditDate] = useState<{ dato: Date; tid: Partial<InputTime> } | undefined>();

    const dager: DatoTidMap = getDagerMedTidITidsrom(tidArbeidstid, måned);
    const antallDagerMedTid = getAntallDagerMedTidMerEnnNull(dager);

    const handleKalenderDatoClick = (dato: Date) => {
        const tid: Partial<InputTime> = dager[dateToISOString(dato)]?.varighet || {
            hours: '',
            minutes: '',
        };
        setEditDate({ dato, tid });
    };

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
                <ArbeidstidMånedTittel
                    måned={måned}
                    headingLevel={månedTittelHeadingLevel}
                    antallDagerMedTid={antallDagerMedTid}
                />
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
                tidRenderer={({ tid, prosent }) => <TidArbeidEnkeltdag tid={tid} prosent={prosent} />}
                onDateClick={onEnkeltdagChange ? handleKalenderDatoClick : undefined}
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
                    arbeidsforholdType={arbeidsforholdType}
                />
            )}
        </Ekspanderbartpanel>
    );
};

export default ArbeidstidMånedInfo;
