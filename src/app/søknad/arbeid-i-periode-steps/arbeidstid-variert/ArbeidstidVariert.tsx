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
import { Element, Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import EndreArbeidstid from './EndreArbeidstid';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { getMonthsInDateRange } from '../../../utils/common/dateRangeUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import { validateArbeidsTidEnkeltdager } from '../../../validation/validateArbeidFields';

interface Props {
    arbeidsstedNavn: string;
    formFieldName: SøknadFormField;
    periode: DateRange;
    jobberNormaltTimer: string;
    arbeidstidSøknadIPeriode?: DatoTidMap;
    intlValues: ArbeidIPeriodeIntlValues;
    søknadsdato: Date;
    kanLeggeTilPeriode: boolean;
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
    kanLeggeTilPeriode,
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
                periode={periode}
                søknadsdato={søknadsdato}
                arbeidsstedNavn={arbeidsstedNavn}
                intlValues={intlValues}
                åpentEkspanderbartPanel={antallMåneder === 1 || kanLeggeTilPeriode === false}
                onAfterChange={onArbeidstidChanged ? (tid) => onArbeidstidChanged(tid) : undefined}
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
            validate={() => validateArbeidsTidEnkeltdager(arbeidstidSøknadIPeriode, periode, intlValues)}
            tag="div">
            {kanLeggeTilPeriode ? (
                <>
                    <Undertittel tag="h3" style={{ fontSize: '1.125rem' }}>
                        Registrere jobb når det varierer i perioden
                    </Undertittel>
                    <p>
                        Når det varierer ...
                        {/* Du kan registrere jobb for flere perioder eller for enkeltdager. Enkeltdager registrerer du i
                        listen over måneder nedenfor. */}
                    </p>
                    <p>
                        <Element>Du kan oppgi jobb som</Element>
                        <ul>
                            <li>prosent for én eller flere perioder</li>
                            <li>timer per uke i én eller flere perioder</li>
                            <li>timer enkeltdager gjennom å velge dag i listen over måneder nedenfor</li>
                        </ul>
                    </p>
                    <Box margin="xl">
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
                </>
            ) : (
                <>
                    <Box padBottom="m">
                        <Undertittel style={{ fontSize: '1.125rem' }} tag="h3">
                            Hvor mye skal du jobbe?
                        </Undertittel>
                    </Box>
                    Her skal du registrere hvor mye du {intlValues.skalEllerHarJobbet} de ulike dagene i denne perioden.
                </>
            )}
            <FormBlock margin="l">
                {/* <Box padBottom="l">
                    <Element tag="h3">Registrert jobb</Element>
                </Box> */}
                <SøknadsperioderMånedListe
                    periode={periode}
                    årstallHeadingLevel={3}
                    månedContentRenderer={månedContentRenderer}
                />
            </FormBlock>
        </SøknadFormComponents.InputGroup>
    );
};

export default ArbeidstidVariert;
