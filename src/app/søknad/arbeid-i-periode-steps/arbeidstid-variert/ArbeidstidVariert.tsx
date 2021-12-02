import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import SøknadsperioderMånedListe from '../../../pre-common/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { DatoTidMap } from '../../../types';
import { SøknadFormField } from '../../../types/SøknadFormData';
import { ArbeidIPeriodeIntlValues } from '../ArbeidIPeriodeSpørsmål';
import ArbeidstidMåned from './ArbeidstidMåned';
import { Undertittel } from 'nav-frontend-typografi';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import EndreArbeidstid from './EndreArbeidstid';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { getMonthsInDateRange } from '../../../utils/dateUtils';

interface Props {
    arbeidsstedNavn: string;
    formFieldName: SøknadFormField;
    periode: DateRange;
    jobberNormaltTimer: string;
    arbeidstidSøknad?: DatoTidMap;
    intlValues: ArbeidIPeriodeIntlValues;
    søknadsdato: Date;
    onArbeidstidChanged?: (arbeidstid: DatoTidMap) => void;
}

const ArbeidstidVariert: React.FunctionComponent<Props> = ({
    formFieldName,
    arbeidsstedNavn,
    jobberNormaltTimer,
    periode,
    intlValues,
    søknadsdato,
    arbeidstidSøknad = {},
    onArbeidstidChanged,
}) => {
    const intl = useIntl();

    const antallMåneder = getMonthsInDateRange(periode).length;

    const månedContentRenderer = (måned: DateRange) => {
        const mndOgÅr = dayjs(måned.from).format('MMMM YYYY');
        return (
            <ArbeidstidMåned
                formFieldName={formFieldName}
                måned={måned}
                labels={{
                    addLabel: intlHelper(intl, 'arbeidstid.addLabel', { periode: mndOgÅr }),
                    deleteLabel: intlHelper(intl, 'arbeidstid.deleteLabel', {
                        periode: mndOgÅr,
                    }),
                    editLabel: intlHelper(intl, 'arbeidstid.editLabel', {
                        periode: mndOgÅr,
                    }),
                    modalTitle: intlHelper(intl, 'arbeidstid.modalTitle', {
                        periode: mndOgÅr,
                    }),
                }}
                arbeidsstedNavn={arbeidsstedNavn}
                periode={periode}
                intlValues={intlValues}
                søknadsdato={søknadsdato}
                åpentEkspanderbartPanel={antallMåneder <= 2}
                onAfterChange={onArbeidstidChanged ? (tid) => onArbeidstidChanged(tid) : undefined}
            />
        );
    };

    return (
        <>
            <Undertittel>Registrert arbeid i søknadsperioden</Undertittel>
            <Box margin="m">
                <ExpandableInfo title="Slik registrerer du arbeid">
                    <ul style={{ margin: '0', paddingLeft: '1rem' }}>
                        <li>Du kan legge inn så mange perioder du vil med arbeid innenfor søknadsperioden. </li>
                        <li>Du kan oppgi arbeid som prosent eller faste timer i uka </li>
                        <li>Du kan se det du har lagt inn som timer per dag på den måneden de gjelder</li>
                        <li>Du kan også legge inn enkeltdager ved å åpne en måned og klikke på en dag</li>
                        <li>
                            Hvis du har registrert feil så må du gå inn og velge samme periode på nytt og sette tid = 0.
                        </li>
                    </ul>
                </ExpandableInfo>
                <EndreArbeidstid
                    jobberNormaltTimer={jobberNormaltTimer}
                    intlValues={intlValues}
                    periode={periode}
                    formFieldName={formFieldName}
                    arbeidsstedNavn={arbeidsstedNavn}
                    arbeidstidSøknad={arbeidstidSøknad}
                    onAfterChange={onArbeidstidChanged ? (tid) => onArbeidstidChanged(tid) : undefined}
                />
            </Box>
            <FormBlock>
                <SøknadsperioderMånedListe
                    periode={periode}
                    årstallHeadingLevel={3}
                    månedContentRenderer={månedContentRenderer}
                />
            </FormBlock>
        </>
    );
};

export default ArbeidstidVariert;
