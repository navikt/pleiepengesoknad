import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Element } from 'nav-frontend-typografi';
import { ArbeidstidEnkeltdagEndring } from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import SøknadsperioderMånedListe from '../../../pre-common/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { getDatesInMonthOutsideDateRange, getMonthsInDateRange } from '../../../utils/common/dateRangeUtils';
import { ArbeidsforholdType, DatoTidMap } from '../../../types';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { validateArbeidsTidEnkeltdager } from '../../../validation/validateArbeidFields';
import SøknadFormComponents from '../../SøknadFormComponents';
import { ArbeidIPeriodeIntlValues } from '../ArbeidIPeriodeSpørsmål';
import ArbeidstidMånedInfo from './ArbeidstidMånedInfo';
import RegistrerArbeidstidPeriode from './RegistrerArbeidstidPeriode';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import useLogSøknadInfo from '../../../hooks/useLogSøknadInfo';
import dayjs from 'dayjs';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    formFieldName: SøknadFormField;
    periode: DateRange;
    jobberNormaltTimer: number;
    arbeidstid?: DatoTidMap;
    intlValues: ArbeidIPeriodeIntlValues;
    kanLeggeTilPeriode: boolean;
    onArbeidstidChanged?: (arbeidstid: DatoTidMap) => void;
}

const ArbeidstidVariert: React.FunctionComponent<Props> = ({
    formFieldName,
    arbeidstid = {},
    arbeidsstedNavn,
    arbeidsforholdType,
    jobberNormaltTimer,
    periode,
    intlValues,
    kanLeggeTilPeriode,
    onArbeidstidChanged,
}) => {
    const { setFieldValue } = useFormikContext<SøknadFormData>() || {};

    const antallMåneder = getMonthsInDateRange(periode).length;
    const { logArbeidEnkeltdagRegistrert } = useLogSøknadInfo();
    const erHistorisk = dayjs(periode.to).isBefore(dateToday);

    const handleOnEnkeltdagChange = (evt: ArbeidstidEnkeltdagEndring) => {
        const newValues = { ...arbeidstid, ...evt.dagerMedTid };
        setFieldValue(formFieldName as any, newValues);
        logArbeidEnkeltdagRegistrert({
            antallDager: Object.keys(evt.dagerMedTid).length,
            erHistorisk,
        });
        onArbeidstidChanged ? onArbeidstidChanged(newValues) : undefined;
    };

    const handleOnPeriodeChange = (data: DatoTidMap) => {
        const dagerMedArbeid = { ...arbeidstid, ...data };
        setFieldValue(formFieldName, dagerMedArbeid);
        if (onArbeidstidChanged) {
            onArbeidstidChanged(dagerMedArbeid);
        }
    };

    const månedContentRenderer = (måned: DateRange) => {
        return (
            <ArbeidstidMånedInfo
                arbeidsstedNavn={arbeidsstedNavn}
                arbeidsforholdType={arbeidsforholdType}
                måned={måned}
                åpentEkspanderbartPanel={antallMåneder === 1 || kanLeggeTilPeriode === false}
                tidArbeidstid={arbeidstid}
                utilgjengeligeDatoer={getDatesInMonthOutsideDateRange(måned.from, periode)}
                periode={periode}
                onEnkeltdagChange={handleOnEnkeltdagChange}
            />
        );
    };

    return (
        <SøknadFormComponents.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${formFieldName}_dager` as any}
            validate={() => validateArbeidsTidEnkeltdager(arbeidstid, periode, intlValues)}
            tag="div">
            {kanLeggeTilPeriode ? (
                <>
                    <Element tag="h3">
                        <FormattedMessage id="arbeidstidVariert.periode.tittel" />
                    </Element>
                    <ul>
                        <li>
                            <FormattedMessage id="arbeidstidVariert.periode.info.1" />
                        </li>
                        <li>
                            <FormattedMessage id="arbeidstidVariert.periode.info.2" />
                        </li>
                        <li>
                            <FormattedMessage id="arbeidstidVariert.periode.info.3" />
                        </li>
                    </ul>
                    <Box margin="l">
                        <RegistrerArbeidstidPeriode
                            jobberNormaltTimer={jobberNormaltTimer}
                            intlValues={intlValues}
                            periode={periode}
                            arbeidsstedNavn={arbeidsstedNavn}
                            onPeriodeChange={handleOnPeriodeChange}
                        />
                    </Box>
                    <FormBlock>
                        <Element tag="h3">
                            <FormattedMessage id="arbeidstidVariert.månedsliste.tittel" />
                        </Element>
                        <Box margin="l">
                            <SøknadsperioderMånedListe
                                periode={periode}
                                årstallHeadingLevel={3}
                                månedContentRenderer={månedContentRenderer}
                            />
                        </Box>
                    </FormBlock>
                </>
            ) : (
                <>
                    <Element tag="h3">
                        <FormattedMessage
                            id={
                                erHistorisk
                                    ? 'arbeidstidVariert.kortPeriode.historisk.tittel'
                                    : 'arbeidstidVariert.kortPeriode.tittel'
                            }
                        />
                    </Element>
                    <p>
                        <FormattedMessage id="arbeidstidVariert.kortPeriode.info" values={intlValues} />
                    </p>
                    <SøknadsperioderMånedListe
                        periode={periode}
                        årstallHeadingLevel={3}
                        månedContentRenderer={månedContentRenderer}
                    />
                </>
            )}
        </SøknadFormComponents.InputGroup>
    );
};

export default ArbeidstidVariert;
