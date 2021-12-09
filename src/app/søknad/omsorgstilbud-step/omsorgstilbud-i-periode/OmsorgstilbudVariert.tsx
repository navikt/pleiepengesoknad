import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import SøknadsperioderMånedListe from '../../../pre-common/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { DatoTidMap } from '../../../types';
import { SøknadFormField } from '../../../types/SøknadFormData';
import { validateOmsorgstilbudEnkeltdagerIPeriode } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import OmsorgstilbudMåned from './OmsorgstilbudMåned';

interface Props {
    periode: DateRange;
    søknadsdato: Date;
    tidIOmsorgstilbud: DatoTidMap;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudVariert: React.FunctionComponent<Props> = ({
    periode,
    tidIOmsorgstilbud,
    søknadsdato,
    onOmsorgstilbudChanged,
}) => {
    const intl = useIntl();
    const gjelderFortid = dayjs(periode.to).isBefore(søknadsdato, 'day');

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
            <SøknadsperioderMånedListe
                periode={periode}
                årstallHeadingLevel={3}
                månedContentRenderer={omsorgstilbudMånedRenderer}
            />
        </SøknadFormComponents.InputGroup>
    );
};

export default OmsorgstilbudVariert;
