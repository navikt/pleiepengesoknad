import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import SøknadsperioderMånedListe from '../../../pre-common/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { DatoTidMap } from '../../../types';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { validateOmsorgstilbudEnkeltdagerIPeriode } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import OmsorgstilbudMåned from './OmsorgstilbudMåned';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import RegistrerOmsorgstilbudPeriode from './RegistrerOmsorgstilbudPeriode';
import { Element } from 'nav-frontend-typografi';
import { useFormikContext } from 'formik';
import { skalViseSpørsmålOmProsentEllerLiktHverUke } from '../omsorgstilbudStepUtils';

interface Props {
    periode: DateRange;
    søknadsdato: Date;
    tidIOmsorgstilbud: DatoTidMap;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudVariert: React.FC<Props> = ({ periode, tidIOmsorgstilbud, søknadsdato, onOmsorgstilbudChanged }) => {
    const intl = useIntl();
    const gjelderFortid = dayjs(periode.to).isBefore(søknadsdato, 'day');
    const kanLeggeTilPeriode = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);
    const enkeltdagerFieldName = gjelderFortid
        ? SøknadFormField.omsorgstilbud__historisk__enkeltdager
        : SøknadFormField.omsorgstilbud__planlagt__enkeltdager;

    const omsorgstilbudMånedRenderer = (måned: DateRange) => {
        const mndOgÅr = dayjs(måned.from).format('MMMM YYYY');
        return (
            <div key={dayjs(periode.from).format('MM.YYYY')} className="omsorgstilbudKalender__mnd">
                <OmsorgstilbudMåned
                    formFieldName={enkeltdagerFieldName}
                    måned={måned}
                    periode={periode}
                    søknadsdato={søknadsdato}
                    kanLeggeTilPeriode={kanLeggeTilPeriode}
                    onAfterChange={onOmsorgstilbudChanged}
                    labels={{
                        addLabel: intlHelper(intl, 'omsorgstilbud.addLabel', {
                            periode: mndOgÅr,
                        }),
                        deleteLabel: intlHelper(intl, 'omsorgstilbud.deleteLabel', {
                            periode: mndOgÅr,
                        }),
                        editLabel: intlHelper(intl, 'omsorgstilbud.editLabel', {
                            periode: mndOgÅr,
                        }),
                        modalTitle: intlHelper(intl, 'omsorgstilbud.modalTitle', {
                            periode: mndOgÅr,
                        }),
                    }}
                />
            </div>
        );
    };
    const { setFieldValue } = useFormikContext<SøknadFormData>() || {};

    const handleOnPeriodeChange = (data: DatoTidMap) => {
        const dagerMedOmsorgstilbud = { ...tidIOmsorgstilbud, ...data };
        setFieldValue(enkeltdagerFieldName, dagerMedOmsorgstilbud);
        if (onOmsorgstilbudChanged) {
            onOmsorgstilbudChanged();
        }
    };

    return (
        <SøknadFormComponents.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${enkeltdagerFieldName}_dager` as any}
            tag="div"
            validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode, gjelderFortid)}>
            {kanLeggeTilPeriode && (
                <>
                    <Box margin="m" padBottom="xl">
                        <RegistrerOmsorgstilbudPeriode
                            periode={periode}
                            gjelderFortid={gjelderFortid}
                            onPeriodeChange={handleOnPeriodeChange}
                        />
                    </Box>

                    <Element tag="h3">
                        <FormattedMessage id="steg.omsorgstilbud.planlagt.månedsliste.tittel" />
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
    );
};

export default OmsorgstilbudVariert;
