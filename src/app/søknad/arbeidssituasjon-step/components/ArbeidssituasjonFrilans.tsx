import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import Lenke from 'nav-frontend-lenker';
import { harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../types/ArbeidsforholdFormValues';
import { SøknadFormField, SøknadFormValues } from '../../../types/SøknadFormValues';
import ArbeidssituasjonFrilansOppdrag from './ArbeidssituasjonFrilansOppdrag';
import FrilansForm from './FrilansForm';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import SøknadFormComponents from '../../../søknad/SøknadFormComponents';
import { guid } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType } from '../../../types';

interface Props {
    frilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues[];
    søknadsperiode: DateRange;
    søknadsdato: Date;
    urlSkatteetaten: string;
}

const ArbeidssituasjonFrilans = ({ frilansoppdrag, søknadsperiode, søknadsdato, urlSkatteetaten }: Props) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormValues>();
    const søkerHarFrilansoppdrag = harFrilansoppdrag(frilansoppdrag);

    const leggTillFrilans = () => {
        const nyFrilansOppdrag = [
            {
                arbeidsgiver: {
                    id: guid(),
                    type: ArbeidsgiverType.FRILANSOPPDRAG,
                },
            },
        ];

        setFieldValue(SøknadFormField.nyfrilansoppdrag, [...values.nyfrilansoppdrag, ...nyFrilansOppdrag]);
    };

    return (
        <div data-testid="arbeidssituasjonFrilanser">
            <Box>
                <p>
                    <FormattedMessage id={'frilansoppdragListe.oppdrag.info'} />
                </p>
            </Box>
            {søkerHarFrilansoppdrag === false && (
                <Box margin="l">
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.erFrilanserIPeriode}
                        data-testid="er-frilanser"
                        legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                        validate={getYesOrNoValidator()}
                        description={
                            søkerHarFrilansoppdrag ? undefined : (
                                <ExpandableInfo title={intlHelper(intl, 'frilanser.hjelpetekst.spm')}>
                                    <>
                                        {intlHelper(intl, 'frilanser.hjelpetekst')}{' '}
                                        <Lenke href={urlSkatteetaten} target="_blank">
                                            <FormattedMessage id="frilanser.hjelpetekst.skatteetatenLenke" />
                                        </Lenke>
                                    </>
                                </ExpandableInfo>
                            )
                        }
                    />
                </Box>
            )}
            {søkerHarFrilansoppdrag &&
                frilansoppdrag.map((oppdrag, index) => (
                    <ArbeidssituasjonFrilansOppdrag
                        oppdrag={oppdrag}
                        parentFieldName={`${SøknadFormField.frilansoppdrag}.${index}`}
                        søknadsdato={søknadsdato}
                        søknadsperiode={søknadsperiode}
                        key={index}
                    />
                ))}

            {(søkerHarFrilansoppdrag || values.erFrilanserIPeriode === YesOrNo.YES) &&
                values.nyfrilansoppdrag &&
                values.nyfrilansoppdrag.map((oppdrag, index) => (
                    <FrilansForm
                        oppdrag={oppdrag}
                        parentFieldName={`${SøknadFormField.nyfrilansoppdrag}.${index}`}
                        søknadsdato={søknadsdato}
                        søknadsperiode={søknadsperiode}
                        key={index}
                    />
                ))}
            {(søkerHarFrilansoppdrag || values.erFrilanserIPeriode === YesOrNo.YES) && (
                <Box margin="m">
                    <Knapp htmlType={'button'} onClick={leggTillFrilans}>
                        {'Legg til ny Frilansoppdrag'}
                    </Knapp>
                </Box>
            )}
        </div>
    );
};

export default ArbeidssituasjonFrilans;
