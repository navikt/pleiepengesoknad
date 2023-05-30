import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import OmsorgstilbudMåned from '@navikt/sif-common-pleiepenger/components/omsorgstilbud-periode/OmsorgstilbudMåned';
import SøknadsperioderMånedListe from '@navikt/sif-common-pleiepenger/components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/components/tid-enkeltdag-dialog/TidEnkeltdagForm';
import { DateDurationMap, getDatesInMonthOutsideDateRange, getMonthsInDateRange } from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import { Element } from 'nav-frontend-typografi';
import { SøknadFormField, SøknadFormValues } from '../../../types/SøknadFormValues';
import { validateOmsorgstilbudEnkeltdagerIPeriode } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import { skalViseSpørsmålOmProsentEllerLiktHverUke } from '../omsorgstilbudStepUtils';
import OmsorgstilbudPeriode from './OmsorgstilbudPeriode';

interface Props {
    tittel: string;
    formFieldName: SøknadFormField;
    periode: DateRange;
    tidIOmsorgstilbud: DateDurationMap;
    omsorgsdager: DateDurationMap;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudVariert: React.FunctionComponent<Props> = ({
    tittel,
    periode,
    tidIOmsorgstilbud,
    formFieldName,
    omsorgsdager,
    onOmsorgstilbudChanged,
}) => {
    const kanLeggeTilPeriode = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);

    const { setFieldValue } = useFormikContext<SøknadFormValues>() || {};
    const antallMåneder = getMonthsInDateRange(periode).length;

    const handleOnPeriodeChange = (data: DateDurationMap) => {
        const dagerMedOmsorgstilbud = { ...tidIOmsorgstilbud, ...data };
        setFieldValue(formFieldName, dagerMedOmsorgstilbud);
        if (onOmsorgstilbudChanged) {
            onOmsorgstilbudChanged();
        }
    };

    const handleOnEnkeltdagChange = (evt: TidEnkeltdagEndring) => {
        const newValues = { ...omsorgsdager, ...evt.dagerMedTid };
        setFieldValue(formFieldName as any, newValues);
        if (onOmsorgstilbudChanged) {
            onOmsorgstilbudChanged();
        }
    };

    const omsorgstilbudMånedRenderer = (måned: DateRange) => {
        return (
            <OmsorgstilbudMåned
                periode={periode}
                måned={måned}
                tidOmsorgstilbud={omsorgsdager}
                utilgjengeligeDatoer={getDatesInMonthOutsideDateRange(måned.from, periode)}
                åpentEkspanderbartPanel={antallMåneder === 1 || kanLeggeTilPeriode === false}
                onEnkeltdagChange={handleOnEnkeltdagChange}
                månedTittelHeadingLevel={3}
            />
        );
    };

    return (
        <>
            <Box padBottom="m">
                <Element tag="h2">{tittel}</Element>
            </Box>
            <SøknadFormComponents.InputGroup
                name={formFieldName}
                tag="div"
                validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode)}>
                {kanLeggeTilPeriode && (
                    <>
                        <Box margin="m" padBottom="xl">
                            <OmsorgstilbudPeriode periode={periode} onPeriodeChange={handleOnPeriodeChange} />
                        </Box>
                    </>
                )}
                <Box margin="l">
                    <SøknadsperioderMånedListe
                        periode={periode}
                        årstallHeadingLevel={3}
                        månedContentRenderer={omsorgstilbudMånedRenderer}
                    />
                </Box>
            </SøknadFormComponents.InputGroup>
        </>
    );
};

export default OmsorgstilbudVariert;
