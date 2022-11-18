import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import Lenke from 'nav-frontend-lenker';
import { harRegistrerteFrilansoppdrag } from '../../../utils/frilanserUtils';
import { ArbeidsforholdFrilansoppdragFormValues } from '../../../types/ArbeidsforholdFormValues';
import { SøknadFormField, SøknadFormValues } from '../../../types/SøknadFormValues';
import RegistrerteFrilansoppdragForm from './frilans/RegistrerteFrilansoppdragForm';
import NyttFrilansoppdragForm from './frilans/NyttFrilansoppdragForm';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import SøknadFormComponents from '../../../søknad/SøknadFormComponents';
import { guid } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType } from '../../../types';
import AddIcon from '../../../components/add-icon/AddIconSvg';

interface Props {
    frilansoppdrag: ArbeidsforholdFrilansoppdragFormValues[];
    søknadsperiode: DateRange;
    søknadsdato: Date;
    urlSkatteetaten: string;
}

const ArbeidssituasjonFrilans = ({ frilansoppdrag, søknadsperiode, søknadsdato, urlSkatteetaten }: Props) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormValues>();
    const søkerHarFrilansoppdrag = harRegistrerteFrilansoppdrag(frilansoppdrag);

    const leggTillFrilans = () => {
        const nyttFrilansoppdrag = [
            {
                arbeidsgiver: {
                    id: guid(),
                    type: ArbeidsgiverType.FRILANSOPPDRAG,
                },
            },
        ];

        setFieldValue(SøknadFormField.nyttFrilansoppdrag, [...values.nyttFrilansoppdrag, ...nyttFrilansoppdrag]);
    };

    return (
        <div data-testid="arbeidssituasjonFrilanser">
            {søkerHarFrilansoppdrag === false && (
                <Box margin="l">
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.erFrilanserIPeriode}
                        data-testid="er-frilanser"
                        legend={intlHelper(intl, 'steg.arbeidssituasjon.frilans.nyttOppdrag.erFrilanserIPeriode.spm')}
                        validate={getYesOrNoValidator()}
                        description={
                            søkerHarFrilansoppdrag ? undefined : (
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        'steg.arbeidssituasjon.frilans.nyttOppdrag.erFrilanserIPeriode.spm.description.tittel'
                                    )}>
                                    <>
                                        {intlHelper(
                                            intl,
                                            'steg.arbeidssituasjon.frilans.nyttOppdrag.erFrilanserIPeriode.spm.description'
                                        )}{' '}
                                        <Lenke href={urlSkatteetaten} target="_blank">
                                            <FormattedMessage id="steg.arbeidssituasjon.frilans.nyttOppdrag.erFrilanserIPeriode.spm.description.skatteetatenLenke" />
                                        </Lenke>
                                    </>
                                </ExpandableInfo>
                            )
                        }
                    />
                </Box>
            )}

            {søkerHarFrilansoppdrag && (
                <>
                    <Box>
                        <p>
                            <FormattedMessage id={'steg.arbeidssituasjon.frilans.registerteOppdrag.info'} />
                        </p>
                    </Box>

                    {frilansoppdrag.map((oppdrag, index) => (
                        <RegistrerteFrilansoppdragForm
                            oppdrag={oppdrag}
                            parentFieldName={`${SøknadFormField.frilansoppdrag}.${index}`}
                            søknadsdato={søknadsdato}
                            søknadsperiode={søknadsperiode}
                            key={index}
                        />
                    ))}
                </>
            )}

            {(søkerHarFrilansoppdrag || values.erFrilanserIPeriode === YesOrNo.YES) &&
                values.nyttFrilansoppdrag &&
                values.nyttFrilansoppdrag.map((oppdrag, index) => (
                    <NyttFrilansoppdragForm
                        oppdrag={oppdrag}
                        parentFieldName={`${SøknadFormField.nyttFrilansoppdrag}.${index}`}
                        søknadsdato={søknadsdato}
                        søknadsperiode={søknadsperiode}
                        key={index}
                        index={index + 1}
                    />
                ))}
            {(søkerHarFrilansoppdrag || values.erFrilanserIPeriode === YesOrNo.YES) && (
                <Box margin="l">
                    <Knapp htmlType={'button'} onClick={leggTillFrilans} kompakt>
                        <AddIcon />
                        <span>{intlHelper(intl, 'steg.arbeidssituasjon.frilans.leggTilOppdrag.btn')}</span>
                    </Knapp>
                </Box>
            )}
        </div>
    );
};

export default ArbeidssituasjonFrilans;
