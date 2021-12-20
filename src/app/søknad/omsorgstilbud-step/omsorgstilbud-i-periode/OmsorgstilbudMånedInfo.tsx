import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, dateToISOString, InputTime } from '@navikt/sif-common-formik/lib';
import { durationIsZero } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import OmsorgstilbudEnkeltdagDialog from '../../../pre-common/omsorgstilbud-enkeltdag/OmsorgstilbudEnkeltdagDialog';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { DatoTidMap, Tid } from '../../../types';
import { getDagerMedTidITidsrom } from '../../../utils/datoTidUtils';

interface Props {
    måned: DateRange;
    tidOmsorgstilbud: DatoTidMap;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    åpentEkspanderbartPanel?: boolean;
    onEnkeltdagChange?: (dato: Date, tid: Tid) => void;
    onRequestEdit: (tid: DatoTidMap) => void;
}

const OmsorgstilbudMånedInfo: React.FunctionComponent<Props> = ({
    måned,
    tidOmsorgstilbud,
    utilgjengeligeDatoer,
    månedTittelHeadingLevel = 2,
    addLabel,
    editLabel,
    åpentEkspanderbartPanel,
    onRequestEdit,
    onEnkeltdagChange,
}) => {
    const [editDate, setEditDate] = useState<{ dato: Date; tid: Partial<InputTime> } | undefined>();

    const dager: DatoTidMap = getDagerMedTidITidsrom(tidOmsorgstilbud, måned);
    const dagerMedRegistrertOmsorgstilbud: string[] = Object.keys(dager).filter((key) => {
        const datoTid = dager[key];
        return datoTid !== undefined && datoTid.varighet !== undefined && durationIsZero(datoTid.varighet) === false;
    });

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            apen={åpentEkspanderbartPanel}
            tittel={
                <>
                    <Element tag={`h${månedTittelHeadingLevel}`}>
                        <FormattedMessage
                            id="omsorgstilbud.ukeOgÅr"
                            values={{ ukeOgÅr: dayjs(måned.from).format('MMMM YYYY') }}
                        />{' '}
                        <Normaltekst tag="div">
                            {dagerMedRegistrertOmsorgstilbud.length === 0 ? (
                                <FormattedMessage id="omsorgstilbud.ingenDagerRegistrert" />
                            ) : (
                                <FormattedMessage
                                    id="omsorgstilbud.iPeriodePanel.info"
                                    values={{ dager: dagerMedRegistrertOmsorgstilbud.length }}
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
            <FormBlock margin="l">
                <Knapp htmlType="button" mini={true} onClick={() => onRequestEdit(tidOmsorgstilbud)}>
                    {dagerMedRegistrertOmsorgstilbud.length === 0 ? addLabel : editLabel}
                </Knapp>
            </FormBlock>

            {editDate && onEnkeltdagChange && (
                <OmsorgstilbudEnkeltdagDialog
                    isOpen={editDate !== undefined}
                    dato={editDate.dato}
                    tid={editDate.tid}
                    onSubmit={(tid) => {
                        setEditDate(undefined);
                        setTimeout(() => {
                            /** TimeOut pga komponent unmountes */
                            onEnkeltdagChange(editDate.dato, tid);
                        });
                    }}
                    onCancel={() => setEditDate(undefined)}
                />
            )}
        </Ekspanderbartpanel>
    );
};

export default OmsorgstilbudMånedInfo;
