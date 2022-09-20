import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import Lenke from 'nav-frontend-lenker';
import { Arbeidsgiver } from '../../../types';
import { FrilansFormData, FrilansFormField } from '../../../types/FrilansFormData';
import { harSvartErFrilanserISøknadsperioden, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { getFrilanserSluttdatoValidator } from '../validation/frilansSluttdatoValidator';
import { getFrilanserStartdatoValidator } from '../validation/frilansStartdatoValidator';
import FrilansoppdragInfo from './info/FrilansoppdragInfo';
import NormalarbeidstidSpørsmål from './normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';

const ArbFriFormComponents = getTypedFormComponents<FrilansFormField, FrilansFormData, ValidationError>();

interface Props {
    frilansoppdrag: Arbeidsgiver[];
    parentFieldName: string;
    formValues: FrilansFormData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
    urlSkatteetaten: string;
}

const ArbeidssituasjonFrilans = ({
    formValues,
    søknadsperiode,
    søknadsdato,
    frilansoppdrag,
    urlSkatteetaten,
}: Props) => {
    const {
        erFrilanserIPerioden,
        erFortsattFrilanser,
        fosterhjemsgodtgjørelse_mottar,
        fosterhjemsgodtgjørelse_harFlereOppdrag: fosterhjemsgodtgjørelse_flereOppdrag,
        startdato,
        sluttdato,
        arbeidsforhold,
    } = formValues;
    const intl = useIntl();

    const harFrilansoppdragIPerioden = harFrilansoppdrag(frilansoppdrag);
    const harSvartErFrilanserIPerioden = harSvartErFrilanserISøknadsperioden(søknadsperiode, formValues);
    const harGyldigStartdato = startdato ? ISODateToDate(startdato) : undefined;
    const harGyldigSluttdato = sluttdato ? ISODateToDate(sluttdato) : undefined;

    const erFrilanser = erFrilanserIPerioden === YesOrNo.YES || harFrilansoppdragIPerioden;

    const sluttetFørSøknadsperiode =
        erFortsattFrilanser === YesOrNo.NO &&
        harGyldigSluttdato &&
        dayjs(sluttdato).isBefore(søknadsperiode.from, 'day');

    const harBesvartSpørsmålOmFortsattFrilanser =
        erFortsattFrilanser === YesOrNo.YES || erFortsattFrilanser === YesOrNo.NO;

    const visOmFrilanserSpørsmål =
        erFrilanser &&
        ((fosterhjemsgodtgjørelse_mottar === YesOrNo.YES && fosterhjemsgodtgjørelse_flereOppdrag === YesOrNo.YES) ||
            fosterhjemsgodtgjørelse_mottar === YesOrNo.NO);

    const visNormalarbeidstidSpørsmål =
        harGyldigStartdato &&
        harBesvartSpørsmålOmFortsattFrilanser &&
        sluttetFørSøknadsperiode === false &&
        harSvartErFrilanserIPerioden;

    return (
        <div data-testid="arbeidssituasjonFrilanser">
            {harFrilansoppdragIPerioden ? (
                <FrilansoppdragInfo frilansoppdrag={frilansoppdrag} />
            ) : (
                <Box margin="l">
                    <ArbFriFormComponents.YesOrNoQuestion
                        name={FrilansFormField.erFrilanserIPerioden}
                        data-testid="er-frilanser"
                        legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                        validate={getYesOrNoValidator()}
                        description={
                            harFrilansoppdragIPerioden ? undefined : (
                                <ExpandableInfo title={intlHelper(intl, 'frilanser.hjelpetekst.spm')}>
                                    <p>
                                        {intlHelper(intl, 'frilanser.hjelpetekst')}{' '}
                                        <Lenke href={urlSkatteetaten} target="_blank">
                                            <FormattedMessage id="frilanser.hjelpetekst.skatteetatenLenke" />
                                        </Lenke>
                                    </p>
                                    <p>
                                        Merk at hvis du mottar <strong>omsorgsstønad</strong> eller{' '}
                                        <strong>fosterhjemsgodtgjørelse</strong> er dette frilansinntekt og du regnes
                                        for å være frilanser når du mottar dette.
                                    </p>
                                </ExpandableInfo>
                            )
                        }
                    />
                </Box>
            )}
            {erFrilanser && (
                <FormBlock>
                    <ArbFriFormComponents.YesOrNoQuestion
                        name={FrilansFormField.fosterhjemsgodtgjørelse_mottar}
                        data-testid="fosterhjemsgodtgjørelse_mottar"
                        legend={
                            frilansoppdrag.length === 1
                                ? intlHelper(intl, 'frilanser.erFrilansoppdragFosterhjemsgodgjørsel.spm')
                                : intlHelper(intl, 'frilanser.mottarFosterhjemsgodgjørsel.spm')
                        }
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>
            )}

            {erFrilanser && fosterhjemsgodtgjørelse_mottar === YesOrNo.YES && (
                <FormBlock>
                    <ArbFriFormComponents.YesOrNoQuestion
                        name={FrilansFormField.fosterhjemsgodtgjørelse_harFlereOppdrag}
                        data-testid="fosterhjemsgodtgjørelse_harFlereOppdrag"
                        legend={intlHelper(intl, 'frilanser.fosterhjemsgodtgjørelse_harFlereOppdrag.spm')}
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>
            )}

            {visOmFrilanserSpørsmål && (
                <Box margin="l">
                    <FormBlock>
                        <ArbFriFormComponents.DatePicker
                            name={FrilansFormField.startdato}
                            label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                            showYearSelector={true}
                            maxDate={søknadsdato}
                            validate={getFrilanserStartdatoValidator(formValues, søknadsperiode, søknadsdato)}
                        />
                    </FormBlock>
                    <FormBlock>
                        <ArbFriFormComponents.YesOrNoQuestion
                            name={FrilansFormField.erFortsattFrilanser}
                            legend={intlHelper(intl, 'frilanser.erFortsattFrilanser.spm')}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>
                    {erFortsattFrilanser === YesOrNo.NO && (
                        <FormBlock>
                            <ArbFriFormComponents.DatePicker
                                name={FrilansFormField.sluttdato}
                                label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                                showYearSelector={true}
                                minDate={datepickerUtils.getDateFromDateString(startdato)}
                                maxDate={søknadsdato}
                                validate={getFrilanserSluttdatoValidator(
                                    formValues,
                                    søknadsperiode,
                                    søknadsdato,
                                    harFrilansoppdragIPerioden
                                )}
                            />
                        </FormBlock>
                    )}
                    {visNormalarbeidstidSpørsmål && (
                        <FormBlock>
                            <NormalarbeidstidSpørsmål
                                arbeidsforholdFieldName={FrilansFormField.arbeidsforhold}
                                arbeidsforhold={arbeidsforhold || {}}
                                arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                erAktivtArbeidsforhold={erFortsattFrilanser === YesOrNo.YES}
                                brukKunSnittPerUke={true}
                            />
                        </FormBlock>
                    )}
                </Box>
            )}
        </div>
    );
};

export default ArbeidssituasjonFrilans;
