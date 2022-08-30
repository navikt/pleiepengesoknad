import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { DateRange, FormikInputGroup } from '@navikt/sif-common-formik/lib';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger';
import { ArbeidstidUkerInput } from '@navikt/sif-common-pleiepenger';
import {
    DateDurationMap,
    durationToDecimalDuration,
    DurationWeekdays,
    getDurationsInDateRange,
    getValidDurations,
    summarizeDateDurationMap,
} from '@navikt/sif-common-utils';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { SøknadFormField } from '../../../../types/SøknadFormValues';
import { getArbeidIPeriodeEnkeltdagValidator } from '../arbeid-i-periode-spørsmål/validationArbeidIPeriodeSpørsmål';
import { ArbeidstidRegistrertLogProps } from '../../types';

interface Props extends ArbeidstidRegistrertLogProps {
    formFieldName: SøknadFormField;
    periode: DateRange;
    arbeidstid?: DateDurationMap;
    arbeiderNormaltTimerFasteUkedager?: DurationWeekdays;
    intlValues: ArbeidIPeriodeIntlValues;
    kanLeggeTilPeriode: boolean;
}

const ArbeidstidVariertUkedager: React.FunctionComponent<Props> = ({
    formFieldName,
    periode,
    arbeidstid = {},
    arbeiderNormaltTimerFasteUkedager,
    intlValues,
    kanLeggeTilPeriode,
}) => {
    const enkeltdagValidator = arbeiderNormaltTimerFasteUkedager
        ? getArbeidIPeriodeEnkeltdagValidator(arbeiderNormaltTimerFasteUkedager, intlValues)
        : undefined;
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
                </>
            )}

            <Undertittel tag="h3">
                <FormattedMessage id={'arbeidstidVariert.kortPeriode.tittel'} />
            </Undertittel>
            <p>
                Når det varierer hvor mye du jobber hver uke, må du oppgi hvor mye du jobber per dag. Dersom du jobber
                på andre dager enn de du normalt jobber på, må timene allikevel oppgis på den dagen du normalt ville
                jobbet. Du kan ikke oppgi flere timer enn det du normalt jobber på en dag. Eventuell overtid trenger du
                ikke oppgi.
            </p>
            <Box padBottom="l" margin="l">
                <ExpandableInfo title="Dersom du jobber andre dager enn normalt">[TODO]</ExpandableInfo>
            </Box>
            <ArbeidstidUkerInput
                data-testid="arbeidstid-variert-uker"
                periode={periode}
                arbeidstid={arbeidstid}
                fieldName={formFieldName}
                normalarbeidstidUkedager={arbeiderNormaltTimerFasteUkedager}
                tekster={{
                    dag: 'Dag',
                    jobber: 'Jobber',
                    fravær: 'Borte fra jobb',
                    ariaLabelTidInput: (dato) => `Hvor mye jobber du ${dato}`,
                }}
                enkeltdagValidator={enkeltdagValidator}
            />
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

export default ArbeidstidVariertUkedager;
