import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import Box from '@navikt/sif-common-core/lib/components/box/Box';
// import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, dateToISOString, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
// import Knapp from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import ArbeidstidEnkeltdagDialog from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagDialog';
import { ArbeidstidEnkeltdagEndring } from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { TidEnkeltdag } from '../../../types';
import { getEnkeltdagerMedTidITidsrom, tidErIngenTid } from '../../../utils/tidsbrukUtils';
import { ensureTime } from '../../../utils/timeUtils';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import AlertStripe from 'nav-frontend-alertstriper';

interface Props {
    måned: DateRange;
    arbeidsstedNavn: string;
    tidArbeidstid: TidEnkeltdag;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    periode: DateRange;
    onEnkeltdagChange?: (evt: ArbeidstidEnkeltdagEndring) => void;
    onRequestEdit: (tid: TidEnkeltdag) => void;
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
    onEnkeltdagChange,
    // onRequestEdit,
}) => {
    const intl = useIntl();

    const [editDate, setEditDate] = useState<{ dato: Date; tid: Partial<InputTime> } | undefined>();

    const dager = getEnkeltdagerMedTidITidsrom(tidArbeidstid, måned);
    const dagerMedRegistrertArbeidstid = Object.keys(dager).filter((key) => {
        const tid = dager[key];
        return tid !== undefined && tidErIngenTid(ensureTime(tid)) === false;
    });

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            apen={false}
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
                tidRenderer={(tid: InputTime) => {
                    if (tid.hours === '0' && tid.minutes === '0') {
                        return <></>;
                    }
                    return <FormattedTimeText time={tid} />;
                }}
                onDateClick={
                    onEnkeltdagChange
                        ? (dato) => {
                              const tid: Partial<InputTime> = dager[dateToISOString(dato)] || {
                                  hours: '',
                                  minutes: '',
                              };
                              setEditDate({ dato, tid });
                          }
                        : undefined
                }
            />
            <FormBlock margin="l">
                <AlertStripe type="info" form="inline">
                    Klikk på en dag for å endre tid for den dagen
                </AlertStripe>
                {/* <Knapp htmlType="button" mini={true} onClick={() => onRequestEdit(tidArbeidstid)}>
                    {dager.length === 0 ? addLabel : editLabel}
                </Knapp> */}
            </FormBlock>
            {editDate && onEnkeltdagChange && (
                <ArbeidstidEnkeltdagDialog
                    isOpen={editDate !== undefined}
                    dato={editDate.dato}
                    tid={editDate.tid}
                    periode={periode}
                    onSubmit={(evt) => {
                        onEnkeltdagChange(evt);
                        setEditDate(undefined);
                    }}
                    onCancel={() => setEditDate(undefined)}
                    arbeidsstedNavn={arbeidsstedNavn}
                />
            )}
        </Ekspanderbartpanel>
    );
};

export default ArbeidstidMånedInfo;
