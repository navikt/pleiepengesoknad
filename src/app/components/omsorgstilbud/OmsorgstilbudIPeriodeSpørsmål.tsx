import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { TidEnkeltdag } from '../../types';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { getMonthsInDateRange } from '../../utils/dateUtils';
import { validateOmsorgstilbudEnkeltdagerIPeriode } from '../../validation/fieldValidations';
import AppForm from '../app-form/AppForm';
import OmsorgstilbudInfoAndDialog from './OmsorgstilbudInfoAndDialog';

interface Props {
    periode: DateRange;
    søknadsdato: Date;
    tidIOmsorgstilbud: TidEnkeltdag;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudIPeriodeSpørsmål: React.FunctionComponent<Props> = ({
    periode,
    tidIOmsorgstilbud,
    søknadsdato,
    onOmsorgstilbudChanged,
}) => {
    const intl = useIntl();
    const gjelderFortid = dayjs(periode.to).isBefore(søknadsdato, 'day');

    const enkeltdagerFieldName = gjelderFortid
        ? AppFormField.omsorgstilbud__historisk__enkeltdager
        : AppFormField.omsorgstilbud__planlagt__enkeltdager;

    return (
        <AppForm.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${enkeltdagerFieldName}_dager` as any}
            tag="div"
            validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode, gjelderFortid)}>
            {getMonthsInDateRange(periode).map((periode) => {
                const mndOgÅr = dayjs(periode.from).format('MMMM YYYY');
                return (
                    <div key={dayjs(periode.from).format('MM.YYYY')} className="omsorgstilbudKalender__mnd">
                        {/* <AppForm.InputGroup name={`${enkeltdagerFieldName}_${index}` as any} tag="div"> */}
                        <OmsorgstilbudInfoAndDialog
                            name={enkeltdagerFieldName}
                            periode={periode}
                            søknadsdato={søknadsdato}
                            skjulTommeDagerIListe={true}
                            onAfterChange={onOmsorgstilbudChanged}
                            labels={{
                                addLabel: intlHelper(intl, 'omsorgstilbud.addLabel', {
                                    periode: mndOgÅr,
                                }),
                                deleteLabel: intlHelper(intl, 'omsorgstilbud.deleteLabel', {
                                    periode: mndOgÅr,
                                }),
                                editLabel: intlHelper(intl, 'omsorgstilbud.editLabel', {
                                    periode: mndOgÅr,
                                }),
                                modalTitle: intlHelper(intl, 'omsorgstilbud.modalTitle', {
                                    periode: mndOgÅr,
                                }),
                            }}
                        />
                        {/* </AppForm.InputGroup> */}
                    </div>
                );
            })}
        </AppForm.InputGroup>
    );
};

export default OmsorgstilbudIPeriodeSpørsmål;
