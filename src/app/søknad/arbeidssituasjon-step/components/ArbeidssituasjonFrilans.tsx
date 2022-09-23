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
import { harFrilansoppdrag } from '../../../utils/frilanserUtils';
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
        fosterhjemsgodtgjørelse_harFlereOppdrag,
        startdato,
        sluttdato,
        arbeidsforhold,
    } = formValues;
    const intl = useIntl();

    const harFrilansoppdragIPerioden = harFrilansoppdrag(frilansoppdrag);
    const harGyldigStartdato = startdato ? ISODateToDate(startdato) : undefined;
    const harGyldigSluttdato = sluttdato ? ISODateToDate(sluttdato) : undefined;

    const erFrilanser = erFrilanserIPerioden === YesOrNo.YES || harFrilansoppdragIPerioden;

    const sluttetFørSøknadsperiode =
        erFortsattFrilanser === YesOrNo.NO &&
        harGyldigSluttdato &&
        dayjs(sluttdato).isBefore(søknadsperiode.from, 'day');

    const harBesvartSpørsmålOmFortsattFrilanser =
        erFortsattFrilanser === YesOrNo.YES || erFortsattFrilanser === YesOrNo.NO;

    const visOmFrilanserSpørsmål = erFrilanser;

    const mottarKunFosterhjemsgodtgjørsel =
        fosterhjemsgodtgjørelse_mottar === YesOrNo.YES && fosterhjemsgodtgjørelse_harFlereOppdrag === YesOrNo.NO;

    const visNormalarbeidstidSpørsmål =
        harGyldigStartdato &&
        harBesvartSpørsmålOmFortsattFrilanser &&
        sluttetFørSøknadsperiode === false &&
        mottarKunFosterhjemsgodtgjørsel === false;

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
                                        <FormattedMessage id="frilanser.hjelpetekst.2" />
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
                        description={
                            <ExpandableInfo title={intlHelper(intl, 'frilanser.fosterhjemsgodtgjørelse.info.tittel')}>
                                <FormattedMessage id="frilanser.fosterhjemsgodtgjørelse.info.tekst" />
                            </ExpandableInfo>
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
                            label={intlHelper(
                                intl,
                                mottarKunFosterhjemsgodtgjørsel
                                    ? 'frilanser.nårStartet_kunFosterhjemsgodtgjørelse.spm'
                                    : 'frilanser.nårStartet.spm'
                            )}
                            showYearSelector={true}
                            maxDate={søknadsdato}
                            validate={(value) => {
                                const error = getFrilanserStartdatoValidator(
                                    formValues,
                                    søknadsperiode,
                                    søknadsdato
                                )(value);
                                if (error) {
                                    const key = mottarKunFosterhjemsgodtgjørsel
                                        ? `validation.frilans.startdato_kunFosterhjemsgodtgjørelse.${error}`
                                        : `validation.frilans.startdato.${error}`;
                                    return {
                                        key,
                                        keepKeyUnaltered: true,
                                    };
                                }
                                return undefined;
                            }}
                        />
                    </FormBlock>
                    <FormBlock>
                        <ArbFriFormComponents.YesOrNoQuestion
                            name={FrilansFormField.erFortsattFrilanser}
                            legend={intlHelper(
                                intl,
                                mottarKunFosterhjemsgodtgjørsel
                                    ? 'frilanser.erFortsattFrilanser_kunFosterhjemsgodtgjørelse.spm'
                                    : 'frilanser.erFortsattFrilanser.spm'
                            )}
                            validate={(value) => {
                                const key = mottarKunFosterhjemsgodtgjørsel
                                    ? 'validation.frilans.erFortsattFrilanser_kunFosterhjemsgodtgjørelse.yesOrNoIsUnanswered'
                                    : 'validation.frilans.erFortsattFrilanser.yesOrNoIsUnanswered';
                                return getYesOrNoValidator()(value)
                                    ? {
                                          key,
                                          keepKeyUnaltered: true,
                                      }
                                    : undefined;
                            }}
                        />
                    </FormBlock>
                    {erFortsattFrilanser === YesOrNo.NO && (
                        <FormBlock>
                            <ArbFriFormComponents.DatePicker
                                name={FrilansFormField.sluttdato}
                                label={intlHelper(
                                    intl,
                                    mottarKunFosterhjemsgodtgjørsel
                                        ? 'frilanser.nårSluttet_kunFosterhjemsgodtgjørelse.spm'
                                        : 'frilanser.nårSluttet.spm'
                                )}
                                showYearSelector={true}
                                minDate={datepickerUtils.getDateFromDateString(startdato)}
                                maxDate={søknadsdato}
                                validate={(value) => {
                                    const error = getFrilanserSluttdatoValidator(
                                        formValues,
                                        søknadsperiode,
                                        søknadsdato,
                                        harFrilansoppdragIPerioden
                                    )(value);
                                    if (error) {
                                        const key = mottarKunFosterhjemsgodtgjørsel
                                            ? `validation.frilans.sluttdato_kunFosterhjemsgodtgjørelse.${error}`
                                            : `validation.frilans.sluttdato.${error}`;
                                        return {
                                            key,
                                            keepKeyUnaltered: true,
                                        };
                                    }
                                    return undefined;
                                }}
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
