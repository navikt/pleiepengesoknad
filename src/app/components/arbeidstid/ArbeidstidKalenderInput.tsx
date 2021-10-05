import React from 'react';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { getMonthsInDateRange } from '../../utils/dateUtils';
import { visSpørsmålOmTidErLikHverUke } from '../../utils/tidsbrukUtils';
import {
    getArbeidstimerEnkeltdagValidator,
    validateArbeidsTidEnkeltdager,
} from '../../validation/validateArbeidFields';
import AppForm from '../app-form/AppForm';
import TidUkerInput from '../tid-uker-input/TidUkerInput';
import ArbeidstidInfoAndDialog from './ArbeidstidInfoAndDialog';
import { TidEnkeltdag } from '../../types';
import { ArbeidIPeriodeIntlValues } from './ArbeidIPeriodeSpørsmål';
import './arbeidstidKalender.less';

interface Props {
    periode: DateRange;
    erHistorisk?: boolean;
    tidMedArbeid?: TidEnkeltdag;
    enkeltdagerFieldName: string;
    visKunEnkeltdager?: boolean;
    intlValues: ArbeidIPeriodeIntlValues;
}

const ArbeidstidKalenderInput: React.FunctionComponent<Props> = ({
    enkeltdagerFieldName,
    periode,
    visKunEnkeltdager,
    tidMedArbeid = {},
    intlValues,
    erHistorisk,
}) => {
    const visSkjemaInline: boolean = visKunEnkeltdager || visSpørsmålOmTidErLikHverUke(periode) === false;
    const intl = useIntl();

    return (
        <AppForm.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            legend={
                visSkjemaInline === true
                    ? intlHelper(
                          intl,
                          erHistorisk
                              ? 'arbeidIPeriode.historisk.hvorMyeTidIArbeid'
                              : 'arbeidIPeriode.planlagt.hvorMyeTidIArbeid'
                      )
                    : undefined
            }
            description={
                visSkjemaInline === true ? (
                    <ExpandableInfo title="Må jeg fylle ut for alle dagene?">
                        Du trenger kun å fylle ut de dagene du jobbet. Dager hvor du ikke fyller ut noe tid, vil bli
                        regnet som at du ikke jobbet den dagen.
                    </ExpandableInfo>
                ) : undefined
            }
            name={`${enkeltdagerFieldName}_dager` as any}
            validate={() => validateArbeidsTidEnkeltdager(tidMedArbeid, periode, erHistorisk, intlValues)}
            tag="div">
            {visSkjemaInline && (
                <TidUkerInput
                    periode={periode}
                    fieldName={enkeltdagerFieldName}
                    tidPerDagValidator={getArbeidstimerEnkeltdagValidator(intlValues)}
                />
            )}
            {visSkjemaInline === false && (
                <>
                    {getMonthsInDateRange(periode).map((periode, index) => {
                        const mndOgÅr = dayjs(periode.from).format('MMMM YYYY');
                        return (
                            <div className="arbeidstidKalender__mnd" key={dayjs(periode.from).format('MM.YYYY')}>
                                <FormBlock>
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
                                            intlValues={intlValues}
                                        />
                                    </AppForm.InputGroup>
                                </FormBlock>
                            </div>
                        );
                    })}
                </>
            )}
        </AppForm.InputGroup>
    );
};

export default ArbeidstidKalenderInput;
