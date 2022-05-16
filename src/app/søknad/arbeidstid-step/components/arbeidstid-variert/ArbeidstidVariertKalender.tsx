import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, FormikInputGroup } from '@navikt/sif-common-formik/lib';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidIPeriodeIntlValues,
    ArbeidsforholdType,
    SøknadsperioderMånedListe,
} from '@navikt/sif-common-pleiepenger';
import ArbeidstidMåned from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-måned/ArbeidstidMåned';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid/tid-enkeltdag-dialog/TidEnkeltdagForm';
import {
    DateDurationMap,
    durationToDecimalDuration,
    DurationWeekdays,
    getAllWeekdaysWithoutDuration,
    getDatesInDateRange,
    getDatesInMonthOutsideDateRange,
    getDurationsInDateRange,
    getMonthsInDateRange,
    getValidDurations,
    isDateInWeekdays,
    summarizeDateDurationMap,
} from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import ArbeidstidPeriodeKnapp from '../arbeidstid-periode-knapp/ArbeidstidPeriodeKnapp';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import { ArbeidstidRegistrertLogProps } from '../../types';
import { Element } from 'nav-frontend-typografi';

interface Props extends ArbeidstidRegistrertLogProps {
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    formFieldName: SøknadFormField;
    periode: DateRange;
    arbeiderNormaltTimerPerUke?: number;
    arbeiderNormaltTimerFasteUkedager?: DurationWeekdays;
    arbeidstid?: DateDurationMap;
    intlValues: ArbeidIPeriodeIntlValues;
    kanLeggeTilPeriode: boolean;
    disableDagerUtenforFasteDager?: boolean;
    onArbeidstidVariertChanged?: (arbeidstid: DateDurationMap) => void;
}

const ArbeidstidVariertKalender: React.FunctionComponent<Props> = ({
    formFieldName,
    arbeidstid = {},
    arbeidsstedNavn,
    arbeidsforholdType,
    arbeiderNormaltTimerPerUke,
    arbeiderNormaltTimerFasteUkedager,
    periode,
    intlValues,
    kanLeggeTilPeriode,
    disableDagerUtenforFasteDager = false,
    onArbeidstidVariertChanged,
    onArbeidstidEnkeltdagRegistrert,
}) => {
    const intl = useIntl();
    const { setFieldValue } = useFormikContext<SøknadFormData>() || {};

    const antallMåneder = getMonthsInDateRange(periode).length;

    const handleOnEnkeltdagChange = (evt: TidEnkeltdagEndring) => {
        const newValues = { ...arbeidstid, ...evt.dagerMedTid };
        setFieldValue(formFieldName as any, newValues);
        if (onArbeidstidEnkeltdagRegistrert) {
            onArbeidstidEnkeltdagRegistrert({ antallDager: Object.keys(evt.dagerMedTid).length });
        }
        onArbeidstidVariertChanged ? onArbeidstidVariertChanged(newValues) : undefined;
    };

    /** Dager som en ikke jobber på normalt */
    const utilgjengeligeUkedager =
        disableDagerUtenforFasteDager && arbeiderNormaltTimerFasteUkedager
            ? getAllWeekdaysWithoutDuration(arbeiderNormaltTimerFasteUkedager)
            : undefined;

    const handleOnPeriodeChange = (tid: DateDurationMap) => {
        const dagerMedArbeid = { ...arbeidstid, ...tid };
        setFieldValue(formFieldName, dagerMedArbeid);
        if (onArbeidstidVariertChanged) {
            onArbeidstidVariertChanged(dagerMedArbeid);
        }
    };

    const månedContentRenderer = (måned: DateRange) => {
        const datoerUtenforPeriode = getDatesInMonthOutsideDateRange(måned.from, periode);
        const datoerPåDagerHvorEnNormaltIkkeJobber = utilgjengeligeUkedager
            ? getDatesInDateRange(periode).filter((date) => isDateInWeekdays(date, utilgjengeligeUkedager))
            : [];
        const utilgjengeligeDatoerIMåned = [...datoerUtenforPeriode, ...datoerPåDagerHvorEnNormaltIkkeJobber];
        return (
            <ArbeidstidMåned
                arbeiderNormaltTimerFasteUkedager={arbeiderNormaltTimerFasteUkedager}
                arbeidsstedNavn={arbeidsstedNavn}
                arbeidsforholdType={arbeidsforholdType}
                måned={måned}
                månedTittelHeadingLevel={3}
                åpentEkspanderbartPanel={antallMåneder === 1}
                tidArbeidstid={arbeidstid}
                utilgjengeligeDatoer={utilgjengeligeDatoerIMåned}
                periode={periode}
                skjulIngenTidEnkeltdag={true}
                onEnkeltdagChange={handleOnEnkeltdagChange}
            />
        );
    };
    return (
        <FormikInputGroup
            name={`${formFieldName}_dager`}
            validate={() => validateArbeidsTidEnkeltdager(arbeidstid, periode, intlValues)}
            tag="div">
            {kanLeggeTilPeriode && (
                <>
                    <Box margin="xl" padBottom="m">
                        <Element>Oppgi hvor mange timer du jobber</Element>
                    </Box>
                    <p style={{ marginTop: 0 }}>
                        <FormattedMessage id="arbeidstidVariert.info.1" />
                    </p>
                    <p>
                        <FormattedMessage id="arbeidstidVariert.info.2" />
                    </p>

                    <Box margin="l" padBottom="xl">
                        <ArbeidstidPeriodeKnapp
                            onPeriodeChange={handleOnPeriodeChange}
                            registrerKnappLabel={intlHelper(intl, 'arbeidstidVariert.registrerJobbKnapp.label')}
                            arbeiderNormaltTimerFasteUkedager={arbeiderNormaltTimerFasteUkedager}
                            formProps={{
                                arbeiderNormaltTimerPerUke,
                                intlValues,
                                periode,
                                arbeidsstedNavn,
                            }}
                        />
                    </Box>
                </>
            )}
            <Box margin="s">
                <SøknadsperioderMånedListe periode={periode} månedContentRenderer={månedContentRenderer} />
            </Box>
        </FormikInputGroup>
    );
};

export const validateArbeidsTidEnkeltdager = (
    tidMedArbeid: DateDurationMap,
    periode: DateRange,
    intlValues: ArbeidIPeriodeIntlValues
): ValidationResult<ValidationError> => {
    const tidIPerioden = getDurationsInDateRange(tidMedArbeid, periode);
    const validTidEnkeltdager = getValidDurations(tidIPerioden);
    const hasElements = Object.keys(validTidEnkeltdager).length > 0;

    if (!hasElements || durationToDecimalDuration(summarizeDateDurationMap(validTidEnkeltdager)) <= 0) {
        return {
            key: `validation.arbeidIPeriode.enkeltdager.ingenTidRegistrert`,
            keepKeyUnaltered: true,
            values: intlValues,
        };
    }
    return undefined;
};

export default ArbeidstidVariertKalender;
