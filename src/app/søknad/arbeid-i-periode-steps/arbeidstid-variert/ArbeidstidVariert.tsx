import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, ArbeidsforholdType, ArbeidstidPeriodeData } from '@navikt/sif-common-pleiepenger';
import ArbeidstidMånedInfo from '@navikt/sif-common-pleiepenger/lib/arbeidstid-måned-info/ArbeidstidMånedInfo';
import SøknadsperioderMånedListe from '@navikt/sif-common-pleiepenger/lib/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
import { DateDurationMap, getDatesInMonthOutsideDateRange, getMonthsInDateRange } from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import { Element } from 'nav-frontend-typografi';
import useLogSøknadInfo from '../../../hooks/useLogSøknadInfo';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { validateArbeidsTidEnkeltdager } from '../../../validation/validateArbeidFields';
import SøknadFormComponents from '../../SøknadFormComponents';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ArbeidstidPeriode from '../arbeidstid-periode/ArbeidstidPeriode';

interface Props {
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    formFieldName: SøknadFormField;
    periode: DateRange;
    jobberNormaltTimer: number;
    arbeidstid?: DateDurationMap;
    intlValues: ArbeidIPeriodeIntlValues;
    kanLeggeTilPeriode: boolean;
    onArbeidstidChanged?: (arbeidstid: DateDurationMap) => void;
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
    const intl = useIntl();
    const { setFieldValue } = useFormikContext<SøknadFormData>() || {};
    const { logArbeidPeriodeRegistrert } = useLogSøknadInfo();

    const antallMåneder = getMonthsInDateRange(periode).length;
    const { logArbeidEnkeltdagRegistrert } = useLogSøknadInfo();

    const handleOnEnkeltdagChange = (evt: TidEnkeltdagEndring) => {
        const newValues = { ...arbeidstid, ...evt.dagerMedTid };
        setFieldValue(formFieldName as any, newValues);
        logArbeidEnkeltdagRegistrert({
            antallDager: Object.keys(evt.dagerMedTid).length,
        });
        onArbeidstidChanged ? onArbeidstidChanged(newValues) : undefined;
    };

    const handleOnPeriodeChange = (tid: DateDurationMap, periodeData: ArbeidstidPeriodeData) => {
        logArbeidPeriodeRegistrert({
            verdi: periodeData.prosent ? 'prosent' : 'ukeplan',
            prosent: periodeData.prosent,
        });

        const dagerMedArbeid = { ...arbeidstid, ...tid };
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
                        <ArbeidstidPeriode
                            onPeriodeChange={handleOnPeriodeChange}
                            registrerKnappLabel={intlHelper(
                                intl,
                                'registrerArbeidstidPeriode.registrerJobbKnapp.label'
                            )}
                            formProps={{
                                jobberNormaltTimer,
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
        </SøknadFormComponents.InputGroup>
    );
};

export default ArbeidstidVariert;
