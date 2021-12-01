import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Knapp from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import ArbeidstidEnkeltdagDialog from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagDialog';
import { ArbeidstidEnkeltdagEndring } from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { TidEnkeltdag } from '../../../types';
import { getDagerMedTidITidsrom, tidErIngenTid } from '../../../utils/tidsbrukUtils';

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
    tidArbeidstid,
    editLabel,
    addLabel,
    utilgjengeligeDatoer,
    månedTittelHeadingLevel = 2,
    periode,
    onEnkeltdagChange,
    onRequestEdit,
}) => {
    const intl = useIntl();

    const [editDate, setEditDate] = useState<{ dato: Date; tid: InputTime } | undefined>();

    const dager = getDagerMedTidITidsrom(tidArbeidstid, måned);
    const dagerMedRegistrertArbeidstid = dager.filter((d) => tidErIngenTid(d.tid) === false);

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            apen={false}
            tittel={
                <>
                    <Element tag={`h${månedTittelHeadingLevel}`}>
                        <span>
                            {intlHelper(intl, 'arbeidstid.ukeOgÅr', {
                                ukeOgÅr: dayjs(måned.from).format('YYYY - MMMM'),
                            })}
                        </span>
                    </Element>
                    {1 + 1 === 4 && (
                        <Box margin="m">
                            <Normaltekst>
                                {dagerMedRegistrertArbeidstid.length === 0 ? (
                                    <FormattedMessage id="arbeidstid.iPeriodePanel.info.ingenDager" />
                                ) : (
                                    <FormattedMessage
                                        id="arbeidstid.iPeriodePanel.info"
                                        values={{ dager: dagerMedRegistrertArbeidstid.length }}
                                    />
                                )}
                            </Normaltekst>
                        </Box>
                    )}
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
                              const dagMedTid = dager.find((d) => dayjs(d.dato).isSame(dato, 'day'));
                              setEditDate(dagMedTid || { dato, tid: { hours: '', minutes: '' } });
                          }
                        : undefined
                }
            />
            <FormBlock margin="l">
                <Knapp htmlType="button" mini={true} onClick={() => onRequestEdit(tidArbeidstid)}>
                    {dager.length === 0 ? addLabel : editLabel}
                </Knapp>
            </FormBlock>
            {editDate && onEnkeltdagChange && (
                <ArbeidstidEnkeltdagDialog
                    isOpen={editDate !== undefined}
                    dagMedTid={editDate}
                    periode={periode}
                    onSubmit={(evt) => {
                        onEnkeltdagChange(evt);
                        setEditDate(undefined);
                    }}
                    onCancel={() => setEditDate(undefined)}
                    arbeidsstedNavn={'abc'}
                />
            )}
        </Ekspanderbartpanel>
    );
};

export default ArbeidstidMånedInfo;
