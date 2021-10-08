import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { TidEnkeltdag } from '../../types';
import { getMonthsInDateRange } from '../../utils/dateUtils';
import { validateArbeidsTidEnkeltdager } from '../../validation/validateArbeidFields';
import AppForm from '../app-form/AppForm';
import { ArbeidIPeriodeIntlValues } from './ArbeidIPeriodeSpørsmål';
import ArbeidstidInfoAndDialog from './ArbeidstidInfoAndDialog';
import './arbeidstidKalender.less';

interface Props {
    periode: DateRange;
    erHistorisk?: boolean;
    tidMedArbeid?: TidEnkeltdag;
    enkeltdagerFieldName: string;
    intlValues: ArbeidIPeriodeIntlValues;
    søknadsdato: Date;
}

const ArbeidstidKalenderInput: React.FunctionComponent<Props> = ({
    enkeltdagerFieldName,
    periode,
    tidMedArbeid = {},
    intlValues,
    erHistorisk,
    søknadsdato,
}) => {
    const intl = useIntl();

    return (
        <AppForm.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */

            name={`${enkeltdagerFieldName}_dager` as any}
            validate={() => validateArbeidsTidEnkeltdager(tidMedArbeid, periode, erHistorisk, intlValues)}
            tag="div">
            {getMonthsInDateRange(periode).map((periode, index) => {
                const mndOgÅr = dayjs(periode.from).format('MMMM YYYY');
                return (
                    <div className="arbeidstidKalender__mnd" key={dayjs(periode.from).format('MM.YYYY')}>
                        <FormBlock margin={index === 0 ? 'none' : undefined}>
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
                                    søknadsdato={søknadsdato}
                                />
                            </AppForm.InputGroup>
                        </FormBlock>
                    </div>
                );
            })}
        </AppForm.InputGroup>
    );
};

export default ArbeidstidKalenderInput;
