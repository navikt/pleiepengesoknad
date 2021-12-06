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
import { Element } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import EndreArbeidstid from './EndreArbeidstid';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { getMonthsInDateRange } from '../../../utils/dateUtils';

interface Props {
    arbeidsstedNavn: string;
    formFieldName: SøknadFormField;
    periode: DateRange;
    jobberNormaltTimer: string;
    arbeidstidSøknadIPeriode?: DatoTidMap;
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
    arbeidstidSøknadIPeriode = {},
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
                åpentEkspanderbartPanel={antallMåneder === 1}
                onAfterChange={onArbeidstidChanged ? (tid) => onArbeidstidChanged(tid) : undefined}
            />
        );
    };

    return (
        <>
            <Element>Hvor mye skal du jobbe?</Element>
            <Box margin="m">
                <EndreArbeidstid
                    jobberNormaltTimer={jobberNormaltTimer}
                    intlValues={intlValues}
                    periode={periode}
                    formFieldName={formFieldName}
                    arbeidsstedNavn={arbeidsstedNavn}
                    arbeidstidSøknad={arbeidstidSøknadIPeriode}
                    onAfterChange={onArbeidstidChanged ? (tid) => onArbeidstidChanged(tid) : undefined}
                />
            </Box>
            <FormBlock margin="l">
                <Box margin="l" padBottom="l">
                    {/* <p>
                        For å registrere timer med jobb for enkeltdager, velger du nedenfor hvilken måned det gjelder
                        for:
                    </p> */}
                    <Element>Registrert arbeidstid:</Element>
                </Box>

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
