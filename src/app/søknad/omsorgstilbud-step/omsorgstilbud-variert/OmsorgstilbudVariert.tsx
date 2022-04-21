import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import SøknadsperioderMånedListe from '@navikt/sif-common-pleiepenger/lib/common/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { DateDurationMap, getDatesInMonthOutsideDateRange, getMonthsInDateRange } from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import { Element } from 'nav-frontend-typografi';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { validateOmsorgstilbudEnkeltdagerIPeriode } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import { skalViseSpørsmålOmProsentEllerLiktHverUke } from '../omsorgstilbudStepUtils';
import OmsorgstilbudPeriode from './OmsorgstilbudPeriode';
import { OmsorgstilbudMåned } from '@navikt/sif-common-pleiepenger';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid/tid-enkeltdag-dialog/TidEnkeltdagForm';

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

    const { setFieldValue } = useFormikContext<SøknadFormData>() || {};
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
            />
        );
    };

    return (
        <>
            <Box padBottom="m">
                <Element tag="h3">{tittel}</Element>
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
                        <Element tag="h3">
                            <FormattedMessage id="steg.omsorgstilbud.månedsliste.tittel" />
                        </Element>
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
