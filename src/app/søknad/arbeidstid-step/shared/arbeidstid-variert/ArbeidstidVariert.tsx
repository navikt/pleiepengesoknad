import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, FormikInputGroup } from '@navikt/sif-common-formik/lib';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidIPeriodeIntlValues, ArbeidsforholdType, ArbeidstidPeriodeData } from '@navikt/sif-common-pleiepenger';
import ArbeidstidMånedInfo from '@navikt/sif-common-pleiepenger/lib/arbeidstid-måned-info/ArbeidstidMånedInfo';
import SøknadsperioderMånedListe from '@navikt/sif-common-pleiepenger/lib/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
import {
    DateDurationMap,
    durationToDecimalDuration,
    DurationWeekdays,
    getDatesInMonthOutsideDateRange,
    getDurationsInDateRange,
    getMonthsInDateRange,
    getValidDurations,
    summarizeDateDurationMap,
} from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import { Element } from 'nav-frontend-typografi';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import ArbeidstidPeriode from '../arbeidstid-periode/ArbeidstidPeriode';
import { ArbeidstidRegistrertLogProps } from '../types';

interface Props extends ArbeidstidRegistrertLogProps {
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    formFieldName: SøknadFormField;
    periode: DateRange;
    jobberNormaltTimerPerUke?: number;
    jobberNormaltTimerFasteDager?: DurationWeekdays;
    arbeidstid?: DateDurationMap;
    intlValues: ArbeidIPeriodeIntlValues;
    kanLeggeTilPeriode: boolean;
    onArbeidstidVariertChanged?: (arbeidstid: DateDurationMap) => void;
}

const ArbeidstidVariert: React.FunctionComponent<Props> = ({
    formFieldName,
    arbeidstid = {},
    arbeidsstedNavn,
    arbeidsforholdType,
    jobberNormaltTimerPerUke,
    jobberNormaltTimerFasteDager,
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
        <FormikInputGroup
            name={`${formFieldName}_dager`}
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
                        <ArbeidstidPeriode
                            onPeriodeChange={handleOnPeriodeChange}
                            registrerKnappLabel={intlHelper(intl, 'arbeidstidVariert.registrerJobbKnapp.label')}
                            formProps={{
                                jobberNormaltTimerPerUke,
                                jobberNormaltTimerFasteDager: jobberNormaltTimerFasteDager,
                                intlValues,
                                periode,
                                arbeidsstedNavn,
                            }}
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
                        <FormattedMessage id={'arbeidstidVariert.kortPeriode.tittel'} />
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

export default ArbeidstidVariert;
