import React from 'react';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { TidEnkeltdag } from '../../types';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { getMonthsInDateRange } from '../../utils/dateUtils';
import { validateOmsorgstilbudEnkeltdagerIPeriode } from '../../validation/fieldValidations';
import { getTidIOmsorgValidator } from '../../validation/validateOmsorgstilbudFields';
import AppForm from '../app-form/AppForm';
import TidUkerInput from '../tid-uker-input/TidUkerInput';
import OmsorgstilbudInfoAndDialog from './OmsorgstilbudInfoAndDialog';

interface Props {
    periode: DateRange;
    søknadsdato: Date;
    visKunEnkeltdager: boolean;
    tidIOmsorgstilbud: TidEnkeltdag;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudIPeriodeSpørsmål: React.FunctionComponent<Props> = ({
    visKunEnkeltdager,
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
            legend={
                visKunEnkeltdager === true
                    ? intlHelper(
                          intl,
                          gjelderFortid
                              ? 'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud'
                              : 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud'
                      )
                    : undefined
            }
            name={`${enkeltdagerFieldName}_dager` as any}
            tag="div"
            description={
                visKunEnkeltdager ? (
                    <ExpandableInfo
                        title={intlHelper(
                            intl,
                            'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.tittel'
                        )}>
                        {intlHelper(intl, 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description')}
                    </ExpandableInfo>
                ) : undefined
            }
            validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode, gjelderFortid)}>
            {visKunEnkeltdager && (
                <TidUkerInput
                    periode={periode}
                    fieldName={enkeltdagerFieldName}
                    tidPerDagValidator={getTidIOmsorgValidator}
                />
            )}
            {visKunEnkeltdager === false && (
                <>
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
                </>
            )}
        </AppForm.InputGroup>
    );
};

export default OmsorgstilbudIPeriodeSpørsmål;
