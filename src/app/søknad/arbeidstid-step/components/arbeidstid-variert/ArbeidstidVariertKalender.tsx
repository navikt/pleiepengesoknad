import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, FormikInputGroup } from '@navikt/sif-common-formik/lib';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidIPeriodeIntlValues,
    ArbeidsforholdType,
    ArbeidstidPeriodeData,
    SøknadsperioderMånedListe,
} from '@navikt/sif-common-pleiepenger';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid/tid-enkeltdag-dialog/TidEnkeltdagForm';
import ArbeidstidMåned from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-måned/ArbeidstidMåned';
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
import { Element } from 'nav-frontend-typografi';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import ArbeidstidPeriodeKnapp from '../arbeidstid-periode-knapp/ArbeidstidPeriodeKnapp';
import { ArbeidstidRegistrertLogProps } from '../../types';

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
    onArbeidstidVariertChanged,
    onArbeidstidEnkeltdagRegistrert,
    onArbeidPeriodeRegistrert,
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
    const utilgjengeligeUkedager = arbeiderNormaltTimerFasteUkedager
        ? getAllWeekdaysWithoutDuration(arbeiderNormaltTimerFasteUkedager)
        : undefined;

    const handleOnPeriodeChange = (tid: DateDurationMap, periodeData: ArbeidstidPeriodeData) => {
        if (onArbeidPeriodeRegistrert) {
            onArbeidPeriodeRegistrert({
                verdi: periodeData.prosent ? 'prosent' : 'ukeplan',
                prosent: periodeData.prosent,
            });
        }
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
                åpentEkspanderbartPanel={antallMåneder === 1}
                tidArbeidstid={arbeidstid}
                utilgjengeligeDatoer={utilgjengeligeDatoerIMåned}
                periode={periode}
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
                        <ArbeidstidPeriodeKnapp
                            onPeriodeChange={handleOnPeriodeChange}
                            registrerKnappLabel={intlHelper(intl, 'arbeidstidVariert.registrerJobbKnapp.label')}
                            formProps={{
                                arbeiderNormaltTimerPerUke,
                                arbeiderNormaltTimerFasteUkedager,
                                intlValues,
                                periode,
                                arbeidsstedNavn,
                            }}
                        />
                    </Box>
                </>
            )}

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
