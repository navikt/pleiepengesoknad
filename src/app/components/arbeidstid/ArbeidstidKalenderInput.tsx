import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { getMonthsInDateRange } from '../../utils/dateUtils';
import { MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA } from '../../utils/omsorgstilbudUtils';
import AppForm from '../app-form/AppForm';
import TidUkerInput from '../tid-uker-input/TidUkerInput';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import ArbeidstidInfoAndDialog from './ArbeidstidInfoAndDialog';
import { getArbeidstimerDatoValidator } from '../../validation/validateArbeidFields';

interface Props {
    periode: DateRange;
    erHistorisk?: boolean;
    enkeltdagerFieldName: string;
    visKunEnkeltdager?: boolean;
}

const erKortPeriode = (periode: DateRange): boolean => {
    const antallDager = dayjs(periode.to).diff(periode.from, 'days');
    if (antallDager <= MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA) {
        return true;
    }
    return false;
};

const ArbeidstidKalenderInput: React.FunctionComponent<Props> = ({
    enkeltdagerFieldName,
    periode,
    visKunEnkeltdager,
    erHistorisk,
}) => {
    const visSkjemaInline: boolean = visKunEnkeltdager || erKortPeriode(periode);
    const intl = useIntl();
    return (
        <AppForm.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            legend={intlHelper(
                intl,
                erHistorisk ? 'arbeidIPeriode.historisk.hvorMyeTidIArbeid' : 'arbeidIPeriode.planlagt.hvorMyeTidIArbeid'
            )}
            description={
                <ExpandableInfo title="Må jeg fylle ut for alle dagene?">
                    Du trenger kun å fylle ut de dagene du jobbet. Dager hvor du ikke fyller ut noe tid, vil bli regnet
                    som at du ikke jobbet den dagen.
                </ExpandableInfo>
            }
            name={`${enkeltdagerFieldName}_dager` as any}
            tag="div">
            {visSkjemaInline && (
                <TidUkerInput
                    periode={periode}
                    fieldName={enkeltdagerFieldName}
                    tidPerDagValidator={getArbeidstimerDatoValidator}
                />
            )}
            {visSkjemaInline === false && (
                <>
                    {getMonthsInDateRange(periode).map((periode, index) => {
                        const mndOgÅr = dayjs(periode.from).format('MMMM YYYY');
                        return (
                            <Box key={dayjs(periode.from).format('MM.YYYY')} margin="l">
                                <ResponsivePanel className={'noPanelPaddingDialogWrapper'}>
                                    <AppForm.InputGroup name={`${enkeltdagerFieldName}_${index}` as any} tag="div">
                                        <ArbeidstidInfoAndDialog
                                            name={enkeltdagerFieldName}
                                            periode={periode}
                                            labels={{
                                                addLabel: intlHelper(intl, 'arbeidstid.addLabel', { periode: mndOgÅr }),
                                                deleteLabel: intlHelper(intl, 'arbeidstid.deleteLabel', {
                                                    periode: mndOgÅr,
                                                }),
                                                editLabel: intlHelper(intl, 'arbeidstid.editLabel', {
                                                    periode: mndOgÅr,
                                                }),
                                                modalTitle: intlHelper(intl, 'arbeidstid.modalTitle', {
                                                    periode: mndOgÅr,
                                                }),
                                            }}
                                        />
                                    </AppForm.InputGroup>
                                </ResponsivePanel>
                            </Box>
                        );
                    })}
                </>
            )}
        </AppForm.InputGroup>
    );
};

export default ArbeidstidKalenderInput;
