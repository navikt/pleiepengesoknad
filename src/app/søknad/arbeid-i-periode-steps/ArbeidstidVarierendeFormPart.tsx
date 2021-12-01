import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { TidEnkeltdag } from '../../types';
import { validateArbeidsTidEnkeltdager } from '../../validation/validateArbeidFields';
import SøknadFormComponents from '../SøknadFormComponents';
import { ArbeidIPeriodeIntlValues } from './ArbeidIPeriodeSpørsmål';
import ArbeidstidMånedListe from './arbeidstid-måned-liste/ArbeidstidMånedListe';
import { SøknadFormField } from '../../types/SøknadFormData';

interface Props {
    periode: DateRange;
    erHistorisk?: boolean;
    tidMedArbeid?: TidEnkeltdag;
    enkeltdagerFieldName: SøknadFormField;
    intlValues: ArbeidIPeriodeIntlValues;
    søknadsdato: Date;
    onChanged: () => void;
}

const ArbeidstidVarierendeFormPart: React.FunctionComponent<Props> = ({
    enkeltdagerFieldName,
    periode,
    tidMedArbeid = {},
    intlValues,
    erHistorisk,
    søknadsdato,
    onChanged,
}) => {
    // const intl = useIntl();
    return (
        <SøknadFormComponents.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${enkeltdagerFieldName}_dager` as any}
            validate={() => validateArbeidsTidEnkeltdager(tidMedArbeid, periode, erHistorisk, intlValues)}
            tag="div">
            <ArbeidstidMånedListe
                periode={periode}
                intlValues={intlValues}
                arbeidsstedNavn="abc"
                søknadsdato={søknadsdato}
                formFieldName={enkeltdagerFieldName}
                onArbeidstidChanged={onChanged}
            />
        </SøknadFormComponents.InputGroup>
    );
};

export default ArbeidstidVarierendeFormPart;
